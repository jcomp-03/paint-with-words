const axios = require("axios").default;
require('dotenv').config();

// create axios instance for AssemblyAI, 
// pass in AssemblyAI API token from environment
const assemblyAI = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: process.env.ASSEMBLYAI_API_KEY,
    "content-type": "application/json",
  },
});

// export connection(s) to use elsewhere as needed
module.exports = {
  assemblyAI
};
