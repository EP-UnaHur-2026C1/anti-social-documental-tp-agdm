const { Router } = require('express');
const controller = require('../controllers/user.controller');
const { 
  verificarUsuarioExistente, 
  verificarUsuariosFollow, 
  validarRepeticiones 
} = require('../middlewares/user.middleware');



const router = Router();

//Crear y obtener usuarios
router.get('/', controller.obtenerUsuarios);
router.post('/', validarRepeticiones, controller.crearUsuario); 

// Rutas de Usuario Específico
router.get('/:nickName', verificarUsuarioExistente, controller.obtenerUsuario); 
router.put('/:nickName', verificarUsuarioExistente, validarRepeticiones, controller.actualizarUsuario);
router.delete('/:nickName', verificarUsuarioExistente, controller.eliminarUsuario);

// Rutas de Seguidores
router.post('/:seguidorNick/follow', verificarUsuariosFollow, controller.seguirUsuario);
router.delete('/:seguidorNick/unfollow', verificarUsuariosFollow, controller.dejarDeSeguir);

module.exports = router;