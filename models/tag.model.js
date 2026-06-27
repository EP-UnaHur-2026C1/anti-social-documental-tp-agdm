const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            trim: true,
            required: [true, "El nombre de la etiqueta es obligatorio"],
            unique: true,
            minlength: [2, "el tag debe tener al menos 2 caracteres"],
            match: [
                /^#\S+$/,
                "el tag debe comenzar con # y no puede haber espacio entre palabras"
            ]
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Tag", tagSchema);