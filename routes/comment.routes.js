const express = require("express");
const router = express.Router();
const {
  obtenerComentariosPorPost,
  crearComentario,
  actualizarComentario,
  eliminarComentario,
} = require("../controllers/comment.controller");
const { verificarPostExistente } = require("../middlewares/post.middleware");
const { verificarUsuarioExistente, verificarUsuarioPorId } = require("../middlewares/user.middleware");
const { verificarComentarioExistente } = require("../middlewares/comment.middleware");

router.get("/post/:postId", verificarPostExistente, obtenerComentariosPorPost);
router.post("/", verificarPostExistente, verificarUsuarioPorId, crearComentario);
router.put("/:id", verificarComentarioExistente, actualizarComentario);
router.delete("/:id", verificarComentarioExistente, eliminarComentario);

module.exports = router;