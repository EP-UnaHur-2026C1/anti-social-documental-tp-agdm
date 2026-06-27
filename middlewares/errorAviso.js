const manejarErroresMongoose = (error, res) => {
  if (error.name === 'ValidationError') {
    const mensajes = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ errors: mensajes });
  }
}

module.exports = manejarErroresMongoose;