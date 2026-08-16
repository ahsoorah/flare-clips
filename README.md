# flare-clips 

A lightweight, serverless media pipeline for uploading, securing, and serving high-quality gameplay clips and videos via Cloudflare's edge network.

---

## 🏗️ Architecture Overview

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
