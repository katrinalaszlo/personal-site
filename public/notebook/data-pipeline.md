---
title: "Data Pipelines"
description: "How text becomes training data: tokenization, batching, packing, and evaluation metrics."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/data-pipeline
---

# Data Pipelines

> How text becomes numbers, gets fed to the model, and gets measured. The model never sees text — only integers.

## The full pipeline

> This experiment follows the flow below. `prepare.py` handles every stage except the model.

**Raw Text**
parquet files

->

**Tokenizer**
text -> integers

->

**Dataloader**
pack into batches

->

**Model**
predict next token

->

**Loss / BPB**
how wrong?

## The constants

> Fixed rules for every experiment. These live in `prepare.py` so every run is measured on equal terms.

MAX_SEQ_LEN
2,048
Tokens the model sees at once (context window)

TIME_BUDGET
300
Training time in seconds. 5 minutes, hard stop.

EVAL_TOKENS
~21M
Tokens to evaluate on (40 batches of 524,288)

VOCAB_SIZE
8,192
Unique tokens the model can recognize

> **Why 8,192?** GPT-4 uses ~128K tokens (cl100k_base). A smaller vocabulary means each token represents less text, so you need more tokens to encode the same content. But the model has fewer things to learn. Deliberate tradeoff for a 5-minute experiment: simplify the problem so small models can make progress.

## Tokenization: text to numbers

> The tokenizer converts text into integer IDs using BPE (Byte Pair Encoding).

Start with individual characters, then repeatedly merge the most common adjacent pairs into single tokens. Here's what that looks like for `"Hello world! 42"`:

BOS8188
Hell2401
o111
world1844
!33
32
425318

And for `"Transformers use self-attention."`:

BOS8188
Trans6752
form1014
ers414
use897
self1563
-45
att720
ention3104
.46

Things to notice:

- **BOS token** (Beginning of Sequence) marks where a new document starts. ID 8188.

- **Spaces attach** to the following word (" world" is one token, not "world").

- **Common words** become single tokens. Rare words get split into pieces.

- **Numbers cap at 2 digits** per token (regex `\p{N}{1,2}`). "123" becomes "12" + "3".

> **Connection to prepare.py:** The tokenizer is trained once by `prepare.py` and saved to `~/.cache/autoresearch/tokenizer/`. Training reads a billion characters and learns which byte pairs to merge. Lines 141-203.

## Packing tokens into batches

> The model processes fixed-size rows simultaneously. Zero wasted space.

Each row is exactly `MAX_SEQ_LEN + 1 = 2,049` tokens. The dataloader takes a stream of variable-length documents and packs them tightly. Here's how four documents pack into two rows of 12 tokens:

Row 0:
B
a
a
a
a
B
b
b
b
b
b
b

Row 1:
B
c
c
c
c
c
c
c
c
B
d
d

BOS
Doc A (4 tok)
Doc B (6 tok)
Doc C (8 tok)
Doc D (3 tok)

How it works:

- Every document starts with a **BOS token**, so the model always knows "new document begins here."

- **Best-fit packing**: find the largest document that fits remaining space. Like Tetris.

- If nothing fits, **crop the shortest document** in the buffer to fill exactly. 100% utilization, no padding.

- The buffer holds ~1,000 documents to choose from, giving good packing options.

> **Why packing matters:** The naive approach is one document per row, padded with zeros. But padding tokens are wasted compute -- the model processes them but learns nothing. With packing, every token is real data. At 524K tokens per step, even 5% padding waste = ~26K wasted tokens per step.

## Inputs and targets: the shift

> Given a sequence of tokens, predict the next one.

Each packed row splits into **inputs** (everything except the last token) and **targets** (everything except the first):

Packed:
B
The
cat
sat
on
the
mat

Input:
B
The
cat
sat
on
the
-

Target:
-
The
cat
sat
on
the
mat

At each position, the model sees all tokens up to that point and predicts what comes next. After "The cat sat," it should predict "on." After "The cat sat on," it should predict "the."

This is why the row is `T + 1 = 2,049` tokens, but the model's sequence length is `T = 2,048`. One extra token so the last input position has a target to predict.

```
# prepare.py lines 334-336: the shift
cpu_inputs.copy_(row_buffer[:, :-1])   # everything except last
cpu_targets.copy_(row_buffer[:, 1:])   # everything except first
gpu_buffer.copy_(cpu_buffer, non_blocking=True)
```

## Bits per byte (BPB)

> BPB measures how well the model predicts text it has not trained on.

1
Feed validation data through the model. For each token position, the model outputs a probability distribution over all 8,192 possible next tokens.

2
Compute **cross-entropy loss** at each position: how surprised was the model by the actual next token? High probability on the correct token = low loss. Surprised = high loss. Measured in **nats** (natural log units).

3
The clever part: different tokens represent different amounts of text. " world" = 6 bytes of UTF-8. "!" = 1 byte. BPB normalizes by **bytes**, not tokens. This makes the metric independent of vocabulary size.

4
Convert nats to bits (divide by ln(2)). Final number: **total bits of surprise / total bytes of text**.

```
# prepare.py lines 344-365: the actual evaluation

for _ in range(steps):
    x, y, _ = next(val_loader)
    loss_flat = model(x, y, reduction='none').view(-1)
    y_flat = y.view(-1)
    nbytes = token_bytes[y_flat]   # UTF-8 bytes each target token represents
    mask = nbytes > 0             # skip special tokens (0 bytes)
    total_nats += (loss_flat * mask).sum()
    total_bytes += nbytes.sum()

return total_nats / (log(2) * total_bytes)  # nats -> bits, per byte
```

> **Why BPB instead of loss?** Changing vocabulary size changes raw loss even if the model is equally good. A 100K-token model has lower per-token loss than an 8K-token model (fewer, more informative tokens = easier predictions). BPB normalizes by bytes of actual text, making it comparable across any tokenizer. It's the metric equivalent of "cost per byte of text understood."

> **Caveat:** BPB normalizes across tokenizers but is still affected by tokenizer quality. A tokenizer that wastes tokens on rare byte sequences forces the model to spend capacity on those sequences, indirectly raising BPB even on common text. The metric is tokenizer-agnostic in theory, tokenizer-sensitive in practice.

## Putting it together

> Complete data flow with actual numbers.

| Stage | What happens | Shape / Size |
| --- | --- | --- |
| Parquet files | Raw text documents on disk | ~6,500 shards |
| Tokenize | BPE encodes text to integer sequences | Variable-length lists (0-8191) |
| Pack into rows | Best-fit pack documents into fixed rows | [128 rows x 2,049 tokens] |
| Shift | Split into inputs (x) and targets (y) | x: [128 x 2,048]   y: [128 x 2,048] |
| Model forward | Predict next token at every position | logits: [128 x 2,048 x 8,192] |
| Loss / BPB | Compare predictions to actual targets | Single number (e.g., 0.9979) |

That logits shape is worth pausing on: `[128 x 2,048 x 8,192]`. That's 128 rows, each with 2,048 positions, each outputting a probability over 8,192 possible next tokens. **~2.1 billion numbers** per batch. All collapsed to a single loss that says "you were this wrong."

> **Next up:** Now you know how data gets prepared and measured. Next: what happens inside the "Model" box? That's `train.py` -- embeddings, attention, MLPs, and how they stack together. See [Model Architecture](/notebook/model-architecture.html).
