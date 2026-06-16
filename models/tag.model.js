const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "El nombre de la etiqueta es obligatorio"],
            trim: true,
            unique: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Tag", tagSchema);