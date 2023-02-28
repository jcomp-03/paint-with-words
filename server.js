// import modules/packages/dependencies
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 8001;
require('dotenv').config();

const routes = require('./server/routes');

const app = express();
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.use(routes);
app.get('/', async (req, res) => {
  try {
    // get absolute path of index.html
    const root = path.join(__dirname, 'index.html');
    // respond by sending index.html file
    res.status(200).sendFile(root);
  } catch (error) {
    console.log('***** Error! Undesired event in / endpoint: *****\n', error);
    res.status(400).json(error);
  }
});
app.get('/transcription', async (req, res) => {
    try {
      const response = await axios.post(
        // use account token to get a temp user token
        'https://api.assemblyai.com/v2/realtime/token',
        // can set a TTL timer in seconds.
        { expires_in: 3600 },
        // AssemblyAI API Key goes here; saved as environment variable for privacy/security
        { headers: { authorization: process.env.ASSEMBLYAI_API_KEY } }
      );
      // destructure data property from response
      const { data } = response;
      // create new environment variable to store temporary authentication token
      process.env.TEMP_TOKEN = data.token;
  
      res.json(data);
    } catch (error) {
      console.log('***** Error! Undesired event in /transcription endpoint: *****\n', error);
      res.status(400).json(error);
    }
});


// start the web server, listening for connections on the port assigned above
const server = app.listen(PORT, () => {
  console.log(`***** Server is running on port ${PORT} *****`);
});