---
title: "Model Architecture"
description: "Inside the neural network: embeddings, attention, multi-head attention, MLPs, and how depth and width shape a transformer."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/model-architecture
---

# Model Architecture

> What happens between "tokens go in" and "predictions come out" -- embeddings, attention, MLPs, and how they stack into a transformer.

  
  ## What The Model Actually Does

  > Start from the familiar thing: input goes in, output comes out.

  Type a prompt into ChatGPT, get a response back. Input, output. That's the model, whatever architecture sits underneath it. A **transformer** is one specific architecture for doing that translation from input to output, the one this page is about, and the one most models in use today are built from.

  Running the model to turn an input into an output is called **inference**. That's what's happening every time you send a message and get a reply: your prompt goes in, it runs through the transformer, a response comes out.

  **Training** uses the same forward pass as inference, input goes in, a prediction comes out, with one addition: the prediction gets checked against a known correct answer, and the model's numbers get nudged slightly so the next prediction lands closer. The difference between the two is what's available going in. During training, the full correct text already exists, so there's something to check the prediction against. During inference, it doesn't exist yet, that's the whole point, so the model generates one token at a time instead. Training repeats the predict-check-adjust step billions of times.

  > 
    **The one trick that makes this efficient:** instead of doing that "guess the next word" check one word at a time, training does it for an entire passage at once, every position predicting its own next token, all in a single pass. That only works because of **causal masking** (Part 5): each position is architecturally blocked from seeing anything after it, so predicting position 50 can't accidentally cheat by peeking at position 51, even though position 51 is sitting right there in the same input. The mask, not the data, is what keeps training honest.
  

  
  ## The Big Picture

  > The model's shape is defined by a handful of numbers. Everything else derives from these.

  
    n_embd
    512
    The "width" of the model: every token is a vector of 512 numbers

    DEPTH
    8
    Number of transformer blocks stacked on top of each other

    n_head
    4
    Number of attention heads (parallel attention computations)

    HEAD_DIM
    128
    Dimension per head. n_head = n_embd / HEAD_DIM

    vocab_size
    8,192
    Number of possible tokens (from prepare.py)

    sequence_len
    2,048
    Context window (from prepare.py)
  

  The model is a vertical stack. Data enters at the bottom and exits at the top:

  
    Softcap + LossCap logits, compute error
    lm_headProject 512 -> 8,192 (one score per vocab token)
    RMS NormFinal normalization
    Transformer Block &times;8Attention + MLP, with residual connections
    RMS NormNormalize before first block
    Token Embedding (wte)Lookup table: token ID -> 512-dim vector
    Input Token IDs[128, 2048] integers from the dataloader
  

  > 
    **Depth vs Width:** The model has two axes: depth (how many layers) and width (how big each layer is). Wider models need more layers to be effective, so width scales with depth. This is one of the key knobs you can turn in experiments.
  

  
  ## Token Embeddings: IDs to Vectors

  > Every token becomes a point in 512-dimensional space.

  The embedding layer (`wte`) is a lookup table with 8,192 rows and 512 columns. Feed in token ID 2401 ("Hell"), it returns row 2401: a vector of 512 numbers.

  # The embedding is literally a giant table
wte = nn.Embedding(8192, 512)  # shape: [8192, 512]

