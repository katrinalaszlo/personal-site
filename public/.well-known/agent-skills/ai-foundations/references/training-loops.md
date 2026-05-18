---
impact: HIGH
impactDescription: How models learn from data through forward pass, backward pass, and optimization
---

# Training Loops

The engine that turns random weights into a model that predicts text. Structure: predict, measure error, compute gradients, update weights, repeat.

## Forward Pass + Loss
Tokens go in, predictions come out, cross-entropy loss measures the gap. Loss starts high (~10, random guessing) and drops below 2 by end of training.

## Gradient Accumulation
GPU can't fit the full batch. Process in chunks, accumulate gradients, then do one optimizer step. Divide loss by accumulation steps so gradients average correctly.

## Backward Pass (Backpropagation)
loss.backward() walks the computation chain in reverse. At each parameter: "if I tweaked this slightly, would loss go up or down? By how much?" Answer is the gradient. Every parameter gets a .grad attribute.

## Optimizers
- **AdamW**: Industry standard. Tracks running average of gradients AND squared gradients. Consistent gradients get bigger updates. Noisy gradients get cautious updates. Used for embeddings, output head, normalization.
- **Muon**: Newer. Polar express orthogonalization finds maximally diverse update directions. Effective for large matrix multiplications in transformer blocks.

## Learning Rate Schedules
Three phases: warmup (ramp up), constant (full rate), cooldown (decay to zero). Different parameters get wildly different rates: output head 0.004, embeddings 0.6 (150x larger). Small changes to output head have huge effects on predictions. Embedding changes only affect sequences containing that token.

## Additional Schedules
- Momentum: low early (responsive), high later (stay the course)
- Weight decay: pushes parameters toward zero (regularization), fades over training
- Nesterov momentum: adjusts over training for stability
