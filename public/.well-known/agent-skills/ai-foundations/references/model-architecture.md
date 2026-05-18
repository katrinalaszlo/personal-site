---
impact: HIGH
impactDescription: Core understanding of how transformer models process tokens into predictions
---

# Model Architecture

A transformer is a vertical stack. Data enters at the bottom, predictions exit at the top.

## Token Embeddings
Vocabulary IDs become vectors via lookup table (wte). 8,192 rows, 512 columns. Token ID in, 512-dim vector out. During training, similar tokens drift closer in vector space.

## Attention: Q, K, V
At every position, the model asks which previous tokens are relevant. Three projections per token:
- Query = "What am I looking for?"
- Key = "What do I contain?"
- Value = "What do I offer?"
Query dot-product with Keys produces attention scores. Scores become weights. Weighted sum of Values becomes the output. Causal masking prevents attending to future tokens.

## Multi-Head Attention
512-dim vector splits into 4 heads of 128 dims each. Each head learns different attention patterns (grammar, topic, recency). Concatenated back to 512, projected through c_proj.

## Positional Encoding (RoPE)
Rotary Position Embeddings rotate Q/K vectors based on position. Close tokens have similar rotations (stronger attention). Far tokens have different rotations (weaker attention). Continuous, smooth sense of distance.

## MLPs
After attention gathers context, MLP processes each token individually. Up-projection to 4x width, activation function, down-projection back. Nonlinear feature computation.

## Residual Connections
Original signal always passes through. Each layer adds corrections via x = x + layer(x). Without residuals, early information degrades across layers. Lambda mixing gives later layers direct access to original embeddings.

## Output Head
512-dim vectors projected to vocabulary size (8,192). Softcap prevents extreme predictions. Cross-entropy loss compares against actual next token.