# Feed in token IDs, get vectors
x = wte(idx)  # [128, 2048] -> [128, 2048, 512]

  At first, these 512 numbers are random. During training, the model learns to arrange them so tokens with similar meanings end up near each other. "cat" and "dog" drift closer together. "cat" and "invoice" drift apart.

  > 
    **Why 512 dimensions?** Think of it as the model's vocabulary for describing tokens. Two dimensions could capture simple things (positive/negative, concrete/abstract). But language is complex: you need dimensions for grammar, topic, sentiment, formality, and thousands of other features. 512 gives the model enough room to encode rich meaning. This is the "width" -- making it bigger lets the model capture more nuance, at the cost of more computation.
  

  `wte` itself is a **weight** matrix: learned once during training, then frozen and reused for every input from then on. The 512-number **vector** it hands back for a given token is a different kind of thing entirely, it's created fresh, every single time the model runs, by looking up one row in that fixed table.

  > 
    **The one similarity worth keeping, and where it stops:** a recipe and a weight matrix are alike in exactly one way, both stay the same across many uses. That's it, the analogy shouldn't be stretched further: a recipe doesn't compute anything, it's just read. A weight matrix is not a fixed lookup like a recipe card; it's what does the transforming, multiplying against whatever comes in. What's genuinely true, though: the matrix is fixed, the output isn't. Every vector on this page, embeddings, Q, K, V, hidden states, gets recomputed on every run. Only the weights persist.
  

  
  ## Before Attention: What Came Before

  > Transformers replaced something. Knowing what clarifies why attention works the way it does.

  Before transformers, the standard architecture for sequences was the **RNN** (recurrent neural network), and its more capable version, the **LSTM**. Both processed a sequence one token at a time, updating a single hidden-state vector as they went.

  
    
      ### RNN / LSTM

      Processes tokens one step at a time. To reach token 50, information from token 1 has to survive 49 sequential updates, getting compressed a little each step. Order is built into the architecture itself, there's no separate concept of "position" to add.

    

    
      ### Transformer

      Every token attends directly to every earlier token in one hop, nothing decays in between. The whole sequence processes in parallel instead of step by step. But attention on its own has no sense of order at all, which is exactly why position has to be added back in (Part 6).

    

  

  The tradeoff: RNNs suffered the "vanishing gradient" problem, distant context faded the further back it sat. LSTMs added gates specifically to fight this, but the fixed-size hidden state was still a bottleneck, everything the model knew about the past had to live in one vector. Transformers solved the long-range problem with direct attention, but gave up recurrence's built-in sense of sequence, hence RoPE.

  > 
    **Connection:** This is also why causal masking (Part 5, just ahead) still matters even without recurrence: attention removes the long chain of sequential steps, but a token can still only see what came before it, never after. The asymmetry got much shorter and more direct, but it didn't disappear.
  

  
  ## Attention: "What Should I Pay Attention To?"

  > At every position, the model asks which previous tokens are relevant to predicting what comes next.

  ### The Three Projections: Q, K, V

  Each token's 512-dim vector gets transformed into three different roles:

  
    Embeddingone vector per token
    
      -> &times; W<sub>Q</sub> -> <strong style="color:var(--accent)">Query</strong> vector
      -> &times; W<sub>K</sub> -> <strong style="color:var(--orange)">Key</strong> vector
      -> &times; W<sub>V</sub> -> <strong style="color:var(--purple)">Value</strong> vector
    
  

  One embedding, three separate weight matrices, three different vectors out. Same input, three different jobs.

  Not shown yet: how Query and Key actually get compared to produce a score, and what happens to Value after that. That's the next two steps below, not skipped, just not here yet.

  
    
      ### Query & Key

      **Q**uery = "What am I looking for?" **K**ey = "What do I contain?" Each token's Query is compared against every previous token's Key. High score = "that token is relevant to me."

    

    
      ### Value

      **V**alue = "What do I offer?" Scores become percentages (sum to 1), then each token collects a weighted mix of previous tokens' Values. Finally projected back to 512 dims.

    

  

  ### Example Attention Pattern

  
    
      Step 1
      Query . Key
      Produces a raw score. Not a value, not a vector output, not a percentage yet.
    
    ->
    
      Step 2
      Softmax
      Turns raw scores into percentages that sum to 100%. These are the attention weights.
    
    ->
    
      Step 3
      Weighted sum of Value
      Each Value vector &times; its percentage, added together. This is the attention output -- not a "new value," that term already means something else.
    
  

  For the sentence "The cat sat on the mat", here's what one attention head might look like. Each row shows how much a token attends to previous tokens (causal: no peeking ahead):

  

    
    | 100% |  |  |  |  |  |

    | 25% | 75% |  |  |  |  |

    | 10% | 55% | 35% |  |  |  |

    | 8% | 15% | 52% | 25% |  |  |

    | 30% | 12% | 8% | 10% | 40% |  |

    | 5% | 35% | 18% | 12% | 5% | 25% |

  

  Grey cells are masked -- causal attention means a token can only attend to tokens that came before it, never after. If position 5 could see position 6, the model would be cheating.

  ### Why This Matters: Disambiguation

  Take the sentence *"I deposited money in the bank."* Before any attention happens, the initial representation for **bank** is ambiguous, it could lean toward a financial institution or a riverbank, nothing in the token itself has decided yet.

  When the model processes **bank** (the last token here), causal masking permits it to compare its Query against the Keys of everything at or before its own position: I, deposited, money, in, the, bank. This only works because **deposited** and **money** both come before **bank** in the sentence. If they came after, causal masking would block the comparison entirely, which is exactly why a sentence like "the bank of the river was flooded" doesn't work as an example here: river comes later, so bank could never attend to it.

  

    
    | 3% | 38% | 34% | 2% | 2% | 21% |

  

  Illustrative percentages, not a real model's output.

  The heavy weight lands on **deposited** and **money**, the tokens that actually disambiguate "bank" toward the financial sense. The attention output for bank is the weighted sum of *all* of these Value vectors, not just bank's own, the same mechanism from the three steps above, applied to a case where it actually matters. That output becomes part of bank's updated representation for the next layer. It does not overwrite or replace bank's original Value vector, that vector is a fixed intermediate product of this one pass; what changes is the token's representation carrying forward.

  ### Multi-Head: Parallel Attention

  The model doesn't run attention once. It runs it **4 times in parallel** (n_head = 4), each with its own Q, K, V projections. Each head can learn to pay attention to different things: one might focus on grammar, another on topic, another on recent context.

  # Splitting into heads
