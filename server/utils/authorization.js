const jwt = require("jsonwebtoken");
const secret = "Shh, this is super secret!";
const expiration = "2h";

module.exports = {
  // the signToken function expects a user object and will
  // add that object's username, email, and _id properties to the
  // the token
  signToken: ({ username, email, _id }) => {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
    // separate "Bearer" from "<tokenvalue>"
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    } 
    // if no token, return request object as is
    if (!token) {
      return req;
    }

    try {
      // decode and attach user data to request object. If the secret on jwt.verify() 
      // doesn't match the secret that was used with jwt.sign(), the object won't be
      // decoded. When the JWT verification fails, an error is thrown. 
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
    }

    // return updated request object
    return req;
  },
};
