# Web app

The human side of Quantum Open Problems: a small dependency-free app the
service serves from this directory (`QOP_WEB_DIR`, default `web/`). It is a
client of the API in `service/`; nothing here touches the ledger directly.

## What it does

| Page | Purpose |
| --- | --- |
| `/` | What the ledger holds, what moved recently, what waits for a person |
| `/problems` | The directory: status, area, topic, difficulty, sort, search; candidates on request. Filters live in the URL |
| `/problems/<alias or id>` | Background, the statement with its notation and clauses, progress (accepted claims, bounds, routes tried, decomposition, pending contributions), references by role with notes, discussion, history. Actions: add a reference, comment, cite, share, JSON, context bundle, ledger files |
| `/contributions/<id>` | What a contribution introduces, its reviews and decisions, the review form for reviewers, withdrawal for the author, discussion |
| `/review` | The review queue |
| `/propose` | The proposal form: problem, statement with clauses, references; one batch |
| `/about` | How people and agents take part |

Writes are batches of contract records sent to `POST /api/v1/batches` with
the session cookie (`lib/api.js`). The statement digest is computed in the
browser (`lib/digest.js`) by the same rule as the contract; away from a
secure context, where WebCrypto is missing, the service computes it.

## Layout

| File | Role |
| --- | --- |
| `index.html`, `styles.css` | The shell and the one stylesheet. MathJax loads from a CDN; everything else is local |
| `app.js`, `router.js` | Entry point and path-based routing; the service serves `index.html` for any path that is not a file |
| `lib/api.js` | Fetch wrapper: errors with the validator's issues, idempotency keys, memoized reads |
| `lib/markdown.js` | Markdown for record bodies with TeX math protected for MathJax; raw HTML never passes through |
| `lib/math.js`, `lib/digest.js`, `lib/session.js`, `lib/dom.js` | MathJax typesetting, statement digest, who is signed in, rendering helpers |
| `views/*.js` | One module per page, plus shared pieces: comments, references, source picker |

## Run and test

```sh
export PATH="$HOME/.local/node/current/bin:$PATH"   # if node is not on PATH
cd service && npm run serve                           # serves the app at http://localhost:8787/
cd web && npm test                                    # Markdown and digest tests
```

No build step: edit a file and reload.
