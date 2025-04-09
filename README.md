# Voster - AI-Powered Video Distribution Platform

Voster is a modern web application that simplifies video distribution across multiple social media platforms using AI. It automatically transcribes video content, generates platform-specific descriptions, and allows for seamless publishing to various social media platforms.

## Features

- **Video Upload & Management**: Easily upload and manage your video content.
- **AI Transcription**: Automatic video transcription powered by AssemblyAI.
- **Smart Description Generation**: Generate optimized descriptions for each platform using Llama on Groq.
- **Multi-Platform Publishing**: Distribute your content to multiple social platforms from a single dashboard.
- **Real-time Processing**: Track the status of your video processing in real-time.

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: GibsonAI Cloud Database
- **AI Services**: 
  - AssemblyAI for video transcription
  - Llama on Groq for description generation
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- GibsonAI Cloud Database credentials
- AssemblyAI API key
- Groq API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/voster.git
   cd voster
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following environment variables:
   ```
   # API Keys
   ASSEMBLYAI_API_KEY=your_assemblyai_api_key
   GROQ_API_KEY=your_groq_api_key
   
   # GibsonAI Cloud Database
   GIBSON_API_URL=your_gibson_api_url
   GIBSON_API_KEY=your_gibson_api_key
   
   # App Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
voster/
├── public/            # Static assets
│   └── uploads/       # Uploaded videos
├── src/
│   ├── app/           # App router pages
│   │   ├── api/       # API routes
│   │   ├── dashboard/ # Dashboard page
│   │   ├── upload/    # Upload page
│   │   └── videos/    # Video detail pages
│   ├── components/    # Reusable components
│   ├── lib/           # Utility functions and API clients
│   ├── styles/        # Global styles
│   └── types/         # TypeScript type definitions
├── next.config.js     # Next.js configuration
└── tailwind.config.js # TailwindCSS configuration
```

## API Endpoints

### Video Management

- `POST /api/videos/upload` - Upload a new video
- `GET /api/videos` - Get all videos for a user
- `GET /api/videos/:id` - Get a specific video
- `DELETE /api/videos/:id/delete` - Delete a video

### Social Publishing

- `POST /api/videos/:id/publish` - Publish a video to a social platform

### Webhooks

- `POST /api/webhooks/transcription` - Webhook for AssemblyAI transcription completion

## Workflow

1. **Upload**: Users upload their video through the upload page.
2. **Processing**: The video is stored, and audio is extracted for transcription.
3. **Transcription**: The audio is sent to AssemblyAI for transcription.
4. **Description Generation**: Once transcribed, the text is sent to Llama on Groq to generate platform-specific descriptions.
5. **Publishing**: Users can review generated descriptions and publish to selected platforms.

## Development

### Adding a New Social Platform

1. Add the platform to the `Platform` enum in `src/types/index.ts`.
2. Implement the platform-specific publishing logic in the API service.
3. Update the UI components to include the new platform.

### Custom Description Templates

Description templates for each platform can be modified in the Groq prompt within `src/lib/groq.ts`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [AssemblyAI](https://www.assemblyai.com/) for providing transcription services
- [Groq](https://groq.com/) for powering the description generation with Llama
- [Next.js](https://nextjs.org/) for the React framework
- [TailwindCSS](https://tailwindcss.com/) for styling
