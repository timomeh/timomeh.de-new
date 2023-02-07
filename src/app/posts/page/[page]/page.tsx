import { notFound } from 'next/navigation'
import Link from 'next/link'
import { listPostsPaginated } from '@/lib/blog'
import { ListedPost } from '../../ListedPost'
import { NorthernLights } from '@/components/NorthernLights'

export const revalidate = false
export const generateStaticParams = () => []

type Props = {
  params: { page: string }
}

export default async function Posts({ params }: Props) {
  const page = +params.page
  if (!Number.isInteger(page)) notFound()

  const { posts, next, prev } = await listPostsPaginated(page)
  if (posts.length < 1) notFound()

  return (
    <>
      <NorthernLights />
      <main className="meh-main">
        <div className="space-y-10">
          {posts.map((post) => (
            <ListedPost post={post} key={post.number} />
          ))}
        </div>
        <div className="mt-10 flex space-x-4 max-w-[682px] px-4 justify-center text-[13px] font-bold uppercase">
          {prev && (
            <Link
              className="underline decoration-violet-400 underline-offset-4 glow opacity-60 hover:opacity-80"
              href={prev === 1 ? `/posts` : `/posts/page/${prev}`}
            >
              Newer
            </Link>
          )}
          {next && (
            <Link
              className="justify-self-start underline decoration-violet-400 underline-offset-4 glow opacity-60 hover:opacity-80"
              href={`/posts/page/${next}`}
            >
              Older
            </Link>
          )}
        </div>
      </main>
    </>
  )
}
