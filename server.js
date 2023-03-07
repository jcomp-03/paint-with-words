// import modules/packages/dependencies
const express = require('express');

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

// start the web server, listening for connections on the port assigned above
const server = app.listen(PORT, () => {
  console.log(`***** Server is running on port ${PORT} *****`);
});