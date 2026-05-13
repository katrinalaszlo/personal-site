---
name: ai-foundations
description: >-
  How neural networks work from tokens to predictions. Covers transformer model
  architecture (embeddings, attention, Q/K/V projections, multi-head attention,
  RoPE positional encoding, MLPs, residual connections, output head), training
  loops (forward pass, backward pass, gradients, loss functions, optimization,
  learning rate schedules, overfitting, regularization), and data pipelines
  (tokenization, BPE, batching, packing, evaluation metrics). Use when learning
  or explaining how LLMs work internally, debugging model behavior, or
  understanding why a model produces certain outputs.
metadata:
  author: Katrina Laszlo
  version: "1.0.0"
---

# AI Foundations

How AI models work from the ground up. Three topics: architecture, training, and data.

## Model Architecture

A transformer is a vertical stack. Data enters at the bottom, predictions exit at the top.

1. **Token Embeddings**: vocabulary IDs become 512-dim vectors via lookup table. Training arranges similar tokens nearby.
2. **Attention**: at every position, model asks which previous tokens are relevant. Q/K/V projections, causal masking, multi-head parallel attention (4 heads of 128 dims each).
3. **Position (RoPE)**: rotary embeddings encode position by rotating Q/K vectors. Close tokens have similar rotations, stronger attention.
4. **MLPs**: after attention gathers context, MLP processes each token individually. Nonlinear transformations via up-projection, activation, down-projection.
5. **Residual connections**: original signal always passes through. Each layer adds corrections, not replacements.
6. **Output head**: 512-dim vectors projected to vocabulary size. Softmax over scores gives next-token probabilities.

## Training Loops

Forward pass produces predictions. Loss function measures error. Backward pass computes gradients. Optimizer updates weights. Repeat.

Key concepts: cross-entropy loss, gradient descent, Adam optimizer, learning rate warmup and decay, batch size tradeoffs, overfitting vs underfitting, regularization (dropout, weight decay).

## Data Pipelines

Raw text becomes training data through tokenization (BPE), batching, and packing. Evaluation uses perplexity, BLEU, ROUGE, or task-specific metrics.

## References

See `references/` for detailed content on each topic.