q = self.c_q(x).view(B, T, 4, 128)  # 4 heads, 128 dim each
k = self.c_k(x).view(B, T, 4, 128)
v = self.c_v(x).view(B, T, 4, 128)

  The 512-dim vector gets split into 4 heads of 128 dimensions each. Each head runs attention independently, then they get concatenated back to 512 and projected through `c_proj`.

  
  ## Position: Rotary Embeddings (RoPE)

  > Attention compares tokens but doesn't inherently know where they are.

  Without position information, "the cat sat on the mat" and "mat the on sat cat the" would look identical to attention. Rotary Position Embeddings (RoPE) solve this by **rotating** the Q and K vectors based on their position in the sequence.

  # Applied to Q and K before attention
q, k = apply_rotary_emb(q, cos, sin), apply_rotary_emb(k, cos, sin)

  Two tokens close together have similar rotations, so their dot product (the attention score) is naturally higher. Tokens far apart have very different rotations, making it harder to attend strongly. This gives the model a smooth, continuous sense of "how far apart are these two tokens?"

  > 
    **Analogy:** Token at position 0 gets rotated 0 degrees. Token at position 100 gets rotated 100x the base frequency. When Q and K are compared, the rotation difference encodes the distance between them. No separate position embedding needed -- position is baked into the attention computation.
  

  
  ## MLPs: Nonlinear Transformations

  > After attention gathers context, the MLP processes each token individually.

  If attention is "what should I pay attention to?", the MLP is "given what I've gathered, what should I compute?" The MLP applies learned transformations to compute nonlinear features from the representations.

  Three steps:

  

    - **Expand** from 512 to 2,048 dimensions (4x wider). This gives the model a bigger workspace.

    - **Activate** with ReLU-squared: zero out negative values, then square the positives. This introduces non-linearity (without it, stacking layers would be pointless, because multiple linear transforms collapse into one).

    - **Compress** back to 512, keeping only what matters.

  

  def forward(self, x):
    x = self.c_fc(x)          # [B, T, 512] -> [B, T, 2048]
    x = F.relu(x).square()    # zero negatives, square positives
    x = self.c_proj(x)        # [B, T, 2048] -> [B, T, 512]
    return x

  > 
    **Common misconception:** MLPs are sometimes described as "storing facts." More accurately, they apply learned transformations -- computing nonlinear features from the current representation. The model temporarily thinks in a higher-dimensional space to do complex pattern matching, then summarizes back to standard size.
  

  
  ## Residual Connections

  > The original signal always passes through. Each layer just adds a small correction.

  Each of the 8 layers is a "Block" that combines attention and MLP with a critical pattern -- the `x = x + ...` residual connection:

  def forward(self, x, ve, cos_sin, window_size):
    x = x + self.attn(norm(x), ve, cos_sin, window_size)  # attend + add back
    x = x + self.mlp(norm(x))                              # process + add back
    return x

  The output of attention gets **added to** the input, not replacing it. Same for MLP. Without residuals, information from early layers would degrade across 8 layers. With residuals, early information flows directly to the top. Each layer only needs to learn "what should I add or adjust?"

  This model goes further with **lambda mixing**: before each block, it mixes the current representation with the original embedding:

  # resid_lambda starts at 1.0, x0_lambda starts at 0.1 (both learnable)
