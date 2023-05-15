require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");

class OpenAIClass {
  // static properties (field or method) are not accessed on instances of the class
  // instead, they are accessed on the class itself, i.e. OpenAI.configuration
  configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // define async function createImage
  async createImage(prompt, n, size) {
    try {
      // create new OpenAIApi instance
      const openai = new OpenAIApi(this.configuration);
      const response = await openai.createImage({
        prompt,
        n,
        size
        // response_format: "b64_json"
      });
      //console.log('makeImage', response.data.data[0].url + "\n\n");
      // destructure what I want from response
      const { status, statusText, data } = response;
      console.log('response.data is', data);
      return {
        status,
        statusText,
        data
      }
    } catch (error) {
      console.error(
        "***** Error in async function createImage: *****\n",
        error
      );
    }
  }
}

const openAiInstance = new OpenAIClass();

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

// editOrExtendImage("square.png", "mask.png", "Portrait photo of an anthropomorphic cow", 1, "1024x1024");
// varyImage("square.png", 3, "1024x1024");
module.exports = {
  openAiInstance
};
