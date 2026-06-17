const Post = require("../models/post.model");

const verificarPostExistente = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId || req.body.post);
    if (!post) return res.status(404).json({ error: "El post no existe" });
    req.post = post;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { verificarPostExistente };