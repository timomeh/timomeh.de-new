import Link from 'next/link'
import React from 'react'

import { Navigation } from '@/app/Navigation'
import { Logo } from '@/components/Logo'
import { Prose } from '@/components/Prose'

// `app/not-found.tsx` only works when `notFound()` was called, but not
// globally. For global 404 pages, the old `pages/404.tsx` is still necessary.
// But this won't be rendered when `notFound()` was called, so you need both.
// Yayyyyyyyy

export default function NotFound() {
  return (
    <OldLayout>
      <Prose>
        <h1>Not found :(</h1>
        <p>
          Sorry, you either found a broken link, or clicked an old link. If you
          think I did something wrong, feel free to reach out.
        </p>
      </Prose>
    </OldLayout>
  )
}

function OldLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="absolute flex justify-center h-80 w-full z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute h-[300px] flex-none w-[800px] -ml-[600px] bg-gradient-radial from-pink-500/20 via-transparent" />
        <div className="absolute h-[300px] flex-none w-[800px] bg-gradient-radial from-cyan-500/20 via-transparent" />
        <div className="absolute h-[300px] flex-none w-[800px] -mr-[600px] bg-gradient-radial from-lime-500/20 via-transparent" />
      </div>
      <div>
        <div className="min-w-0 max-w-2xl flex-auto px-4 mx-auto pt-6 pb-4">
          <nav className="flex items-center">
            <Link href="/" className="block p-2 -m-2">
              <Logo className="h-8 w-auto fill-black/80" />
            </Link>
            <div className="flex-1" />
            <Navigation />
          </nav>
        </div>
      </div>
      <div className="min-w-0 max-w-2xl flex-auto px-4 pb-16 py-8 mx-auto">
        {children}
      </div>
      <footer className="min-w-0 max-w-2xl flex-auto px-4 mx-auto py-6">
        <div className="flex justify-end space-x-3 text-xs text-slate-500 prose-base hover:prose-a:underline">
          <Link href="/imprint" className="hover:underline">
            Imprint
          </Link>
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  )
}
