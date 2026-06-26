const Tag = require("../models/tag.model");

const validarIdTag = async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params.id)
        .select("-createdAt -updatedAt -__v");
    if (!tag) return res.status(404).json({ error: "Tag no encontrado" });
    req.tag = tag;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { validarIdTag };