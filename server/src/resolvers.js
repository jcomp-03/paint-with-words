const { User, Image } = require("../models");
const { AuthenticationError } = require('apollo-server-express');
// import signToken function
const { signToken } = require('../utils/authorization');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // if there is no user property in the context, then we know the user is not authenticated
      if (context.user) {
        // console.log('context.user is', context.user);
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate("images")
          .populate("friends");
        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('images');
    },
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('friends')
        .populate('images');
    },
    images: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Image.find(params).sort({ createdAt: -1 });
    },
    imagesByUsername: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Image.find(params);
    },
    imageByImageId: async (parent, { _id }) => {
      const params = _id ? { _id } : {};
      return Image.findById(params);
    },
  },

  Mutation: {
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new AuthenticationError('The username or password given is incorrect');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('The username or password given is incorrect');
      }
      // signToken returns a JSON web token string
      const token = signToken(user);
      // return an object which combines the signed token and user information
      return { token, user };
    },    
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      // return an object which combines the signed token and user information
      return { token, user };
    },
  }
};

module.exports = resolvers;