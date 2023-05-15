import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation addUser(
    $firstName: String!
    $lastName: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

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
  mutation getAssemblyAiToken {
    getAssemblyAiToken {
      msg
      data {
        token
      }
    }
  }
`;

export const CREATE_OPENAI_IMAGE = gql`
  mutation CreateOpenAiImages($prompt: String!, $n: Int!, $size: String!) {
    createOpenAiImages(prompt: $prompt, n: $n, size: $size) {
      status
      statusText
      data {
        created
        data {
          url
          b64_json
        }
      }
    }
  }
`;
