const User = require("../models/user.model");

const verificarUsuarioExistente = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.user);
    if (!user) return res.status(404).json({ error: "El usuario no existe" });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { verificarUsuarioExistente };