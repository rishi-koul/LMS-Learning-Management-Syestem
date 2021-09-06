const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      index: true,
    },
    img:
    {
        type: String
    },
    login : {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

module.exports = model("User", userSchema);
