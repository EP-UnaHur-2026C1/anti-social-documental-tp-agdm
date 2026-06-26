const User = require('../models/user.model');


const manejarErroresMongoose = (error, res) => {
  if (error.name === 'ValidationError') {
    const mensajes = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ errors: mensajes });
  }
}

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find({}, 'nickName email -_id');
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

const obtenerUsuario = async (req, res) => {
  try {
    const usuarioCompleto = await User.findOne(req.user, 'nickName email')
      .populate('followers', 'nickName -_id')
      .populate('following', 'nickName -_id');

    res.status(200).json(usuarioCompleto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { nickName, email, password } = req.body;
    
    const nuevoUsuario = await User.create({ nickName, email, password });
    res.status(201).json({
      nickName: nuevoUsuario.nickName,
      email: nuevoUsuario.email
    });
  } catch (error) {
      manejarErroresMongoose(error, res);
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    
    if (req.body.nickName !== undefined) {
      return res.status(403).json({ 
        error: "No se puede modificar el nombre de usuario." 
    });
  }
    const usuarioActualizado = await User.findByIdAndUpdate(req.user,req.body, 
      { new: true, runValidators: true } 
    );


    res.status(200).json({ 
      nickName: usuarioActualizado.nickName, 
      email: usuarioActualizado.email 
    });
  } catch (error) {
      manejarErroresMongoose(error, res);
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user);
    res.status(200).json({ message: `Usuario ${req.params.nickName} eliminado correctamente` });
  } catch (error) {
    res.status(500).json({ error: `Error al eliminar el usuario` });
  }
};


const seguirUsuario = async (req, res) => {
  try {
    const { seguidorNick } = req.params;
    const { seguir } = req.body;
    const seguidor = req.usuarioSeguidor;
    const seguido = req.usuarioSeguido;

    if (seguidor._id.toString() === seguido._id.toString()) {
      return res.status(400).json({ error: 'No podés seguirte a vos mismo' });
    }

    if (seguidor.following.includes(seguido._id)) {
      return res.status(409).json({ error: 'Ya seguís a este usuario' });
    }

    await Promise.all([
      User.findByIdAndUpdate(seguidor._id, { $addToSet: { following: seguido._id } }),
      User.findByIdAndUpdate(seguido._id, { $addToSet: { followers: seguidor._id } })
    ]);

    res.status(200).json({ message: `${seguidorNick} está siguiendo ahora a ${seguir}` });
  } catch (error) {
    res.status(500).json({ error: 'No se ha podido seguir al usuario.' });
  }
};

const dejarDeSeguir = async (req, res) => {
  try {
    const { seguidorNick } = req.params;
    const { seguir } = req.body;
    const seguidor = req.usuarioSeguidor;
    const seguido = req.usuarioSeguido;

    if (seguidor._id.toString() === seguido._id.toString()) {
      return res.status(400).json({ error: 'No podés dejar de seguirte a vos mismo' });
    }

    if (!seguidor.following.includes(seguido._id)) {
      return res.status(400).json({ error: `No estás siguiendo a ${seguir}` });
    }

    await Promise.all([
      User.findByIdAndUpdate(seguidor._id, { $pull: { following: seguido._id } }),
      User.findByIdAndUpdate(seguido._id, { $pull: { followers: seguidor._id } })
    ]);

    res.status(200).json({ message: `${seguidorNick} ha dejado de seguir a ${seguir}` });
  } catch (error) {
    res.status(500).json({ error: 'No se ha podido dejar de seguir al usuario.' });
  }
};

module.exports = {
  obtenerUsuarios, obtenerUsuario, crearUsuario, 
  actualizarUsuario, eliminarUsuario, seguirUsuario, dejarDeSeguir,manejarErroresMongoose
};