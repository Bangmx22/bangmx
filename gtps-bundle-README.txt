GTPS Bundle - Setup Notes
==========================
Generated: 2026-09-10

## gtps-local (port 8443)
- Express server dengan helmet + compression
- Health check: GET /health
- Static files: public/
- Status: RUNNING

## gtps-proxy / GrowProxy
- Proxy Growtopia: ENet + HTTPS interception
- HTTPS intercept: port 9443 (konfigurasi non-root)
- ENet proxy: port 16999
- Scripts: coreCommands.js loaded
- Status: RUNNING (background)

## DNS (Virtual Hosts app)
- www.growtopia1.com -> 192.168.1.3
- growtopia2.com -> 192.168.1.3

## Known Issue
- Virtual Hosts app: DNS-only, tidak ada port redirect
- Growtopia client pakai port 443, proxy listen di port 9443
- Tanpa root: tidak bisa bind port 443 di Termux Android
- Butuh: fitur port redirect, VPS, atau router port forwarding

## Restore Instructions
1. cd gtps-local && npm install && node index.js
2. cd gtps-proxy && npm install && node src/index.js
3. Setup DNS entries di Virtual Hosts app
