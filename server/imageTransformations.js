const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const fs = require("fs");

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
      size,
    });
    // log to console
    console.log(response.data.data[0].url + "\n\n");

    // return data, which is an array of objects with property 'url'
    return response.data.data;
  } catch (error) {
    console.error("***** Error in async function createImage: *****\n", error);
  }
};

// define async function editOrExtendImage
const editOrExtendImage = async (
  imageLocation,
  maskLocation,
  prompt,
  n,
  size
) => {
  try {
    // make HTTP POST request to endpoint @ https://api.openai.com/v1/images/edits
    const response = await openai.createImageEdit(
      // returns a readable stream
      fs.createReadStream(imageLocation),
      fs.createReadStream(maskLocation),
      prompt,
      n,
      size
    );

    // log to console
    for (let i = 0; i < n; i++) {
      console.log(response.data.data[i].url, "\n\n");
    }

    // return data, which is an array of objects with property 'url'
    return response.data;
  } catch (error) {
    console.error("Something unexpected or undesired happened.\n", error);
  }
};

// define async function varyImage
const varyImage = async (imageLocation, n, size) => {
  try {
    // make HTTP POST request to endpoint @ https://api.openai.com/v1/images/variations
    const response = await openai.createImageVariation(
      // returns a readable stream
      fs.createReadStream(imageLocation),
      n,
      size
    );

    // log to console momentarily
    for (let i = 0; i < n; i++) {
      console.log(response.data.data[i].url, "\n\n");
    }

    // return data
    return response.data;
  } catch (error) {
    console.error("Something unexpected or undesired happened.\n", error);
  }
};

// createImage('A dog riding a surfboard in turbulent water, as a pencil drawing.', 1, '1024x1024');
// editOrExtendImage("square.png", "mask.png", "Portrait photo of an anthropomorphic cow", 1, "1024x1024");
// varyImage("square.png", 3, "1024x1024");

module.exports = {
  createImage,
  editOrExtendImage,
  varyImage,
};
