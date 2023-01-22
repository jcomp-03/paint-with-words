const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

// create new Configuration instance
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// create new OpenAIApi instance
const openai = new OpenAIApi(configuration);

// define async function createImage
const createImage = async (prompt, number, size) => {
  try {
    // make HTTP POST request to endpoint @ https://api.openai.com/v1/images/generations
    const response = await openai.createImage({
      prompt: prompt,
      n: number,
      size: size,
    });
    // log to console
    console.log(response.data.data[0].url + "\n\n" + response.data.data[1].url);
    // return data
    return data;
  } catch (error) {
    console.error('Something unexpected or undesired happened.\n', error);
  }
};

export default createImage;