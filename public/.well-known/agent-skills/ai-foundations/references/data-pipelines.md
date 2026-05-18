---
impact: MEDIUM
impactDescription: How raw text becomes training data through tokenization, batching, and packing
---

# Data Pipelines

The model never sees text. Only integers. This is how text becomes numbers.

## Tokenization (BPE)
Byte Pair Encoding: start with individual characters, repeatedly merge most common adjacent pairs into single tokens. "Hello world! 42" becomes a sequence of integer IDs. Vocabulary size: 8,192 tokens.

## Packing
Documents are variable length. Rows must be fixed size (2,049 tokens). Pack documents tightly into rows: short documents share a row, long documents span multiple. Zero wasted space.

## Inputs and Targets (The Shift)
Each row splits into inputs (all but last token) and targets (all but first). At each position, model sees tokens up to that point and predicts next. Row is T+1 = 2,049 so last input has a target to predict.

## Bits Per Byte (BPB)
The north star metric. Measures how efficiently the model predicts text. Converts cross-entropy loss to a compression-like metric. Lower = better predictions.

## Full Pipeline
Parquet files (raw text) to tokenize (BPE to integers) to pack into rows (128 x 2,049) to shift (inputs/targets) to model forward (logits: 128 x 2,048 x 8,192) to loss/BPB (single number). ~2.1 billion numbers per batch, collapsed to one loss value.
