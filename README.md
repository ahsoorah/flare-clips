# flare-clips 

A lightweight, serverless media API built to manage gameplay clips and videos. This worker acts as the secure backend for a web dashboard, hooking into Cloudflare R2 storage where clips are automatically ingested via a custom Linux (Fedora) folder-watching daemon directly from [Vice](https://github.com/eklonofficial/Vice).
---

## Architecture Overview

```text
[Ingestion Phase]
Local Linux environment (Fedora)
    ├── Vice (Configured to record 1440p gameplay footage)
    └── Custom background daemon (Watches folder & auto uploads)
             │
             ▼  [Direct PUT]

[Storage & Delivery Phase]
Cloudflare R2 Storage (vice-clips)
             │
             ▼  [Direct CDN Delivery]
Public custom domain (clips.yourdomain.com / direct MP4)

[Management Phase]
Web dashboard (manager.yourdomain.com)
             │
             ▼  [GET / DELETE with `x-api-key`]
Cloudflare worker API (api.yourdomain.com)

```
---
## Features
---

    Edge Authentication & Rate Limiting: Cloudflare Worker validates API requests and enforces upload thresholds via Workers KV.

    Zero-Egress Hosting: Direct object delivery via Cloudflare R2 custom domain routes.

    Optimized Video Delivery: Streamlined for Discord embed playback and web sharing.
---
## Local Ingestion Daemon (`clip-uploader.sh`)

Running locally on Fedora Linux, this background script utilizes `inotifywait` to monitor a folder on my machine in the [Vice](https://github.com/eklonofficial/Vice) capture directory in real-time. Upon detecting a completed video write (`close_write` or `moved_to`), it automatically:
1. Validates the file extension (`.mp4`, `.mkv`, etc.)
2. Pushes the raw video file straight to Cloudflare R2 using the S3-compatible API
3. Automatically copies the direct CDN link to the Wayland clipboard via `wl-copy`
4. Triggers a native KDE Plasma desktop notification (`notify-send`) confirming the upload

---
# Setup & Deployment
---
## 1. Prerequisites

    Node.js and npm installed

    Cloudflare account with R2 enabled

    Wrangler CLI installed (npm install -g wrangler)



## 2. Configure Cloudflare Resources

    Create an R2 bucket (vice-clips).

    Create a Workers KV namespace (AUTH_LIMITS).

    Set your secret API key:
    wrangler secret put API_KEY


## 3. Deploy
    #Copy and configure the template
    cp wrangler.toml.example wrangler.toml

    #Deploy Worker to the edge
    wrangler deploy


## 4: Commit and Push

Push the changes to GitHub:

```bash
git add .
git commit -m "feat: add worker code, upload scripts, and architecture docs"
git push origin main
   
