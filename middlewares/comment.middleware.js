const Comment = require("../models/comment.model");

const verificarComentarioExistente = async (req, res, next) => {
  try {
    const comentario = await Comment.findById(req.params.id);
    if (!comentario) return res.status(404).json({ error: "Comentario no encontrado" });
    req.comentario = comentario;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { verificarComentarioExistente };