// const faker = require('faker');
const userSeeds = require("./userSeed.json");
const imageSeeds = require("./imageSeed.json");
const promptSeeds = require("./promptSeed.json");

const db = require("../config/connection");
const { User, Prompt, Image } = require("../models");

db.once("open", async () => {
  try {
    // order of deletion matters due to relationship between data?
    await Image.deleteMany({});
    await Prompt.deleteMany({});
    await User.deleteMany({});
    await User.create(userSeeds);

    // now, populate the Image collection with all the images in the seed file
    // then, most importantly, locate the owner of each image in the User collection
    // and add the image to the owner's set of images
    for (let i = 0; i < imageSeeds.length; i++) {
      const { _id, username } = await Image.create(imageSeeds[i]);
      //console.log(`image username, id: ${username} ${_id}, respectively`);
      const user = await User.findOneAndUpdate(
        { username: username },
        { $addToSet: { images: _id } },
        { new: true }
      ).select("_id firstName lastName username");
      //console.log('user is now', user);
    }

    // do something similar for the prompts: populate the Prompt collection with all the
    // prompts in the seed file and then add each prompt to its correct owner
    for (let i = 0; i < promptSeeds.length; i++) {
      const { _id, username, promptText, createdOn } = await Prompt.create(promptSeeds[i]);
      //console.log(`prompt id, username, promptText, createdOn: \n ${_id} \n ${promptText} \n ${createdOn}`);
      const user = await User.findOneAndUpdate(
        { username: username },
        { $addToSet: { previousPrompts: _id } },
        { new: true }
      ).select("_id firstName lastName previousPrompts");
      //console.log('user is now', user);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("----- Seed file run successfully! -----");
  process.exit(0);
});
