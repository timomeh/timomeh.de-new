import type { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import Image from 'next/future/image'
import parse, { Element, domToReact } from 'html-react-parser'

import { GithubLogo } from '../../components/GithubLogo'
import { Layout } from '../../components/Layout'
import { PostTitle } from '../../components/PostTitle'
import { Prose } from '../../components/Prose'
import { FullPost, getBlogPost } from '../../lib/blog'
import Link from 'next/link'

type Props = {
  post: FullPost
}

export default function Post({ post }: Props) {
  return (
    <Layout githubUrl="https://github.com/timomeh/timomeh.de/discussions">
      <Head>
        <title key="title">{`${post.rawTitle} | Timo Mämecke`}</title>
        <meta
          property="og:image"
          content={`https://timomeh.de/assets/og-image/posts/${post.slug}.png`}
          key="og-image"
        />
        <meta
          name="description"
          content={`${post.rawTitle}, posted on ${post.postedAt} by Timo Mämecke`}
          key="description"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${post.rawTitle} | Timo Mämecke`}
          key="twitter-title"
        />
        <meta
          name="twitter:image"
          content={`https://timomeh.de/assets/og-image/posts/${post.slug}.png`}
          key="twitter-image"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          href="https://timomeh.de/posts/feed.atom"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          href="https://timomeh.de/posts/feed.rss"
        />
        <link
          rel="alternate"
          type="application/feed+json"
          href="https://timomeh.de/posts/feed.json"
        />
      </Head>
      <Prose>
        <h1 className="!mb-0">
          <PostTitle title={post.title} />
        </h1>
        <div className="flex items-center space-x-2">
          <div className="text-slate-500 text-sm">
            posted on {post.postedAt}
          </div>
          <a
            href={`https://github.com/timomeh/timomeh.de/discussions/${post.discussionNumber}`}
            rel="noopener noreferrer"
            target="_blank"
            className="fill-slate-500 hover:fill-slate-700 transition-colors"
          >
            <GithubLogo className="w-[26px] h-[26px] -m-1 p-1" />
          </a>
        </div>
        <div className="h-6 md:h-8" />

        {parse(post.body, {
          replace: (domNode) => {
            if (
              domNode instanceof Element &&
              domNode.name === 'img' &&
              domNode.attribs['src'].startsWith(
                'https://user-images.githubusercontent.com/4227520/'
              )
            ) {
              return (
                <Image
                  src={domNode.attribs['src']}
                  alt={domNode.attribs['alt']}
                  width={domNode.attribs['width']}
                  height={domNode.attribs['height']}
                  quality={100}
                  sizes="(min-width: 672px) 640px, 100vw"
                />
              )
            }

            if (
              domNode instanceof Element &&
              domNode.name === 'a' &&
              domNode.attribs['href']?.startsWith('https://timomeh.de/')
            ) {
              return (
                <Link
                  href={domNode.attribs['href'].replace(
                    'https://timomeh.de',
                    ''
                  )}
                >
                  <a>{domToReact(domNode.children)}</a>
                </Link>
              )
            }

            if (domNode instanceof Element && domNode.name === 'pre') {
              return (
                <pre className={`not-prose ${domNode.attribs['class']}`}>
                  {domToReact(domNode.children)}
                </pre>
              )
            }
          },
        })}
      </Prose>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

type Param = { slug: string }

export const getStaticProps: GetStaticProps<Props, Param> = async (context) => {
  if (!context.params) {
    throw new Error('context.params is undefined')
  }

  const post = await getBlogPost(context.params.slug)

  if (!post) {
    return { notFound: true }
  }

  return {
    props: {
      post,
    },
  }
}
