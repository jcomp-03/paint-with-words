const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Minimum length is 3"]
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Minimum length is 3"]
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, "Minimum length is 3"]
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Email must be in a valid syntax.']
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Minimum length is 8"]
    },
    // images are not subdocuments of user collection; 
    // referenced documents, like below, are separate top-level documents.
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Image'
      }
    ],
    // same with friends; they are not subdocuments
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    totalPaintingsMade: {
      type: Number,
      default: 0
    },
    totalPromptsMade: {
      type: Number,
      default: 0,
      get: function() {
        return this.previousPrompts.length;
      }
    },
    previousPrompts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Prompt'
      }
    ]
  },
  {
    toJSON: {
      virtuals: true
    }
  }
);

// set up pre-save middleware to create password
userSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

userSchema.virtual('promptCount').get(function() {
  return this.previousPrompts.length;
});

const User = model('User', userSchema);

module.exports = User;
