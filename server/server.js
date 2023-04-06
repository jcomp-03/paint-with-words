// import connection to mongodb database
const db = require('./config/connection');
// import modules/packages/dependencies
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 8001;

// import schema type definitions and resolvers
const { typeDefs, resolvers } = require('./src');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');
// create new instance of an Apollo Server, passing in type definitions and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const routes = require('./routes');

const app = express();
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.use(routes);

// start the web server, listening for connections on the port assigned above
// const server = app.listen(PORT, () => {
//   console.log(`***** Server is running on port ${PORT} *****`);
// });

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);