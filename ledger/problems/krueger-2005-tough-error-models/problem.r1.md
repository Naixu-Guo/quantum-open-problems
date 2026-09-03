---
id: 01M1HME780DEXQK7TV18Q29JJP
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Tough error models
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - krueger-2005-tough-error-models
origin: source-stated
posed: 2003-01-31
areaIds:
  - quantum-information
topicIds:
  - quantum-error-correction
keywords:
  - quantum error correction
  - error algebra
  - code dimension
  - worst-case noise
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
The universal correctable-code lower bound scales as n/e^4, while a simple worst-case upper bound scales as n/e. The gap is not closed.

The function c(e,n) gives the code dimension guaranteed against an arbitrary e-dimensional error space. Closing the gap would establish the worst-case rate available without assuming a noise model.

## Interpretation

The correct denominator is e^2(e^2+1), not e^2(e+1).
