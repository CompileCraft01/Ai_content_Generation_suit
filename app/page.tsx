import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { HoverButton } from "@/components/ui/hover-button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    // Full-screen background with the geometric pattern extending across entire page
    <div className="min-h-screen bg-neutral-900">
      {/* Transparent Header section */}
      <header className="absolute top-0 left-0 right-0 z-50 w-full bg-transparent text-sm py-3 sm:py-0">
        <nav className="relative max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8" aria-label="Global">
          <div className="flex items-center justify-between">
            <div>
              <Image src={'/logo.svg'} alt="logo" width={150} height={150} />
            </div>
          </div>
          <div id="navbar-collapse-with-animation" className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end sm:ps-7">
              <Link href="/dashboard" className="flex items-center gap-x-2 font-medium text-gray-700 hover:text-blue-600 sm:border-s sm:border-gray-300/50 py-2 sm:py-0 sm:ms-4 sm:my-6 sm:ps-6 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-blue-500 backdrop-blur-sm bg-white/10 px-4 rounded-lg" >
                <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                </svg>
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>
      
      {/* Full-screen Hero Section with background extending across entire viewport */}
      <div className="relative min-h-screen bg-neutral-900">
        {/* Geometric background that extends beyond screen height to cover features */}
        <div className="absolute inset-0" style={{ height: '150vh' }}>
          <HeroGeometric
            badge="Creator AI"
            title1="AI Content"
            title2="Generator"
          />
        </div>
        
        {/* Content overlay positioned in front of background - positioned at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pb-32 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Get Started Button - positioned directly below the title */}
            <div className="mb-8">
              <HoverButton href="/dashboard">
                Get started
                <svg className="flex-shrink-0 size-4 ml-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </HoverButton>
            </div>
            
            {/* Descriptive paragraph - positioned below the button */}
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-white/90 drop-shadow-lg">
                Revolutionize your content creation with our AI-powered app, delivering engaging and high-quality text in seconds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features section with dark background */}
      <div className="relative z-10 bg-neutral-900 max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 items-center gap-2">
          {/* Feature 1 */}
          <a className="group flex flex-col justify-center hover:bg-white/5 rounded-xl p-4 md:p-7 backdrop-blur-sm transition-all duration-300 border border-white/10" href="#">
            <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl">
              <svg className="flex-shrink-0 size-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="10" height="14" x="3" y="8" rx="2"/><path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4"/><path d="M8 18h.01"/></svg>
            </div>
            <div className="mt-5">
              <h3 className="group-hover:text-white text-lg font-semibold text-white drop-shadow-lg">25+ templates</h3>
              <p className="mt-1 text-white/80 drop-shadow-md">Responsive, and mobile-first project on the web</p>
              <span className="mt-2 inline-flex items-center gap-x-1.5 text-sm text-blue-300 decoration-2 group-hover:underline font-medium">
                Learn more
                <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </span>
            </div>
          </a>
          
          {/* Feature 2 */}
          <a className="group flex flex-col justify-center hover:bg-white/5 rounded-xl p-4 md:p-7 backdrop-blur-sm transition-all duration-300 border border-white/10" href="#">
            <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl">
              <svg className="flex-shrink-0 size-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
            </div>
            <div className="mt-5">
              <h3 className="group-hover:text-white text-lg font-semibold text-white drop-shadow-lg">Customizable</h3>
              <p className="mt-1 text-white/80 drop-shadow-md">Components are easily customized and extendable</p>
              <span className="mt-2 inline-flex items-center gap-x-1.5 text-sm text-blue-300 decoration-2 group-hover:underline font-medium">
                Learn more
                <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </span>
            </div>
          </a>
          
          {/* Feature 3 */}
          <a className="group flex flex-col justify-center hover:bg-white/5 rounded-xl p-4 md:p-7 backdrop-blur-sm transition-all duration-300 border border-white/10" href="#">
            <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl">
              <svg className="flex-shrink-0 size-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div className="mt-5">
              <h3 className="group-hover:text-white text-lg font-semibold text-white drop-shadow-lg">Free to Use</h3>
              <p className="mt-1 text-white/80 drop-shadow-md">Every component and plugin is well documented</p>
              <span className="mt-2 inline-flex items-center gap-x-1.5 text-sm text-blue-300 decoration-2 group-hover:underline font-medium">
                Learn more
                <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </span>
            </div>
          </a>

          {/* Feature 4 */}
          <a className="group flex flex-col justify-center hover:bg-white/5 rounded-xl p-4 md:p-7 backdrop-blur-sm transition-all duration-300 border border-white/10" href="#">
            <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl">
              <svg className="flex-shrink-0 size-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
            </div>
            <div className="mt-5">
              <h3 className="group-hover:text-white text-lg font-semibold text-white drop-shadow-lg">24/7 Support</h3>
              <p className="mt-1 text-white/80 drop-shadow-md">Contact us 24 hours a day, 7 days a week</p>
              <span className="mt-2 inline-flex items-center gap-x-1.5 text-sm text-blue-300 decoration-2 group-hover:underline font-medium">
                Learn more
                <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

