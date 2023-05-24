// import connection to mongodb database
const db = require("./config/connection");
// import modules/packages/dependencies
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
// import authentication middleware
const { authMiddleware } = require("./utils/authorization");
const PORT = process.env.PORT || 8001;

// import schema type definitions and resolvers
const { typeDefs, resolvers } = require("./src");
// import ApolloServer
const { ApolloServer } = require("apollo-server-express");
// create new instance of an Apollo Server, passing in type definitions and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // every request performed will have an authentication check done
  // the updated request object will be passed to the resolvers as the context
  context: authMiddleware,
  csrfPrevention: true,
});

const routes = require("./routes");
const app = express();
// to use graphql-uploads, we must attach non-empty apollo-require-preflight header along with all requests;
// this is required because we enabled cross-site request forgery (CSRF) prevention in Apollo Server instance
app.use(function (req, res, next) {
  req.headers["apollo-require-preflight"] = "true";
  next();
});
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
//console.log(path.join(__dirname));
// app.use(express.static(path.join(__dirname, 'public')));
// enable CORS for all origins
app.use(cors());

app.use(routes);

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
