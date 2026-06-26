const Tag = require("../models/tag.model");
const {tagSchema} = require("../schemas/tagSchema.js")

const validarIdTag = async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ error: "Tag no encontrado" });
    req.tag = tag;
    next();
  } catch (error) {
    next(error);
  }
};

const validarDatosTag = (req, res, next) => {
    const {error} = tagSchema.validate(req.body)
    if (error){
        return res.status(400).json({message: error.details[0].message})
    }
    next()
}

module.exports = { validarIdTag,validarDatosTag };