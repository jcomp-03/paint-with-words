const mongoose = require("mongoose");

mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/paint-with-words",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("----- Connected to MongoDB database -----"))
  .catch((error) => {
    console.log(
      "----- Error on initial connection to MongoDB database: -----\n",
      error
    );
  });

module.exports = mongoose.connection;
