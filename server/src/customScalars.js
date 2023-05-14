const { GraphQLScalarType, Kind } = require("graphql");
// the below code assumes the backend represents a date with the Date JavaScript object
// create an instance of a GraphQLScalarType class for handling our dates
// the methods describe how Apollo Server interacts with the scalar in every scenario
const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  // serialize method converts the scalar's backend representation to a JSON-compatible format so Apollo Server
  // can include it in a operation's response. In this case, we take the value stored in backend (number of milliseconds)
  // elapsed since the epoch (Jan 1, 1970, UTC)) and conver it to a date string
  serialize(value) {
    // note: you can use other Date methods to tweak the output here
    // i.e. value.toLocaleDateString() will give just the date in MM/DD/YYYY format
    return value.toDateString();
  },
  // parseValue method converts the scalar's JSON value to its backend representation
  // Apollo Server calls this method when the scalar is provided by a client as a
  // GraphQL variable for an argument.
  parseValue(value) {
    return new Date(value); // Convert incoming value to Date object
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});

module.exports = {
    dateScalar
}