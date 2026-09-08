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

## Domain names and HTTPS

GitHub Pages uses the custom domain `qiqc-op.com` with a GitHub Actions
publishing workflow. Set the domain in the repository's Pages settings; this
workflow does not require a `CNAME` file. Enable HTTPS after GitHub provisions
the certificate. The site's canonical origin is `siteUrl` in `site/config.json`;
the MCP instructions use `mcp.serviceUrl` from the same file. Publish the site
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
systemctl status qop nginx
journalctl -u qop -n 80 --no-pager
curl --fail https://api.qiqc-op.com/api/v1/status
systemctl list-timers 'qop-*'
```

Point the local stdio MCP adapter's `QOP_SERVICE_URL` at
`https://api.qiqc-op.com`. This HTTPS API is not a Streamable HTTP MCP endpoint;
the client still launches `mcp/src/server.ts` locally.

## Backups and rollback

Install `qop-backup.sh` as `/usr/local/libexec/qop-backup` and enable
`qop-backup.timer`. It briefly stops the API at 03:15 UTC each day to capture
a consistent ledger and SQLite snapshot, then restarts it even if archiving
fails. Archives in `/var/backups/qop` are root-only and retained for 14 days.
Copy them to separate storage for protection against loss of the server.

To roll back application code, point `/opt/qop/current` to a compatible
previous release and restart `qop`; preserve `/var/lib/qop`. For a full restore,
stop `qop`, retain the current state in a separate directory, restore
`var/lib/qop` and `etc/qop` from a trusted backup, and deploy the commit named
in `/etc/qop/release`. Restore matching code and data together after an
incompatible schema migration. Never print the authentication database or
secrets when diagnosing a restore.