x = self.resid_lambdas[i] * x + self.x0_lambdas[i] * x0

  This gives later layers direct access to the original token signal, even after many transformations.

  
  ## Output Head: Vectors to Predictions

  > Converting 512-dim vectors back into a prediction over the vocabulary.

  After 8 blocks, each token position holds a 512-dim vector encoding everything the model "thinks" about what comes next. The final step:

  x = norm(x)                        # normalize one last time
logits = self.lm_head(x)           # [B, T, 512] -> [B, T, 8192]
logits = logits.float()            # full precision for stability

# Softcap: one implementation choice (e.g. Gemma uses softcap=30)
softcap = 15
logits = softcap * tanh(logits / softcap)  # cap extreme values

if targets is not None:
    loss = cross_entropy(logits, targets)  # how wrong were we?

  `lm_head` is a linear projection from 512 to 8,192: for each position, it produces one score per token in the vocabulary. Higher score = model thinks that token is more likely to come next.

  The **softcap** (tanh capping at +/-15) prevents any single prediction from being too extreme. This is one implementation choice, not a universal standard -- different models use different values or skip it entirely. **Cross-entropy loss** then compares the prediction distribution against the actual next token.

  > 
    **Connection:** This single loss number flows backward through the entire model to update all weights. The [Training Loop](/notebook/training-loop.html) page covers exactly how that backward pass and optimization works.
  

  
  ## Putting It Together

  > Full shape trace and parameter count.

  ### Shape Tracker

  Every shape transformation from input to output:

  

    | | Input token IDs | [128, 2048] | Integers 0-8191 |

      | After embedding | [128, 2048, 512] | Each int -> 512-dim vector |

      | After norm | [128, 2048, 512] | Same shape, normalized values |

      | Q, K, V (in attention) | [128, 2048, 4, 128] | Split into 4 heads of 128 |

      | After attention | [128, 2048, 512] | Heads concatenated, projected |

      | MLP expanded | [128, 2048, 2048] | 4x wider for processing |

      | MLP compressed | [128, 2048, 512] | Back to model width |

      | ... repeat 8x ... |  |  |

      | Logits (lm_head) | [128, 2048, 8192] | One score per vocab token |

      | Loss | [1] | Single number: how wrong |

    
  

  ### Parameter Count

  Every number the model learns is a "parameter." Here's where the ~50M live:

  

    | | `wte` | Token embedding table | 4.2M |

      | `value_embeds` | Value embedding tables (4 layers) | ~16.8M |

      | `lm_head` | Output projection | 4.2M |

      | Transformer blocks | Attention + MLP x 8 layers | ~25M |

      | Scalars | Lambda weights (16 total) | 16 |

      | **Total** | **~50M** |

    
  

  The embedding tables (wte + value_embeds + lm_head) account for roughly half the parameters. This is characteristic of small models with small vocabularies. As models get larger, the transformer blocks dominate.

  
  ## Glossary

  > Every term on this page, alphabetized, for lookup after the fact.

  

    | | Attention output | The weighted sum of Value vectors for one token. Not the same as a Value vector itself, even though it's built from them. |

      | Attention percentages / attention weights | Softmax-normalized scores showing how much of each token's Value contributes. Computed fresh per input, not learned or stored, despite sharing the word "weights" with model weights. |

      | Biases | An added constant in a linear layer (`y = Wx + b`). Some architectures include it, many modern ones skip it. |

      | Causal masking | The rule that a token can only attend to itself and earlier tokens, never later ones. What makes parallel, whole-sequence training possible without cheating. |

      | Context | The tokens a given position is permitted to use. In a causal model, itself and everything before it, not "the past" in any real-world sense. |

      | Cross-entropy loss | A measurement of how wrong the model's predicted probability distribution was compared to the actual next token. |

      | Decoder-only | An architecture (GPT's) that keeps only causal self-attention and drops the encoder and cross-attention entirely, since there's no separate source sequence to process. |

      | Embedding | A lookup table mapping token IDs to vectors. |

      | Encoder-decoder | The original transformer architecture (2017), built for translation: a bidirectional encoder reads the source sequence, a causal decoder generates the output while also attending to the encoder's output. |

      | Inference | Running a trained model on an input to get an output. What happens every time a prompt is sent. |

      | Key vector | What a token signals it can be matched against, used to compare against another token's Query. |

      | Layer | One full processing stage in which every token begins with a current representation, participates in attention and further computation, and leaves with an updated representation. |

      | Logits | Raw, uncapped scores assigned to each possible next token, not yet a probability distribution. |

      | MLP | The part of each block that processes each token's representation individually after attention gathers context. |

      | Parameters | Every learnable number in the model, weights and biases combined. |

      | Query vector | What a token is looking for, computed from its own representation alone, independent of any Key it will later be compared against. |

      | Raw attention score | The unnormalized result of comparing one Query with one Key. Not yet a percentage, not a Value, not an output. |

      | Representation | The numerical vector currently associated with a token at a given stage of processing. Not a dictionary definition, a set of numbers. |

      | Residual connection | Adding a layer's output back to its input instead of replacing it, so information from earlier layers doesn't degrade. |

      | RNN / LSTM | The pre-transformer architecture for sequences, processing one token at a time with a single hidden state. |

      | RoPE (Rotary Position Embeddings) | A method for encoding token position by rotating Q and K vectors at attention time, since attention has no inherent sense of order on its own. |

      | Sequence-to-sequence (seq2seq) | RNN-based models with attention added on, used for tasks like translation, the step between plain RNNs and transformers. |

      | Softcap | A tanh-based cap on logits to prevent any single prediction from becoming too extreme. |

      | Token | One piece of text the model processes: a whole word, part of a word, punctuation, or a special marker. |

      | Training | The same forward pass as inference, plus comparing the output against a known correct answer and adjusting the weights. |

      | Transformer | The architecture that replaced recurrence with attention, allowing parallel processing and direct long-range connections. |

      | Value vector | The information a token can contribute if attention is placed on it. Not the token's meaning, not the relevance score, not the result of Query times Key. |

      | Vectors | The numbers a weight matrix produces for a specific input. Created fresh every run, never stored, unlike weights. |

      | Weights | The learned numbers inside a linear transformation. Fixed after training, reused for every input. |
