import { graphql } from '@octokit/graphql'

const owner = 'timomeh'
const repo = 'timomeh.de'

export function isAllowedCategory(slug: string) {
  const allowedCategorySlugs = ['offtopic', 'posts']
  return allowedCategorySlugs.includes(slug)
}

export type Discussion = {
  title: string
  createdAt: string
  updatedAt: string
  body: string
  bodyHTML: string
  number: number
  labels: {
    nodes: Label[]
  }
  category: {
    slug: string
  }
}

const api = graphql.defaults({
  headers: {
    authorization: 'token '.concat(process.env.GITHUB_ACCESS_TOKEN!),
  },
  request: {
    fetch(url: string, options: RequestInit) {
      const tags = options.body
        ? JSON.parse(options.body as string)?.variables?.tags
        : []

      return fetch(url, {
        ...options,
        cache: 'force-cache',
        next: { tags },
      })
    },
  },
})

export type Label = {
  color: string
  description: string
  name: string
}

type ListDiscussionsResult = {
  repository: {
    discussions: {
      pageInfo: {
        endCursor: string
        hasNextPage: boolean
      }
      nodes: Discussion[]
    }
  }
}

export async function listDiscussions() {
  let hasNextPage = true
  let after: string | null = null
  let discussions: Discussion[] = []

  do {
    const result: ListDiscussionsResult = await api(
      `
      query list($owner: String!, $repo: String!, $after: String) {
        repository(owner: $owner, name: $repo) {
          discussions(
            first: 100,
            after: $after,
            orderBy: { field: CREATED_AT, direction: DESC }
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              title
              createdAt
              updatedAt
              body
              bodyHTML
              number
              category {
                slug
              }
              labels(first: 100) {
                nodes {
                  name
                  color
                  description
                }
              }
            }
          }
        }
      }`,
      {
        owner,
        repo,
        after,
        tags: ['posts', 'all'],
      },
    )

    let { pageInfo, nodes } = result.repository.discussions

    const allowedNodes = nodes.filter((node) =>
      isAllowedCategory(node.category.slug),
    )

    discussions.push(...allowedNodes)
    hasNextPage = pageInfo.hasNextPage
    after = pageInfo.endCursor
  } while (hasNextPage)

  const sorted = discussions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return sorted
}

type SearchDiscussionResult = {
  search: {
    edges: {
      node: Discussion
    }[]
  }
}

type GetDiscussion = {
  slug: string
}

export async function getDiscussion({ slug }: GetDiscussion) {
  const result: SearchDiscussionResult = await api(
    `
    query postBySlug($search: String!) {
      search(
        query: $search
        type: DISCUSSION
        first: 100
      ) {
        edges {
          node {
            ... on Discussion {
              title
              createdAt
              updatedAt
              body
              bodyHTML
              number
              category {
                slug
              }
              labels(first: 100) {
                nodes {
                  name
                  color
                  description
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      search: `"${slug}" in:title repo:${owner}/${repo}`,
      tags: ['post', slug],
    },
  )

  // In case we find discussions with similar titles, find the exact one
  const discussion = result.search.edges.find((result) => {
    return result.node.title === slug
  })?.node

  if (!isAllowedCategory(discussion?.category.slug || '')) {
    return null
  }

  return discussion
}
