const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

// create new Configuration instance
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// create new OpenAIApi instance
const openai = new OpenAIApi(configuration);

// define async function createImage
const createImage = async (prompt, n, size) => {
  try {
    // make HTTP POST request to endpoint @ https://api.openai.com/v1/images/generations
    const response = await openai.createImage({
      prompt,
      n,
      size
    });
    // log to console
    console.log(response.data.data[0].url + "\n\n");
    // return data
    return response.data.data;
  } catch (error) {
    console.error('***** Error in async function createImage: *****\n', error);
  }
};

// createImage('A dog riding a surfboard in turbulent water, as a pencil drawing.', 1, '1024x1024');
// export default createImage;
module.exports = { createImage };