import { gql } from 'apollo-boost'

export const POSTS_QUERY = gql`
  query {
    posts {
      title
      body
      author {
        name
      }
      published
    }
  }
`
