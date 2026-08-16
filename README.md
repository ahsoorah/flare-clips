# flare-clips 

A lightweight, serverless media pipeline for uploading, securing, and serving high-quality gameplay clips and videos via Cloudflare's edge network.

---

## Architecture Overview
---

```text
Local Client (FFmpeg / Script)
          │
          ▼  [POST with Bearer Auth]
Cloudflare Worker API (api.domain.dev)
    ├── Token Authentication (`API_KEY`)
    └── Rate Limiting (`Workers KV`)
          │
          ▼  [Put Object]
Cloudflare R2 Storage (vice-clips)
          │
          ▼  [Direct CDN Delivery / Zero Egress]
Public Custom Domain (clips.domain.dev / direct MP4)
```
---
## Features
---

    Edge Authentication & Rate Limiting: Cloudflare Worker validates API requests and enforces upload thresholds via Workers KV.

    Zero-Egress Hosting: Direct object delivery via Cloudflare R2 custom domain routes.

    Optimized Video Delivery: Streamlined for Discord embed playback and web sharing.

# Setup & Deployment
---
## 1. Prerequisites

    Node.js and npm installed

    Cloudflare account with R2 enabled

    Wrangler CLI installed (npm install -g wrangler)

--

## 2. Configure Cloudflare Resources

    Create an R2 bucket (vice-clips).

    Create a Workers KV namespace (AUTH_LIMITS).

    Set your secret API key:
    wrangler secret put API_KEY

--
## 3. Deploy
   #Copy and configure the template
   cp wrangler.toml.example wrangler.toml

   #Deploy Worker to the edge
   wrangler deploy
--

## 4: Commit and Push

Push the changes to GitHub:

```bash
git add .
git commit -m "feat: add worker code, upload scripts, and architecture docs"
git push origin main
   
