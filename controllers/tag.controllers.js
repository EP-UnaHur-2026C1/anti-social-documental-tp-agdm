const Tag = require('../models/tag.model');
const Post = require('../models/post.model');

const obtenerTags = async (req,res) => {
    try{
        const tags = await Tag.find()
        .select("-createdAt -updatedAt -__v");
        res.status(200).json(tags)
    }catch (error){
        res.status(500).json({ error: 'Error al obtener los tags.' })
        console.log(error.message)
    }
}

const obtenerTagsDePost = async (req,res) => {
    try{
        const post = req.post;
        const tags = await Post.tags
        .select("-createdAt -updatedAt -__v");
        res.status(200).json(tags);
    }catch (error){
        res.status(500).json({ error: 'Error al obtener los tags.' })
        console.log(error.message)
    }
}

const obtenerTag = async (req,res) => {
    try{
        const tag = req.tag
        .select("-createdAt -updatedAt -__v");
        res.status(200).json(tag)
    }catch (error){
        res.status(500).json({ error: 'Error al obtener el tag.' })
        console.log(error.message)
    }
}

const crearTag = async (req,res) => {
    try{
        const tag = await Tag.create(req.body)
        res.status(200).json(tag)
    }catch (error){
        res.status(500).json({ error: 'Error al crear tag.' })
        console.log(error.message)
    }
}

const actualizarTag = async (req,res) => {
    try{
        const {id} = req.params
        const tag = await Tag.findByIdAndUpdate(id,req.body,{
            new: true,
            runValidators: true  
        })
        res.status(200).json(tag)
    }catch (error){
        res.status(500).json({ error: 'Error al actualizar tag.' })
        console.log(error.message)
    }
}

const eliminarTag = async (req,res) => {
    try{
        const {id} = req.params;
        const tagEliminado = await Tag.findByIdAndDelete(id)
        res.status(200).json({message: "se elimino el tag"})
    }catch (error){
        res.status(500).json({ error: 'Error al eliminar tag.' })
        console.log(error.message)
    }
}

module.exports = {
    obtenerTags,
    obtenerTagsDePost,
    obtenerTag,
    crearTag,
    actualizarTag,
    eliminarTag
}