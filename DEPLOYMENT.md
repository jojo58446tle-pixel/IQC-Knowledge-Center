# IQC Knowledge Center - Deployment Guide

## Overview

This project integrates ADP/JOJO Conversation API via Netlify Functions for secure server-side API calls.

## Environment Variables

### Required (Netlify Dashboard)

Set these in **Netlify Dashboard → Site Settings → Environment Variables**:

| Variable | Description | Example |
|----------|-------------|---------|
| `JOJO_APP_KEY` | ADP Agent AppKey for authentication | `OjFNVduYPjznLhReFoHJSGFGiICPpTKb...` |

**Important:**
- Never commit `.env` files or AppKeys to Git
- Environment variables are only available in Netlify Functions (server-side)
- For local development, see `.env.example` below

### Local Development (Optional)

Create `.env` file in project root (not committed to Git):

```bash
JOJO_APP_KEY=your_appkey_here
```

## Deployment Steps

### 1. Connect to Netlify

```bash
npm install -g netlify-cli
netlify login
netlify init  # If first time
netlify link  # Link to existing site
```

### 2. Set Environment Variable

**Option A: Netlify Dashboard**
1. Go to your site on app.netlify.com
2. Navigate to **Site Settings → Environment Variables**
3. Add `JOJO_APP_KEY` with your ADP AppKey value
4. Click **Save**

**Option B: Netlify CLI**
```bash
netlify env:set JOJO_APP_KEY your_appkey_here
```

### 3. Deploy

```bash
# Build and deploy
npm run build
netlify deploy --prod

# Or use continuous deployment via Git
# Push to main branch for auto-deploy
```

### 4. Verify Deployment

1. Check **Deploys** tab in Netlify Dashboard
2. Verify Functions are deployed: `Site Overview → Functions`
3. Test chat endpoint: `https://your-site.netlify.app/.netlify/functions/chat`

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Browser   │────▶│ Netlify Function │────▶│  ADP API (Tencent)  │
│  (React)    │     │  (chat.ts)       │     │  wss.lke.tencent... │
└─────────────┘     └──────────────────┘     └─────────────────────┘
     │                      │
     │                      └─ AppKey from env
     │
     └─ /api/chat (POST)
```

## API Endpoints

### Frontend → Netlify Function

**POST** `/.netlify/functions/chat`

Request:
```json
{
  "message": "คำถามของคุณ",
  "conversationId": "uuid-optional"
}
```

Response:
```json
{
  "success": true,
  "conversationId": "uuid",
  "answer": "คำตอบจาก JOJO",
  "references": [
    {
      "id": "ref-1",
      "index": 1,
      "name": "SOP-IQC-001",
      "type": 2,
      "docName": "IQC Standard Operating Procedure",
      "url": "https://..."
    }
  ]
}
```

### Netlify Function → ADP API

**POST** `https://wss.lke.cloud.tencent.com/adp/v2/chat`

Headers:
```
Content-Type: application/json
```

Body:
```json
{
  "RequestId": "uuid",
  "ConversationId": "uuid",
  "AppKey": "${JOJO_APP_KEY}",
  "Contents": [{"Type": "text", "Text": "message"}],
  "VisitorId": "visitor-id",
  "Incremental": true,
  "EnableMultiIntent": true,
  "Stream": "enable"
}
```

## Troubleshooting

### "AI service is not configured"
- Check `JOJO_APP_KEY` is set in Netlify Environment Variables
- Redeploy after setting environment variable

### CORS errors
- Netlify Functions automatically handle CORS
- Ensure you're calling `/.netlify/functions/chat` not direct ADP API

### Build failures
- Run `npm run typecheck` locally first
- Check Node.js version >= 20.19.0
- Clear cache: `netlify deploy --build --prod --force`

### Function timeouts
- Default timeout: 10 seconds
- ADP API responses should be fast with streaming
- Check Netlify Function logs for details

## Rate Limits

ADP API Rate Limits (by plan):
- Free: 10 QPM
- Starter: 20 QPM
- Team: 60 QPM
- Enterprise: 600 QPM

## Security

- ✅ AppKey stored server-side (Netlify env)
- ✅ HTTPS enforced by Netlify
- ✅ CORS configured for browser access
- ✅ No AppKey exposed in client code
- ✅ Input validation on message field

## Local Development

```bash
# Install dependencies
npm install

# Run dev server + functions
npm run dev

# In separate terminal (for functions)
netlify dev
```

Access at: `http://localhost:8888` (Netlify Dev) or `http://localhost:4173` (Vite)

## Files Structure

```
/
├── netlify/
│   └── functions/
│       └── chat.ts          # ADP API proxy
├── src/
│   ├── pages/
│   │   └── ChatPage.tsx     # Main chat UI
│   ├── components/chat/
│   │   ├── ChatComposer.tsx
│   │   ├── AIAnswer.tsx
│   │   ├── ReferenceSources.tsx
│   │   └── ...
│   └── services/
│       └── chatService.ts   # API client
├── netlify.toml             # Netlify config
├── package.json
└── vite.config.ts
```

## Support

For issues:
1. Check Netlify Function logs (Dashboard → Functions → chat)
2. Verify ADP AppKey is valid and active
3. Test ADP API directly with cURL/Postman
4. Check browser console for client-side errors
