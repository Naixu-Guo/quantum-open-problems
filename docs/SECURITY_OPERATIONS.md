# Repository and public-service security

## Publishing and review

Two active repository rulesets apply to `main`:

- `Protect main` requires a pull request, resolved review threads, and the four
  GitHub Actions checks `validate`, `contract`, `ledger-guard`, and `service`.
  Checks must pass against the latest main. Force pushes and deletion are
  blocked. This ruleset has no bypass actors, including administrators.
- `Owner approval and merge` requires one approving review and code-owner
  approval. New pushes dismiss stale approvals, and the latest reviewable push
  requires approval from someone other than its pusher. An update restriction
  reserves final merging to `Naixu-Guo` (GitHub user ID `58557763`), the only
  bypass actor. That bypass is restricted to pull requests and retains GitHub's
  bypass audit trail.

`.github/CODEOWNERS` names `@Naixu-Guo` as the sole owner of every path, including
itself. Collaborators retain their existing branch push permissions to submit
PRs and can review each other's work. The owner makes the final approval and
merges; an approval from another collaborator cannot authorize a merge. GitHub
uses the base branch's CODEOWNERS, so a proposed ownership change still requires
the current owner's decision.

The owner can merge their own PRs, or PRs they last pushed, without waiting for
another reviewer. The separate `Protect main` ruleset still enforces CI, review
thread resolution, and the PR requirement. It also prevents force pushes and
branch deletion.

The update restriction is deliberate: the review-dismissal restriction did not
persist through either GitHub's REST or GraphQL API for this repository when
verified on 2026-09-15. Reserving merges to the owner ensures that dismissing a
review never gives another collaborator permission to publish to main.

When operating through the owner's account, merge only a PR the owner explicitly
authorized. Check its current changes and required CI before merging. That
approval also authorizes use of the owner's PR bypass for that PR; no
separate bypass confirmation is needed. GitHub records account actions and
reviews; it does not interpret approvals given in an external conversation.

The ruleset definitions are tracked in `.github/main-ruleset.json` and
`.github/owner-approval-ruleset.json`. Repository files do not configure GitHub
by themselves: apply both definitions through the repository rules settings or
API, then read back the active rules to verify that only the owner ruleset
allows the bypass and that its update restriction remains enabled.

Validation runs for every PR, including documentation-only changes, so required
checks cannot be stranded by workflow path filters. The Actions policy allows
only the actions currently used by the workflows and requires full commit SHAs,
including dependencies invoked by composite actions. Pages packaging directly
calls the pinned upload action to avoid an unpinned nested dependency.
Dependabot alerts are enabled. The unused, uninitialized wiki is disabled;
documentation lives in the reviewed repository.

## TeX and MathJax

The build rejects macro definitions and aliases before extracting mathematics,
after stripping TeX comments. Write expressions explicitly with standard
commands such as `\operatorname`, rather than `\DeclareMathOperator` or `\def`.
Both MathJax clients load `ui/safe`, permit HTTP(S) links, and reject user-supplied
CSS classes, IDs, and styles, as well as JavaScript, data, and file URLs. This
filter applies after macro expansion as a separate browser-side safeguard.

## Public API and submissions

Problem pages are capped at 1,000 rows and event pages at 500 rows before SQL
execution, even if callers ask for more. Invalid integer parameters return 400.
Use `nextOffset` for problem pages and `nextAfter` for events. Production catalog
polling runs every 60 seconds. Both API HTTPS hosts send HSTS and nosniff.
nginx limits direct API requests per client to 10 requests/second with a burst
of 40 and returns 429 on excess, in addition to the service's own limits. The
public MCP retains its existing host/origin and per-address checks.

Public proposals land only in the separate project SQLite inbox. Inbox keys
authorize proposal review, not ledger writes or any personal email account.
GitHub OAuth is unconfigured and its login routes are not exposed by nginx.
The public MCP is read-only and the catalog clone has no push credentials.

For this deployment, published records continue to enter through GitHub PRs.
Do not enable automatic contributor enrollment or authenticated ledger writes
against this read-only catalog clone. A future research write service needs its
own authenticated activity repository and reviewed publication/handoff path;
enabling OAuth alone is insufficient. This keeps unpublished comments and
contributions from accumulating solely on a server without a durable remote.

## Domain ownership

DNS routing and HTTPS do not prove ownership to GitHub Pages. The repository
owner must add `qiqc-op.com` under their personal **Settings → Pages**, publish
GitHub's DNS TXT challenge in Tencent DNS, and click **Verify**. Keep the TXT
record permanently. The Pages API's `protected_domain_state` should then report
the verified state. GitHub's current verifiable-domain GraphQL mutation supports
organizations and enterprises, not personal accounts.

See [GitHub's verification instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
and [MathJax's safe extension options](https://docs.mathjax.org/en/latest/options/safe.html).
