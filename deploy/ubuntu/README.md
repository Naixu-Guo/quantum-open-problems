# Ubuntu deployment

The public catalog is hosted on GitHub Pages at `https://qiqc-op.com`.
The API is hosted on Tencent Cloud at `https://api.qiqc-op.com`, on
`43.160.217.208`. The original HTTPS IP endpoint remains available for
existing clients. These files are configuration templates for that host;
they contain no credentials.

- `/opt/qop/releases/<commit>`: immutable application releases, including contract dependencies.
- `/opt/qop/current`: symlink to the running application release.
- `/opt/node`: symlink to the installed Node.js 22 release.
- `/var/lib/qop/catalog`: full Git clone on `main`, owned by the `qop` service user.
- `/var/lib/qop/data`: persistent SQLite index, authentication, and proposal stores.
- `/etc/qop/service.env`: service settings; root-owned with mode `0600`.
- `/etc/qop/release`: deployed application commit, for rollback and restore.

Seed the code and catalog from a reviewed Git bundle when deploying local
commits that have not been pushed. Set the catalog clone's `origin` to
`https://github.com/Naixu-Guo/quantum-open-problems.git`. Background polling
imports valid appended catalog records and never pushes local commits.
Application updates require a new release and service restart. Never reset
the live catalog clone or delete SQLite stores to update application code.

Install `qop.service` in `/etc/systemd/system`, copy `service.env.example` to
`/etc/qop/service.env`, and create the directories above before starting it.
Run `npm --prefix contract ci` in the application release. The service binds
only to loopback; the public proxy replaces forwarded addresses before the
service trusts them. No API keys, GitHub OAuth application, or CAPTCHA secrets
are provisioned by these templates. Public catalog reads work without a key;
research writes require separately issued credentials.

Both HTTPS API hosts apply nginx per-client limits of 10 requests/second with a
burst of 40 and return 429 on excess. These directives belong in the nginx
HTTP context, as in the supplied site configuration files.

Remote catalog polling defaults to 60 seconds (`QOP_SYNC_INTERVAL_MS=60000`).
Each interval starts after the previous fetch completes. Local commits remain
visible on the next API read. Deployment changes must update an existing env
file too; changing the default does not override a configured interval.

## Optional submissions and editor access

The project proposal inbox is separate from research contributions and all email
accounts. Submitters need no login. Maintainers sign in at
`https://api.qiqc-op.com/inbox/` using an inbox-only access key; this grants no
ledger, MCP write, or personal mailbox access. The inbox files are served even
with `QOP_WEB_DIR=0`.

To enable basic protection, set these in the private `/etc/qop/service.env`:

```ini
QOP_SUBMISSIONS_MODE=basic
QOP_SUBMISSION_ORIGINS=https://qiqc-op.com,https://www.qiqc-op.com
QOP_SUBMISSIONS_PER_HOUR=10
```

Generate a new random key on the operator's computer:

```sh
node scripts/inbox-access-key.mjs /tmp/qop-inbox-access.txt
```

The access key is written only to the new file (mode 0600). The command prints
`QOP_INBOX_KEY_HASH=...`; add that hash to the private server environment.
Do not use a human-chosen password or commit the key file. Store the access key
in your password manager. To rotate it, generate a new file, replace the hash,
and restart the API; existing inbox sessions become invalid.

Set `contribute.submissionUrl=https://api.qiqc-op.com/api/v1/submissions` and
`contribute.spamProtection=basic` in `site/config.json`. Install the nginx inbox
location from `nginx-domain.conf`, restart the API, and verify allowed-origin
submission, anonymous-read denial, login, review, and logout before publishing
the enabled form. Basic mode uses limits, a honeypot, and duplicate suppression.
For CAPTCHA protection, set server mode `captcha`, configure `QOP_CAPTCHA_SECRET`
and the provider, change site `spamProtection` to `captcha`, and configure the
matching public widget site key. Unconfigured deployments stay closed.

