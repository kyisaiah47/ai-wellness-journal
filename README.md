# AI Wellness Journal
A modern web application for tracking health symptoms, generating AI-powered health insights, and visualizing health patterns over time. Built with Next.js, TypeScript, Supabase, and Google Gemini API.

[![YouTube Demo](https://img.shields.io/badge/▶️%20Watch%20on%20YouTube-red?logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=myZLzRm9C4Q)
[![Watch the demo](https://img.youtube.com/vi/myZLzRm9C4Q/maxresdefault.jpg)](https://www.youtube.com/watch?v=myZLzRm9C4Q)

## Features

- Log daily symptoms, severity, and notes
- View health timelines and pattern analysis
- Get AI-generated health summaries and recommendations
- Doctor report and quick stats
- Responsive, user-friendly UI

## Tech Stack

- **Next.js** (React framework)
- **TypeScript**
- **Supabase** (database & auth)
- **Google Gemini API** (AI insights)
- **Tailwind CSS** (styling)
- **Lucide Icons**

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Supabase project & API keys
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/symptom-journal.git
   cd symptom-journal
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local` and fill in your Supabase and Gemini API keys.

### Running Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
public/           # Static assets
src/
  api/            # API routes
  app/            # Next.js app directory
  components/     # React components
  lib/            # Utility libraries (Supabase, Gemini)
```

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `NEXT_PUBLIC_GOOGLE_API_KEY` - Google Gemini API key

## Deployment

You can deploy to Vercel or any platform supporting Next.js. Set environment variables in your deployment dashboard.

## License

MIT

## Disclaimer

AI insights are for informational purposes only and do not replace professional medical advice.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
