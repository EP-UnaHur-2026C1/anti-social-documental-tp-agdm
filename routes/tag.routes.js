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
const {validarIdTag,validarDatosTag} = require("../middlewares/tag.middleware.js");

router.get("/", obtenerTags);
router.get("/post/:postId", verificarPostExistente, obtenerTagsDePost);
router.get("/:id", validarIdTag, obtenerTag);
router.post("/", validarDatosTag, crearTag);
router.put("/:id", validarIdTag, validarDatosTag, actualizarTag);
router.delete("/:id",validarIdTag, eliminarTag);

// Revisar el tema del schema de valicacionDatosTag

module.exports = router