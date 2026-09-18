FROM node:22.16.0-bookworm-slim AS node
FROM python:3.11-slim-bookworm

COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && apt-get update && apt-get install -y --no-install-recommends git ca-certificates libstdc++6 \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --uid 10001 --create-home monitor
WORKDIR /app
COPY requirements.lock ./
RUN pip install --no-cache-dir --require-hashes -r requirements.lock
RUN node --version && npm --version && python -c "import fastmcp, pypdf; from key_value.aio.stores.disk import DiskStore"
COPY --chown=monitor:monitor qop_monitor ./qop_monitor
COPY --chown=monitor:monitor skills ./skills
RUN mkdir -p /var/lib/qop-monitor && chown monitor:monitor /var/lib/qop-monitor
USER monitor
ENV QOP_MONITOR_DATA=/var/lib/qop-monitor QOP_MONITOR_BIND=0.0.0.0 QOP_MONITOR_PORT=8790
EXPOSE 8790
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8790/healthz', timeout=4)"
CMD ["python", "-m", "qop_monitor.server"]
