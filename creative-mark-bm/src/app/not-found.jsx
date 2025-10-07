"use client";

import { useRouter } from 'next/navigation';
import { useTranslation } from '../i18n/TranslationContext';
import Image from 'next/image';

export default function NotFound() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            {/* Animated 404 Number */}
            <div className="text-9xl sm:text-[12rem] font-bold text-[#242021] opacity-10 select-none">
              404
            </div>
            
            {/* Logo Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#ffd17a] to-[#ffd17a]/80 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
                <Image 
                  src="/CreativeMarkFavicon.png" 
                  alt="CreativeMark Logo" 
                  width={64}
                  height={64}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('notFound.title') || 'Page Not Found'}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 max-w-lg mx-auto">
            {t('notFound.description') || 'Sorry, we couldn\'t find the page you\'re looking for. It might have been moved, deleted, or you entered the wrong URL.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.back()}
            className="group bg-[#242021] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#242021]/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('notFound.goBack') || 'Go Back'}
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="group bg-[#ffd17a] text-[#242021] px-8 py-4 rounded-xl font-semibold hover:bg-[#ffd17a]/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
          >
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t('notFound.goHome') || 'Go Home'}
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {t('notFound.needHelp') || 'Need Help?'}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('notFound.helpDescription') || 'If you believe this is an error, please contact our support team.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/client/support')}
              className="text-[#242021] hover:text-[#ffd17a] font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
              </svg>
              {t('notFound.contactSupport') || 'Contact Support'}
            </button>
            
            <span className="hidden sm:inline text-gray-300">•</span>
            
            <button
              onClick={() => window.location.reload()}
              className="text-[#242021] hover:text-[#ffd17a] font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t('notFound.refreshPage') || 'Refresh Page'}
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#ffd17a]/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-[#242021]/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-[#ffd17a]/5 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-5 w-8 h-8 bg-[#242021]/5 rounded-full animate-pulse delay-700"></div>
      </div>
    </div>
  );
}
