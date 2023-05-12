import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  {
    me {
      _id
      firstName
      lastName
      username
      email
      images {
        _id
        description
        imageLocation
        size
        username
        reactions {
          _id
          reactionBody
          username
        }
      }
      friends {
        _id
        username
      }
    }
  }
`;

export const QUERY_ME_BASIC = gql`
  {
    me {
      _id
      username
      email
      friends {
        _id
        username
      }
    }
  }
`;

export const QUERY_USER = gql`
query UserByUsername($username: String) {
  user(username: $username) {
    _id
    firstName
    lastName
    username
    email
    password
    images {
      _id
      description
      imageLocation
      size
      username
      reactions {
        _id
        reactionBody
        username
      }
    }
  }
}
`;
