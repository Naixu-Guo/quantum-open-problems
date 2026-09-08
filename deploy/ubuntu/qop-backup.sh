#!/bin/bash
set -euo pipefail
umask 077
install -d -m 0700 /var/backups/qop
exec 9>/run/lock/qop-backup.lock
flock -n 9 || exit 0
snapshot="/var/backups/qop/$(date -u +%Y%m%dT%H%M%SZ).tar.gz"
python3 /usr/local/libexec/qop-backup.py --output "$snapshot"
find /var/backups/qop -maxdepth 1 -name '*.tar.gz' -type f -mtime +14 -delete
