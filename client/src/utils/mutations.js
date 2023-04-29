import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const GET_ASSEMBLYAI_TOKEN = gql`
mutation GetAAITemporaryToken {
  getAAITemporaryToken {
    msg
    data {
      token
    }
  }
}`