const { User, Image } = require("../models");
const { AuthenticationError } = require("apollo-server-express");

// import signToken function
const { signToken } = require("../utils/authorization");
const { assemblyAI } = require("../utils/axios");
const { dateScalar, imgBinDataScalar } = require("./customScalars");
const { openAiInstance } = require("./datasources/openAIClass");

const resolvers = {
  Date: dateScalar,
  ImgBinData: imgBinDataScalar,

  Query: {
    me: async (parent, args, context) => {
      // if there is no user property in the context, then we know the user is not authenticated
      if (context.user) {
        // console.log('context.user is', context.user);
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("images")
          .populate("friends")
          .populate("previousPrompts");
        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("friends")
        .populate("images")
        .populate("previousPrompts");
    },
    users: async () => {
      return User.find()
        .select("-__v -password")
        .populate("friends")
        .populate("images")
        .populate("previousPrompts");
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
        throw new AuthenticationError(
          "The username or password given is incorrect"
        );
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError(
          "The username or password given is incorrect"
        );
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
    getAssemblyAiToken: async (parent, args, context, info) => {
      try {
        // fetch temp token from AssemblyAI for real-time transcription
        const response = await assemblyAI.post("/realtime/token", {
          expires_in: 360,
        });
        // destructure data property from response
        const { data } = response;
        // return an object with msg and data
        return {
          msg: "getAssemblyAIToken: Temporary token retrieved.",
          data,
        };
      } catch (error) {
        console.log("----- Error! Resolver getAssemblyAIToken -----\n", error);
      }
    },
    // singleUpload: async (parent, { file }) => {
    //   const { createReadStream, filename, mimetype, encoding } = await file;

    //   // Invoking the `createReadStream` will return a Readable Stream.
    //   // See https://nodejs.org/api/stream.html#stream_readable_streams
    //   const stream = createReadStream();

    //   // This is purely for demonstration purposes and will overwrite the
    //   // local-file-output.txt in the current working directory on EACH upload.
    //   const out = require('fs').createWriteStream('local-file-output.txt');
    //   stream.pipe(out);
    //   await finished(out);

    //   return { filename, mimetype, encoding };
    // },
    createSomeImages: async (parent, { prompt, n, size }, context, info) => {
      try {
        // if the user property of context exists (it should exist if login was successful),
        // then make http post request to OpenAI, passing in prompt, n, and desired size of image
        if (context.user) {
          const response = await openAiInstance.createImage(prompt, n, size);
          const { data } = response.status === 200 ? response : null;
          const { created: createdOn, data: imageArray } = data ? data : null;
          // add properties to each image object and then create new documents in Image collection
          imageArray.forEach((imgObj) => {
            // assign image's description to be prompt that was used
            imgObj.description = prompt;
            // assign image's size to be the size that was used
            imgObj.size = size;
            // assign image's timestamp to be createdOn; noticed timestamp was off, so had to add triple zeros to bring it to current day/time
            imgObj.createdOn = createdOn + "000";
            // assign image owner to the currently logged-in user, pulled from context!
            imgObj.username = context.user.username;
          });
          const someResponse = await Image.create(imageArray);
          console.log('someResponse is', someResponse);
          return response;
        }
      } catch (error) {
        console.log("----- Error! Resolver createSomeImages -----\n", error);
      }
    },
    deleteAnImage: async (parent, { imgId }, context, info) => {
      try {
        if (context.user) {
          const response = await Image.findOneAndDelete({ _id: imgId }).select(
            "-__v -reactions"
          );
          if (!response) {
            throw new Error("Image id passed to resolver was not a valid id.");
          }
          return response;
        }
      } catch (error) {
        console.log("----- Error! Resolver removeAnImage -----\n", error);
      }
    },
  },
};

module.exports = resolvers;
