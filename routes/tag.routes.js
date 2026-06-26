const {Router} = require('express');
const router = Router();
const {
    obtenerTags,
    obtenerTagsDePost,
    obtenerTag,
    crearTag,
    actualizarTag,
    eliminarTag
} = require('../controllers/tag.controllers');
const {verificarPostExistente} = require("../middlewares/post.middleware.js");
const {validarIdTag} = require("../middlewares/tag.middleware.js");

router.get("/", obtenerTags);
router.get("/post/:postId", verificarPostExistente, obtenerTagsDePost);
router.get("/:id", validarIdTag, obtenerTag);
router.post("/", crearTag);
router.put("/:id", validarIdTag, actualizarTag);
router.delete("/:id",validarIdTag, eliminarTag);

module.exports = router