import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/Home";
import PaintPage from "./pages/Paint";
import LoginPage from "./pages/Login";
import ErrorPage from "./pages/Error";

const httpLink = createHttpLink({
  uri: "/graphql",
});

// server can use the header to authenticate the user and
// attach it to the GraphQL execution context, so resolvers
// can modify their behavior based on a user's role and permissions.
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    // The ApolloProvider component similar to React’s context provider;
    // it wraps the React app and places client on the context, which
    // enables access from anywhere in the component tree.
    <ApolloProvider client={client}>
      <Router>
        <div className="container">
          <Header />
          <main className="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/paint" element={<PaintPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
