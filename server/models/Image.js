const { Schema, model } = require("mongoose");
const reactionSchema = require('./Reaction');
const dateFormat = require('../utils/dateFormat');

const imageSchema = new Schema(
  {
    description: {
      type: String,
      maxlength: 280,
    },
    imageLocation: {
      type: String,
      maxlength: 280,
    },
    size: {
      type: String,
    },
    username: {
      type: String,
    },
    reactions: [reactionSchema],
    createdOn: {
      type: Date,
      default: Date.now,
    }
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

imageSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Image = model("Image", imageSchema);

module.exports = Image;
