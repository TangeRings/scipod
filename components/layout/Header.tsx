'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              SciPod
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/upload" className="text-gray-500 hover:text-gray-900">
              Upload
            </Link>
            <Link href="/review" className="text-gray-500 hover:text-gray-900">
              Review
            </Link>
            <Link href="/generate" className="text-gray-500 hover:text-gray-900">
              Generate
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 