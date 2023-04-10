import React from "react";
import ReactSvg from "../images/react.svg";
import ApolloSvg from "../images/apollo-graphql.svg";
import NodeSvg from "../images/nodejs.svg";

const Footer = () => {
  return (
    <footer className="footer">
      Site enabled with and powered by:
      <img
        className="footer__img img__react"
        src={ReactSvg}
        alt="Logo for React.js front-end library"
      />
      <img
        className="footer__img img__node"
        src={NodeSvg}
        alt="Logo for Node.js runtime environment."
      />
      <img
        className="footer__img img__apollo"
        src={ApolloSvg}
        alt="Logo for Apollo Server GraphQL implementation."
      />
    </footer>
  );
};

export default Footer;
