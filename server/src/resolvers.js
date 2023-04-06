const { User, Image } = require("../models");

const resolvers = {
  Query: {
    // me: async (parent, args, context) => {
    //   // spoof content for the moment
    //   const context = {
    //     user: {
    //       _id:  
    //     }
    //   }
    //   if (context.user) {
    //     const userData = await User.findOne({ _id: context.user._id })
    //       // .select('-__v -password')
    //       .populate("images")
    //       .populate("friends");
    //     console.log("userData is", userData);
    //     return userData;
    //   }

    //   throw new AuthenticationError("Not logged in");
    // },
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
    // thought: async (parent, { _id }) => {
    //   return Thought.findOne({ _id });
    // }
  },
};

module.exports = resolvers;
