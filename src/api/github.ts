import ky from "ky"
import { Temporal } from "@js-temporal/polyfill"
import { createServerFn } from "@tanstack/react-start"

const ghBaseApi = ky.create({
  prefixUrl: "https://api.github.com/",
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  },
})

type GitHubUserNode = {
  login: string
  following: {
    nodes: {
      login: string
    }[]
  }
  repositories: {
    nodes: {
      name: string
      createdAt: string
      stargazerCount: number
    }[]
  }
}

type GitHubSearchUsersResponse = {
  data: {
    search: {
      nodes: GitHubUserNode[]
    }
  }
}

const rtf = new Intl.RelativeTimeFormat("ru", { numeric: "auto" })
const friendsAndMe = ["piscopancer", "nekoreal", "mentoltea", "vladislavean", "kurtkabeina12"]
const friendsAndMeQuery = friendsAndMe.map((f) => `user:${f}`).join(" ")

const query = /*gql*/ `
query {
  search(query: "${friendsAndMeQuery}", type: USER, first: ${friendsAndMe.length}) {
    nodes { 
      ... on User {
        login
        following(first: 100) {
          nodes { login }
        }
        repositories(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            name
            createdAt
            stargazerCount
          }
        }
      }
    }
  }
}
`

export const queryGithub = createServerFn({ method: "GET" }).handler(async () => {
  const now = Temporal.Now.zonedDateTimeISO("utc")
  const response = await ghBaseApi
    .post<GitHubSearchUsersResponse>("graphql", {
      json: { query },
    })
    .json()
  const users = response.data.search.nodes
  const followingMap = new Map<string, Set<string>>()
  for (const user of users) {
    const follows = new Set(user.following.nodes.map((n) => n.login))
    followingMap.set(user.login, follows)
  }
  return users.map((user) => {
    const myFollowing = followingMap.get(user.login)!
    const mutualFriends = friendsAndMe
      .filter((other) => other !== user.login)
      .filter((other) => {
        const theyFollowMe = followingMap.get(other)?.has(user.login) ?? false
        const iFollowHim = myFollowing.has(other)
        return iFollowHim && theyFollowMe
      })
    const repos = user.repositories.nodes.map((repo) => {
      const createdAt = Temporal.Instant.from(repo.createdAt).toZonedDateTimeISO("utc")
      const diff = createdAt.since(now, { largestUnit: "day" }).days
      return {
        name: repo.name,
        created: rtf.format(diff, "day"),
        stars: repo.stargazerCount,
      }
    })
    return {
      username: user.login,
      mutualFriends,
      repos,
    }
  })
})
