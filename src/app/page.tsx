import Link from 'next/link';
import { 
  ArrowUpTrayIcon, 
  VideoCameraIcon, 
  GlobeAltIcon, 
  PresentationChartLineIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <main>
      {/* Hero section */}
      <section className="relative bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-24 sm:py-32">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Distribute videos across social platforms with AI
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Upload once, share everywhere. Voster transcribes your videos, generates optimized descriptions for each platform, and posts automatically.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard" className="btn-primary">
                  Go to Dashboard
                </Link>
                <Link href="/upload" className="btn-secondary">
                  Upload a Video
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl flex items-center justify-center">
                <VideoCameraIcon className="h-24 w-24 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Streamline Your Video Distribution
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                <ArrowUpTrayIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Simple Upload
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Drag and drop your videos to upload. We handle the processing automatically.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                <PresentationChartLineIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                AI-Powered Descriptions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI generates platform-optimized descriptions from your video content.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                <GlobeAltIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Multi-Platform Publishing
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Post to multiple social platforms with a single click. Maximize your reach.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="bg-primary-600 dark:bg-primary-900">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to streamline your video distribution?
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Start uploading videos today and let our AI handle the rest. Save time and reach more viewers across platforms.
            </p>
            <Link href="/dashboard" className="btn-white">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 