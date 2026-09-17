"""Interactive server-only setup; secrets are never accepted as CLI arguments."""
import base64
import getpass
import os
from pathlib import Path
import re
import secrets


def write_config(path, values):
    if any(not value or any(c in value for c in "\n\r'\x00") for value in values.values()):
        raise ValueError("All configuration values must be nonempty single-line values without quotes")
    if not re.fullmatch(r"https://[A-Za-z0-9.-]+(?::[0-9]+)?", values["QOP_MONITOR_URL"]):
        raise ValueError("Use a public HTTPS origin without a path")
    if not re.fullmatch(r"[1-9]\d*(?:,[1-9]\d*)*", values["QOP_MONITOR_GITHUB_IDS"]):
        raise ValueError("Use numeric GitHub account IDs, separated by commas")
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, "w") as stream:
        for key, value in values.items():
            stream.write(f"{key}='{value}'\n")


def main():
    target = Path(__file__).resolve().parent / ".env"
    if target.exists():
        raise SystemExit(".env already exists; edit it locally rather than replacing persistent encryption keys.")
    origin = input("Public HTTPS origin [https://research.qiqc-op.com]: ").strip().rstrip("/") or "https://research.qiqc-op.com"
    ids = input("Allowed numeric GitHub IDs [58557763]: ").strip() or "58557763"
    values = {
        "QOP_MONITOR_URL": origin,
        "QOP_MONITOR_GITHUB_IDS": ids,
        "QOP_MONITOR_REPOSITORY": "Naixu-Guo/quantum-open-problems",
        "GITHUB_CLIENT_ID": input("GitHub OAuth App client ID: ").strip(),
        "GITHUB_CLIENT_SECRET": getpass.getpass("GitHub OAuth App client secret: ").strip(),
        "QOP_MONITOR_GITHUB_TOKEN": getpass.getpass("Repository-scoped GitHub token: ").strip(),
        "JWT_SIGNING_KEY": secrets.token_hex(32),
        "STORAGE_ENCRYPTION_KEY": base64.urlsafe_b64encode(secrets.token_bytes(32)).decode(),
    }
    write_config(target, values)
    print(f"Saved private configuration to {target} (mode 0600).")
    print(f"OAuth callback: {origin}/auth/callback")
    print(f"ChatGPT MCP URL, after deployment: {origin}/mcp")


if __name__ == "__main__":
    main()
