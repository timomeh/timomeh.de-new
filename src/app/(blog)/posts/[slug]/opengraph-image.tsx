import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'

import { getFonts, OpengraphBaseImage } from '@/comps/og-base-image'
import { contentAsset } from '@/data/cms'
import { getPost } from '@/data/posts'
import { formatReadingTime } from '@/lib/formatReadingTime'

export const generateStaticParams = () => []
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

type Props = {
  params: {
    slug: string
  }
}

export default async function Image({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  const cover = post.frontmatter.cover
    ? contentAsset('posts', post.slug, post.frontmatter.cover)
    : undefined

  return new ImageResponse(
    (
      <OpengraphBaseImage
        title={[post.title]}
        cover={cover}
        date={post.publishedAt}
        est={formatReadingTime(
          post.content,
          post.frontmatter.readingTime,
          'reading time',
        )}
      />
    ),
    {
      ...size,
      ...(await getFonts()),
    },
  )
}
