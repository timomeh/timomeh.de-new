import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GithubLogo } from './GithubLogo'
import { Logo } from './Logo'
import { TwitterLogo } from './TwitterLogo'

type Props = {
  children: React.ReactNode
  githubUrl?: string
}

export function Layout({ children, githubUrl }: Props) {
  const router = useRouter()

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
            <Link href="/">
              <a className="block p-2 -m-2">
                <Logo className="h-8 w-auto fill-black/80" />
              </a>
            </Link>

            <div className="flex-1" />

            <div className="text-sm flex font-medium text-black/60 space-x-6 items-center">
              <Link href="/">
                <a
                  className={clsx(
                    'hover:text-black/90 transition-colors',
                    router.pathname === '/' ? 'text-black/90' : 'text-black/60'
                  )}
                >
                  Hello
                </a>
              </Link>

              <Link href="/posts">
                <a
                  className={clsx(
                    'hover:text-black/90 transition-colors',
                    router.pathname.startsWith('/posts')
                      ? 'text-black/90'
                      : 'text-black/60'
                  )}
                >
                  Posts
                </a>
              </Link>

              <a
                href="https://twitter.com/timomeh"
                rel="noopener noreferrer"
                target="_blank"
                className=" fill-black/60 hover:fill-black/90 transition-colors"
              >
                <TwitterLogo className="w-6 h-6 -m-1 p-1" />
              </a>

              <a
                href={githubUrl || 'https://github.com/timomeh/timomeh.de'}
                rel="noopener noreferrer"
                target="_blank"
                className=" fill-black/60 hover:fill-black/90 transition-colors"
              >
                <GithubLogo className="w-[26px] h-[26px] -m-1 p-1" />
              </a>
            </div>
          </nav>
        </div>
      </div>
      <div className="min-w-0 max-w-2xl flex-auto px-4 pb-16 py-8 mx-auto">
        {children}
      </div>
      <footer className="min-w-0 max-w-2xl flex-auto px-4 mx-auto py-6">
        <div className="flex justify-end space-x-3 text-xs text-slate-500 prose-base hover:prose-a:underline">
          <Link href="/imprint">
            <a className="hover:underline">Imprint</a>
          </Link>
          <Link href="/privacy-policy">
            <a className="hover:underline">Privacy Policy</a>
          </Link>
        </div>
      </footer>
    </div>
  )
}
