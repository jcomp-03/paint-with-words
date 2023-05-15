const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

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
    images: [Image]
    "The user's list of friends"
    friends: [User]
    "The user's total number of paints made to date"
    totalPaintingsMade: Int
    "The user's total number of prompts made to date"
    totalPromptsMade: Int
    "The user's list of previous prompts made"
    previousPrompts: [Prompt]
    "The user's token"
    token: String
  }

  "A prompt type holds information about a single prompt"
  type Prompt {
    _id: ID!
    "The prompt text is the text generated from the user's transcribed speech and sent to the AI image generator"
    promptText: String
    "The date on which the prompt was made"
    createdOn: Date!
    "The prompt's owner"
    username: String
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
    "The timestamp for when the image was created"
    createdOn: Date!
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
  type AssemblyAiTokenResponse {
    msg: String
    data: AssemblyAiToken
  }

  "A type constructed for holding the temporary token issued by AssemblyAI"
  type AssemblyAiToken {
    token: String
  }

  "A type constructed for holding the response from posting to https://api.openai.com/v1/images/generations"
  type OpenAiImageResponse {
    "The response status code"
    status: Int
    "The response status text"
    statusText: String
    "The object which holds the image data"
    data: OpenAiImageObject
  }

  "A type constructed for representing the object which holds the timestamp and array of image objects"
  type OpenAiImageObject {
    "The timestamp associated with the creation of the image(s)"
    created: Int
    "The array of images returned from the response"
    data: [OpenAiImageDataObject!]
  }

  "A type constructed for representing each individual image's data"
  type OpenAiImageDataObject {
    "The image data is returned via a url"
    url: String
    "Alternatively, the image data can be returned in b64 json format"
    b64_json: String
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
    user(username: String!): User
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
    "Mutation for retrieving a temporary token from AssemblyAI for real-time transcription"
    getAssemblyAiToken: AssemblyAiTokenResponse
    "Mutation for sending a POST request to OpenAI endpoint for the creation of images"
    createOpenAiImages(
      prompt: String!
      n: Int!
      size: String!
    ): OpenAiImageResponse
  }
`;

module.exports = typeDefs;
