const { User, Image, Prompt } = require("../models");
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

      throw new AuthenticationError("You need to be logged in!");
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
    promptsByUsername: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Prompt.find(params).sort({ createdAt: -1 });
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
    createSomeImages: async (parent, { prompt, n, size }, context, info) => {
      try {
        // if the user property of context exists (it should exist if login was successful),
        // then make http post request to OpenAI, passing in prompt, n, and desired size of image
        if (context.user) {
          const response = await openAiInstance.createImage(prompt, n, size);
          const { data } = response.status === 200 ? response : null;
          const { created: createdOn, data: imageDataArray } = data
            ? data
            : null;

          // add properties to each image object that was returned in data
          imageDataArray.forEach((imgObj) => {
            imgObj.description = prompt;
            imgObj.size = size;
            imgObj.createdOn = createdOn + "000"; // observed timestamp was off; added zeros to bring to current day/time
            imgObj.username = context.user.username;
          });

          // create new documents in Image collection
          const imageDocsArray = await Image.create(imageDataArray);
          // collect the new image ids
          const imgIds = imageDocsArray.map((imgObj) => imgObj["_id"]);
          // configure prompt objects for create method
          const newPrompts = imageDocsArray.map((img) => {
            return {
              promptText: img.description,
              createdOn: img.createdOn,
              username: context.user.username,
            };
          });
          const promptDocsArray = await Prompt.create(newPrompts);
          // collect the new prompt ids
          const promptIds = promptDocsArray.map(
            (promptObj) => promptObj["_id"]
          );
          // update the current user's document with the image and prompt ids...
          const updatedUser = await User.findOneAndUpdate(
            { username: context.user.username },
            { $addToSet: { images: imgIds, previousPrompts: promptIds } },
            { returnDocument: "after" }
          )
            .populate("images")
            .populate("previousPrompts");
          // return updated user document
          return updatedUser;
        }

        throw new AuthenticationError("You need to be logged in!");
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
        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.log("----- Error! Resolver deleteAnImage -----\n", error);
      }
    },
    deleteSomeImages: async (parent, { imgIdArray }, context, info) => {
      try {
        if (context.user) {
          let response = imgIdArray.map(
            async (imgId) => await Image.findByIdAndDelete(imgId)
          );
          return response;
        }
        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.log("----- Error! Resolver deleteSomeImages -----\n", error);
      }
    },
  },
};

module.exports = resolvers;
