const { gql } = require("apollo-server-express");

const typeDefs = gql`
  "A user type holds information about a person who has created an account"
  type User {
    _id: ID!
    "The user's first name"
    firstName: String!
    "The user's last name"
    lastName: String!
    "The user's username; must be unique among all usernames registered"
    username: String!
    "The user's email address; must be unique among all emails registered"
    email: String!
    "The user's password"
    password: String
    "The user's list of images"
    images: [Image!]
    "The user's token"
    token: String
  }

  "An image type holds information about a single image"
  type Image {
    _id: ID!
    "The image description is the description provided by the user at the moment of creation"
    description: String
    "The image location stores the url to where the image is saved/stored"
    imageLocation: String
    "The image size holds the resolution of the image"
    size: String # wanted to use enum ImageSize but encountered issues. Revisit
    "The image's owner"
    username: String
    "The image's reactions received"
    reactions: [Reaction!]
  }

  "A reaction type holds information about a reaction to an image"
  type Reaction {
    _id: ID!
    "The reaction's content"
    reactionBody: String
    "The reaction's owner"
    username: String
  }

  "A type constructed for holding the response from posting to https://api.assemblyai.com/v2/realtime/token"
  type AAITemporaryTokenResponse {
    msg: String
    data: AAITemporaryToken
  }

  "A type constructed for holding the temporary token issued by AssemblyAI"
  type AAITemporaryToken {
    token: String
  }

  "An authorization type holds token information associated with a user"
  type Authorization {
    "The token ID; by necessity this field must be returned by the Authorizaton type"
    token: ID!
    "User information can be returned optionally"
    user: User
  }

  type Query {
    "Query to get current information about the currently logged-in user"
    me: User
    "Query to get all users"
    users: [User!]
    "Query to get a user by its username"
    user(username: String): User
    "Query to get all images, from all the users"
    images: [Image!]
    "Query to get all images by a single user"
    imagesByUsername(username: String!): [Image!]
    "Query to get a single image by its id"
    imageByImageId(_id: ID!): Image
  }

  type Mutation {
    "Mutation for logging in an existing user"
    login(username: String!, password: String!): Authorization
    "Mutation for adding a new user to the user data table"
    addUser(
      firstName: String!
      lastName: String!
      username: String!
      email: String!
      password: String!
    ): Authorization
    getAAITemporaryToken: AAITemporaryTokenResponse
  }
`;

module.exports = typeDefs;