Pages and the API deploy independently. Keep `contribute.allowAnonymous=false`
in `site/config.json` until the deployed API preserves `contributor.anonymous`.
Deploy the supporting API first, then verify with a synthetic proposal that
`anonymous: true` survives submission, authenticated inbox retrieval, and a
service restart, while the contributor's name, email, and affiliation remain
available privately. Only after these checks pass, set `allowAnonymous` to the
JSON boolean `true` and publish Pages. Older APIs silently discard this field.
With the flag off, the form offers named credit only and blocks restored drafts
that request anonymous credit; their saved preference and private contact details
are retained. Turn the flag off before rolling the API back to a version without
anonymous-credit support.

Inbox sessions expire after twelve hours. JSON exports for AI omit contact email
and request metadata and download to the maintainer's computer; no AI service is
called. The review note and status can be saved in the inbox. Marking accepted
does not publish a record. The usual catalog PR workflow still publishes it.
The inbox SQLite file is included in the existing daily backup.

Authenticated research writes remain a separate optional setup: provision a
verified human editor with `bootstrap-editor <numeric-github-user-id> "Full Name"`,
issue an editor key, configure an authenticated Git remote, and verify sync.
See the [service guide](../../service/README.md#running-locally-with-github-login).
Public HTTP MCP stays read-only.

## Public MCP endpoint

`https://api.qiqc-op.com/mcp` serves read-only Streamable HTTP MCP, using the
official SDK's stateless transport with both modern and legacy HTTP clients.
Users connect to this URL without downloading the repository or installing Node.

The MCP process is independent of the API process: `/opt/qop/mcp-current`
points to an immutable release, and `/etc/qop/mcp-release` records its commit.
In that release, install production dependencies with
`npm --prefix mcp ci --omit=dev --ignore-scripts`. Install `qop-mcp.service`,
copy `mcp.env.example` to `/etc/qop/mcp.env`, then enable it with
`systemctl enable --now qop-mcp`. The process binds `127.0.0.1:8788` and forwards
read calls to the existing API on port 8787. Install the `/mcp` location from
`nginx-domain.conf`, run `nginx -t`, then reload nginx. No new public port or
certificate is required.

The public process never loads a service API key or forwards client credentials.
Its advertised tools and upstream requests are limited to reads. Host and Origin
guards, a 64 KiB request limit, and a per-address limit of 240 requests per minute
apply. Enable `QOP_MCP_TRUST_PROXY` only with the nginx configuration that replaces
`X-Forwarded-For`. Allowed Origin values in the environment are hostnames.

For upgrades, install a new release and its dependencies, update only
`/opt/qop/mcp-current` and `/etc/qop/mcp-release`, then restart `qop-mcp`.
Roll back that symlink to the previous release if needed. The API's release,
catalog clone, and SQLite stores are independent of this process.

Use `systemctl status qop-mcp` and `journalctl -u qop-mcp` to diagnose it.
An ordinary browser GET to `/mcp` may return 405: test it with an MCP client
that performs protocol negotiation, lists tools, and calls `get_status`.

## Domain names and HTTPS

GitHub Pages uses the custom domain `qiqc-op.com` with a GitHub Actions
publishing workflow. Set the domain in the repository's Pages settings; this
workflow does not require a `CNAME` file. Enable HTTPS after GitHub provisions
the certificate. The site's canonical origin is `siteUrl` in `site/config.json`;
the MCP instructions use `mcp.url` from the same file. Publish the site
configuration changes with the next reviewed GitHub deployment.

DNSPod records, with the default routing line and TTL:

| Host | Type | Value |
| --- | --- | --- |
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `@` | A | `185.199.110.153` |
| `@` | A | `185.199.111.153` |
| `www` | CNAME | `naixu-guo.github.io` |
| `api` | A | `43.160.217.208` |

See [GitHub's custom domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

For the API, first configure an HTTP-only nginx server for `api.qiqc-op.com`
with the webroot below. Once public DNS resolves to the server, obtain a
certificate:

```sh
/opt/certbot/bin/certbot certonly --non-interactive --agree-tos \
  --register-unsafely-without-email --webroot \
  --webroot-path /var/lib/letsencrypt \
  -d api.qiqc-op.com --cert-name qop-api
```

Install `nginx-domain.conf` alongside `nginx.conf`, validate with `nginx -t`,
then reload nginx. Set `QOP_PUBLIC_URL=https://api.qiqc-op.com` in the existing
`/etc/qop/service.env` and restart `qop`. Preserve all other settings and data.
The existing `qop-certbot.timer` renews both certificates and reloads nginx.
Test the new certificate with `certbot renew --cert-name qop-api --dry-run --run-deploy-hooks`.

## Original IP endpoint

Use a current Certbot release (5.4 or later) with the webroot authenticator.
First serve `/var/lib/letsencrypt/.well-known/acme-challenge/` over HTTP on
port 80. Test challenge-file access from outside the host. Then request an
IP certificate with a separate staging configuration first, followed by:

```sh
/opt/certbot/bin/certbot certonly --non-interactive --agree-tos \
  --register-unsafely-without-email --preferred-profile shortlived \
  --webroot --webroot-path /var/lib/letsencrypt \
  --ip-address 43.160.217.208 --cert-name qop-ip
```

This uses an ACME account without a contact email. Certificates contain the
public IP; no self-signed certificate is used for public access. Install
`nginx.conf`, validate with `nginx -t`, and reload nginx. Open TCP ports 80 and
443 in the Tencent Cloud instance firewall. Keep 8787 private. Install and
enable `qop-certbot.timer`: the IP certificate lasts about six days, so the
timer checks every six hours and reloads nginx after renewal. Test renewal
with `certbot renew --dry-run --run-deploy-hooks`.

See [Let's Encrypt's IP certificate instructions](https://letsencrypt.org/2026/03/11/shorter-certs-certbot.html).

## Operations

```sh
systemctl status qop qop-mcp nginx
journalctl -u qop -n 80 --no-pager
curl --fail https://api.qiqc-op.com/api/v1/status
systemctl list-timers 'qop-*'
```

Remote MCP clients connect directly to `https://api.qiqc-op.com/mcp`.
The optional local stdio adapter instead uses
`QOP_SERVICE_URL=https://api.qiqc-op.com` to access the underlying REST API.

## Backups and rollback

Install `qop-backup.sh` as `/usr/local/libexec/qop-backup` and `qop-backup.py`
as `/usr/local/libexec/qop-backup.py`, then enable `qop-backup.timer`.
At 03:15 UTC it uses SQLite's online backup API (including committed WAL data)
and a self-contained Git bundle. API and MCP processes keep running. It retries
if the catalog HEAD changes during the snapshots and publishes no archive if
it cannot capture a stable catalog. Check a failed timer run and retry it.

Version-2 archives contain `manifest.json`, `catalog.bundle`, `data/`, optional
`artifact-store/`, and `configuration/` (the private `/etc/qop` settings).
The index database is disposable; it is rebuilt from the restored ledger.
Archives in `/var/backups/qop` are root-only and retained for 14 days. Copy
them to separate storage for protection against loss of the server.

To roll back application code, point `/opt/qop/current` to a compatible
previous release and restart `qop`; preserve `/var/lib/qop`. For a full restore,
stop `qop` and `qop-mcp`, retain current state in a separate directory, and
extract a trusted archive into a private staging directory. For format 2,
clone `catalog.bundle` to `/var/lib/qop/catalog` using `catalogBranch` from
the manifest, verify its HEAD equals `catalogHead`, and set its remote back
to the intended GitHub repository. Restore `data/` to `/var/lib/qop/data`,
`artifact-store/` under the catalog's `activity/` if present, and
`configuration/` to `/etc/qop`. Restore ownership (`qop:qop` for `/var/lib/qop`,
root for `/etc/qop`) and private permissions. Deploy the API and MCP commits
named in `/etc/qop/release` and `/etc/qop/mcp-release`, then start both services.
Older archives instead contain `var/lib/qop` and `etc/qop` directly. Restore
matching code and data after an incompatible schema migration; never print
authentication data or secrets while diagnosing a restore.

## Content license consent

When deploying the licensing policy, update the service before publishing the
new proposal form. The service preserves explicit `contentLicense: "CC-BY-4.0"`
consent in each receipt. Older clients still work, but an absent license value
means permission needs confirmation; the inbox shows this distinction. Do not
backfill consent on older proposals. See [LICENSING.md](../../LICENSING.md).
