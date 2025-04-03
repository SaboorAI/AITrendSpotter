import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:order-2 space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
                />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"
                />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">LinkedIn</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2023 AI Hunt. All rights reserved.
            </p>
          </div>
        </div>
        
        <div className="mt-8 border-t border-neutral pt-8 flex flex-col md:flex-row justify-between">
          <nav className="flex flex-wrap justify-center md:justify-start space-x-6">
            <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900 mb-2">
              About
            </Link>
            <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-900 mb-2">
              Blog
            </Link>
            <Link href="/careers" className="text-sm text-gray-500 hover:text-gray-900 mb-2">
              Careers
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900 mb-2">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900 mb-2">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900 mb-2">
              Contact
            </Link>
          </nav>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center justify-center md:justify-end">
              <Link href="/" className="flex items-center">
                <span className="text-primary font-bold text-lg mr-1">AI</span>
                <span className="text-textColor font-bold text-lg">Hunt</span>
              </Link>
            </div>
            <p className="mt-2 text-sm text-gray-500 text-center md:text-right">
              Discover the most exciting AI products
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
