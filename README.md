<div align="center">

<img src="assets/banner.png" alt="banner" width="100%" />

# 🩺 AI Wellness Journal

**Track symptoms, get AI-powered insights, and walk into doctor appointments prepared**

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

<br/>

AI Wellness Journal lets you log daily symptoms with severity ratings and personal notes, then surfaces AI-powered health summaries and pattern analysis over time. It generates structured doctor-ready reports so you arrive at every appointment with clear, organized context — shifting healthcare from reactive to preventive.

## ✨ Features

- **Symptom Logging** — Record daily symptoms, severity levels, and freeform notes in seconds
- **Health Timeline** — Visualize patterns and trends across your symptom history
- **AI-Powered Insights** — Google Gemini analyzes your logs and generates personalized health summaries
- **Doctor Report Generation** — Produce structured, shareable reports that make appointments more productive
- **Quick Stats Dashboard** — At-a-glance view of your recent health activity and recurring patterns
- **Responsive UI** — Clean, accessible interface built for both desktop and mobile

## 🎥 Demo

[![Watch Demo](https://img.shields.io/badge/YouTube-Watch%20Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=myZLzRm9C4Q)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Database & Auth | Supabase |
| AI | Google Gemini API |
| Styling | Tailwind CSS + Lucide Icons |

## 🚀 Getting Started

**Prerequisites:** Node.js v18+, a Supabase project, and a Google Gemini API key.

```bash
git clone https://github.com/kyisaiah47/ai-wellness-journal.git
cd ai-wellness-journal
npm install
cp .env.local.example .env.local   # fill in your Supabase + Gemini keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_GOOGLE_API_KEY=
```

> **Disclaimer:** AI insights are for informational purposes only and do not replace professional medical advice.

## 📄 License

MIT
