'use client';

import { AppHero } from '../ui/ui-layout'; // You can still use AppHero to structure
import Link from 'next/link'; // To link to the fusogen program page
import Image from 'next/image';

export default function DashboardFeature() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-black relative">
      {/* Video Section */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-6" style={{ width: '30vw', height: '30vw' }}>  {/* Adjust as needed */}
          <Image
            src="/logo.svg"
            alt="Logo"
            layout="fill"  // This allows the image to fill the parent div
            objectFit="contain"  // Ensures the image retains its aspect ratio
          />
        </div>


      </div>

      {/* Button to enter the application */}
      <div className="relative z-10 mt-6">
        <Link href="/fusogen">
          <button
            className="bg-black text-white text-opacity-50 text-lg md:text-2xl px-8 py-4 flex items-center justify-center rounded-lg"
          >
            Enter App
          </button>
        </Link>
      </div>
    </div>
  );
}