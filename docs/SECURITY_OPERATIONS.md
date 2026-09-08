# Repository and public-service security

## Publishing and review

The `Protect main` repository ruleset requires a pull request, one approving
review, code-owner approval, approval of the latest push by another person,
resolved review threads, and these four GitHub Actions checks: `validate`,
`contract`, `ledger-guard`, and `service`. Checks must pass against the latest
main. New pushes dismiss stale approvals. Force pushes and deletion are blocked.
There are no bypass actors, including administrators.

`.github/CODEOWNERS` assigns infrastructure to the existing maintainers and
scientific records to the scientific collaborators. The file itself requires
maintainer review. Someone other than the PR author must approve; the service
does not generate approvals or bypass this requirement. Keeping branch push
permissions allows collaborators to propose changes without direct main access.

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
