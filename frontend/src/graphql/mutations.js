import { gql } from '@apollo/client';

export const CREATE_POST_MUTATION = gql`
  mutation createPost(
    $title: String!
    $body: String!
    $published: Boolean!
    $authorId: ID!
  ) {
    createPost(
      data: {
        title: $title
        body: $body
        published: $published
        author: $authorId
      }
    ) {
      title
      body
      author {
        name
      }
      published
    }
  }
`;
