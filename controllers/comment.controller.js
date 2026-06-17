const Comment = require("../models/comment.model");

const obtenerComentariosPorPost = async (req, res, next) => {
  try {
    const meses = parseInt(process.env.COMMENT_VISIBILITY_MONTHS) || 6;
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() - meses);

    const comentarios = await Comment.find({
      post: req.params.postId,
      createdAt: { $gte: fechaLimite },
    }).populate("user", "nickName");

    res.json(comentarios);
  } catch (error) {
    next(error);
  }
};

const crearComentario = async (req, res, next) => {
  try {
    const comentario = await Comment.create(req.body);
    res.status(201).json(comentario);
  } catch (error) {
    next(error);
  }
};

const actualizarComentario = async (req, res, next) => {
  try {
    const comentario = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(comentario);
  } catch (error) {
    next(error);
  }
};

const eliminarComentario = async (req, res, next) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { obtenerComentariosPorPost, crearComentario, actualizarComentario, eliminarComentario };