'use cache'

import { unstable_cacheTag as cacheTag } from 'next/cache'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PostList } from '../../post-list'
import { getTag } from '@/data/tags'
import { contentAsset } from '@/data/cms'

type Props = {
  params: Promise<{ tag: string }>
}

export default async function Page(props: Props) {
  cacheTag('posts-list')

  const params = await props.params
  const tag = await getTag(params.tag)
  if (!tag) notFound()

  return <PostList tag={params.tag} />
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const tag = await getTag(params.tag)
  if (!tag) notFound()

  cacheTag('tag', `tag:${tag.slug}`)

  const metadata: Metadata = {
    title: `${tag.title} Archive`,
    description:
      tag.meta.description ||
      `More or less coherent thoughts about ${tag.title}.`,
    openGraph: {},
    alternates: {
      types: {
        'application/atom+xml': '/posts/feed.atom',
        'application/rss+xml': '/posts/feed.rss',
        'application/feed+json': '/posts/feed.json',
      },
    },
  }

  if (tag.meta.image) {
    metadata.openGraph!.images = [
      { url: contentAsset('tags', tag.slug, tag.meta.image) },
    ]
  }

  return metadata
}
