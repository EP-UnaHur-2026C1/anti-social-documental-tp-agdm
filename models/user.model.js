const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        nickName: {
            type: String,
            required: [true, "El nickName es obligatorio"],
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "El email es obligatorio"],
            unique: true,
            trim: true,
            minlength: [1, "No has ingresado ningun mail."],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Por favor, ingresá un formato de correo electrónico válido"
            ]
        },
        password: {
            type: String,
            required: [true, "La contraseña es obligatoria"],
            trim: true,
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);