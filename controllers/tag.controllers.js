const Tag = require('../models/tag.model');
const Post = require('../models/post.model');
const manejarErroresMongoose = require('../middlewares/errorAviso');

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
        const post = await req.post.populate({
            path: "tags",
            select: "-createdAt -updatedAt -__v -_id"
        })
        res.status(200).json(post.tags);
    }catch (error){
        res.status(500).json({ error: 'Error al obtener los tags.' })
        console.log(error.message)
    }
}

const obtenerTag = async (req,res) => {
    try{
        const tag = req.tag
        res.status(200).json(tag)
    }catch (error){
        res.status(500).json({ error: 'Error al obtener el tag.' })
        console.log(error.message)
    }
}

const crearTag = async (req,res) => {
    try{
        const tag = await Tag.create(req.body)
        res.status(201).json(tag)
    }catch (error){
        manejarErroresMongoose(error, res);
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
        manejarErroresMongoose(error, res);
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