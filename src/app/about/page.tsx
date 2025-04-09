import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Voster</h1>
        
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-4">What is Voster?</h2>
          <p className="mb-4">
            Voster is a comprehensive video distribution platform designed to help content creators seamlessly 
            distribute their videos across multiple social media platforms. Our platform handles video uploads, 
            automatic transcription, AI-generated descriptions, and cross-platform posting—all in one place.
          </p>
          <p>
            Built with modern technologies like Next.js, AssemblyAI, and Llama on Groq, Voster aims to 
            make content distribution effortless so creators can focus on what matters most: creating great content.
          </p>
        </div>
        
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">1. Upload Your Video</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Upload your video content directly to our platform. We support various video formats and ensure 
              your content is securely stored and processed.
            </p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">2. Automatic Transcription</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We use AssemblyAI's powerful speech-to-text technology to automatically transcribe your video, 
              making your content more accessible and searchable.
            </p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">3. AI-Generated Descriptions</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our AI, powered by Llama on Groq, analyzes your video content and transcriptions to generate 
              platform-optimized descriptions and captions.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">4. Multi-Platform Distribution</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Post your content to multiple social media platforms simultaneously with platform-specific 
              optimizations for each, saving you time and maximizing your reach.
            </p>
          </div>
        </div>
        
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-4">Supported Platforms</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>YouTube</li>
            <li>Twitter/X</li>
            <li>Facebook</li>
            <li>Instagram</li>
            <li>TikTok</li>
            <li>More coming soon...</li>
          </ul>
        </div>
        
        <div className="flex justify-center">
          <Link href="/upload" className="btn-primary mr-4">
            Get Started
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 