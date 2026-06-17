const errorHandler = (err, req, res, next) => {
  // ID con formato inválido
  if (err.name === "CastError") {
    return res.status(400).json({ error: `ID inválido: ${err.value}` });
  }

  // Validación de Mongoose (required, etc.)
  if (err.name === "ValidationError") {
    const errores = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ errores });
  }

  // Valor duplicado (unique)
  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue)[0];
    return res.status(409).json({ error: `Ya existe un registro con ese ${campo}` });
  }

  // Error genérico
  res.status(500).json({ error: "Error interno del servidor" });
};

module.exports = errorHandler;