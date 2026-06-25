const mongoose = require("mongoose");

const postImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "La URL de la imagen es obligatoria"],
    trim: true,
  },
});

const postSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario es obligatorio"],
    },
    images: [postImageSchema],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", postSchema);
