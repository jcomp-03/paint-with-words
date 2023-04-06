// const faker = require('faker');
const userSeeds = require("./userSeed.json");
const imageSeeds = require("./imageSeed.json");
const db = require("../config/connection");
const { Image, User } = require("../models");

db.once("open", async () => {
  try {
    await Image.deleteMany({});
    await User.deleteMany({});
    await User.create(userSeeds);

    for (let i = 0; i < imageSeeds.length; i++) {
      const {_id, username } = await Image.create(imageSeeds[i]);
      console.log(`image username, id: ${username} ${_id}, respectively`);
      const user = await User.findOneAndUpdate(
        { username: username },
        { $addToSet: { images: _id} },
        { new: true }
      )
      // .select('-_id firstName lastName images friends');
      // console.log('user is now', user);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("----- Seed file run successfully! -----");
  process.exit(0);
});
