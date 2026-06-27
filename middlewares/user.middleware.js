const User = require("../models/user.model");

const verificarUsuarioExistente = async (req, res, next) => {
  try {
    const nickNameBuscado = req.params.nickName || req.body.nickName;
    if (!nickNameBuscado) {
      return res.status(400).json({ error: "Falta indicar el nickName del usuario." });
    }
    const user = await User.findOne({ nickName: nickNameBuscado });

    if (!user) {
      return res.status(404).json({ error: `El usuario '${nickNameBuscado}' no existe` });
    }
    req.usuario = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error interno al verificar el usuario' });
  }
};

const verificarUsuariosFollow = async (req, res, next) => {
  try {
    const { seguidorNick } = req.params;
    const { seguir } = req.body;

    const [seguidor, seguido] = await Promise.all([
      User.findOne({ nickName: seguidorNick }),
      User.findOne({ nickName: seguir })
    ]);

    if (!seguidor || !seguido) {
      return res.status(404).json({ error: 'Uno o ambos usuarios no existen.' });
    }
    req.usuarioSeguidor = seguidor;
    req.usuarioSeguido = seguido;

    next();
  } catch (error) {
    res.status(500).json({ error: 'Error al validar usuarios para seguir' });
  }
};

const validarRepeticiones = async (req, res, next) => {
  try {
    const { nickName, email } = req.body;
    const nickNameUrl = req.params.nickName;

    if (nickName && !nickNameUrl) {
      const existeNick = await User.findOne({ nickName });
      if (existeNick) return res.status(400).json({ error: 'El nombre de usuario ya está en uso.' });
    }

    if (email) {
      const query = nickNameUrl ? { email, nickName: { $ne: nickNameUrl } } : { email };
      const existeEmail = await User.findOne(query);
      if (existeEmail) return res.status(400).json({ error: 'El correo electrónico ya se encuentra en uso.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar repeticiones' });
  }
};

// Verifica que el usuario exista buscándolo por su _id (cuando llega en el body, ej: al crear un comentario)
const verificarUsuarioPorId = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.user);
    if (!user) return res.status(404).json({ error: "El usuario no existe" });
    req.usuario = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verificarUsuarioExistente,
  verificarUsuariosFollow,
  validarRepeticiones,
  verificarUsuarioPorId,
};