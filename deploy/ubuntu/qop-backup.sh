#!/bin/bash
set -euo pipefail
umask 077
install -d -m 0700 /var/backups/qop
exec 9>/run/lock/qop-backup.lock
flock -n 9 || exit 0
snapshot="/var/backups/qop/$(date -u +%Y%m%dT%H%M%SZ).tar.gz"
was_running=0
finish() {
    if [ "$was_running" = 1 ]; then systemctl start qop.service; fi
}
trap finish EXIT
if systemctl is-active --quiet qop.service; then
    was_running=1
    systemctl stop qop.service
fi
# Pause writes and polling while capturing the Git ledger and SQLite WAL files together.
tar -czf "$snapshot.partial" -C / var/lib/qop etc/qop
mv "$snapshot.partial" "$snapshot"
find /var/backups/qop -maxdepth 1 -name '*.tar.gz' -type f -mtime +14 -delete
echo "$snapshot"
