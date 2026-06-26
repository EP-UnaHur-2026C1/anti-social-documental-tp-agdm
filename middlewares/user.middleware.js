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


// Esta funcion lo que hace es verificar si existe el usuario que va a seguir y el usuario seguido
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

// Aca lo que hice fue verificar que el usuario o el mail no se repita a la hora de crear un usuario o al actualizar tambien en caso de mail.
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

module.exports = { 
  verificarUsuarioExistente, 
  verificarUsuariosFollow, 
  validarRepeticiones,

};