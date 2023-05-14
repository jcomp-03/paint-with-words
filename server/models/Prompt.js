const { Schema, model } = require("mongoose");

const promptSchema = new Schema({
  promptText: {
    type: String,
    required: true,
    minLength: [
      5,
      "The minimum length for the prompt must be 5. Received {VALUE}.",
    ],
  },
  createdOn: {
    type: Date,
    // saved in date time string format (a simplification of the ISO
    // 8601 calendar date extended format): YYYY-MM-DDTHH:mm:ss.sssZ
    default: Date.now,
  },
  username: {
    type: String,
  },
});

const Prompt = model("Prompt", promptSchema);

module.exports = Prompt;
