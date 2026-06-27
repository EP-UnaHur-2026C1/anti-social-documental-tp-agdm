const mongoose = require("mongoose");

const Post = require("../models/post.model");
const User = require("../models/user.model");
const Tag = require("../models/tag.model");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "nickName email")
      .populate("tags", "nombre")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      total: posts.length,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al obtener los posts",
      error: error.message,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        ok: false,
        message: "ID de post inválido",
      });
    }

    const post = await Post.findById(id)
      .populate("user", "nickName email")
      .populate("tags", "nombre");

    if (!post) {
      return res.status(404).json({
        ok: false,
        message: "Post no encontrado",
      });
    }

    return res.status(200).json({
      ok: true,
      post,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al obtener el post",
      error: error.message,
    });
  }
};

const createPost = async (req, res) => {
  try {
    const { description, user, images = [], tags = [] } = req.body;

    if (!description || !user) {
      return res.status(400).json({
        ok: false,
        message: "La descripción y el usuario son obligatorios",
      });
    }

    if (!isValidObjectId(user)) {
      return res.status(400).json({
        ok: false,
        message: "ID de usuario inválido",
      });
    }

    const userExists = await User.findById(user);

    if (!userExists) {
      return res.status(404).json({
        ok: false,
        message: "El usuario indicado no existe",
      });
    }

    if (!Array.isArray(images)) {
      return res.status(400).json({
        ok: false,
        message: "Las imágenes deben enviarse como array",
      });
    }

    const normalizedImages = images.map((image) => {
      if (typeof image === "string") {
        return { url: image };
      }

      return image;
    });

    const validImages = normalizedImages.every(
      (image) => image.url && typeof image.url === "string",
    );

    if (!validImages) {
      return res.status(400).json({
        ok: false,
        message: "Cada imagen debe tener una URL válida",
      });
    }

    if (!Array.isArray(tags)) {
      return res.status(400).json({
        ok: false,
        message: "Los tags deben enviarse como array de IDs",
      });
    }

    const validTags = tags.every((tagId) => isValidObjectId(tagId));

    if (!validTags) {
      return res.status(400).json({
        ok: false,
        message: "Uno o más tags tienen un ID inválido",
      });
    }

    if (tags.length > 0) {
      const existingTags = await Tag.find({
        _id: { $in: tags },
      });

      if (existingTags.length !== tags.length) {
        return res.status(404).json({
          ok: false,
          message: "Uno o más tags no existen",
        });
      }
    }

    const post = await Post.create({
      description,
      user,
      images: normalizedImages,
      tags,
    });

    const populatedPost = await Post.findById(post._id)
      .populate("user", "nickName email")
      .populate("tags", "nombre");

    return res.status(201).json({
      ok: true,
      message: "Post creado correctamente",
      post: populatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al crear el post",
      error: error.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        ok: false,
        message: "ID de post inválido",
      });
    }

    if (!description) {
      return res.status(400).json({
        ok: false,
        message: "La descripción es obligatoria",
      });
    }

    const post = await Post.findByIdAndUpdate(
      id,
      { description },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("user", "nickName email")
      .populate("tags", "nombre");

    if (!post) {
      return res.status(404).json({
        ok: false,
        message: "Post no encontrado",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Post actualizado correctamente",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al actualizar el post",
      error: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        ok: false,
        message: "ID de post inválido",
      });
    }

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        ok: false,
        message: "Post no encontrado",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Post eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al eliminar el post",
      error: error.message,
    });
  }
};

const addImageToPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { url } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        ok: false,
        message: "ID de post inválido",
      });
    }

    if (!url) {
      return res.status(400).json({
        ok: false,
        message: "La URL de la imagen es obligatoria",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        ok: false,
        message: "Post no encontrado",
      });
    }

    post.images.push({ url });
    await post.save();

    return res.status(201).json({
      ok: true,
      message: "Imagen agregada correctamente",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al agregar la imagen",
      error: error.message,
    });
  }
};

const removeImageFromPost = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    if (!isValidObjectId(id) || !isValidObjectId(imageId)) {
      return res.status(400).json({
        ok: false,
        message: "ID de post o imagen inválido",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        ok: false,
        message: "Post no encontrado",
      });
    }

    const imageExists = post.images.id(imageId);

    if (!imageExists) {
      return res.status(404).json({
        ok: false,
        message: "Imagen no encontrada en el post",
      });
    }

    post.images.pull(imageId);
    await post.save();

    return res.status(200).json({
      ok: true,
      message: "Imagen eliminada correctamente",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al eliminar la imagen",
      error: error.message,
    });
  }
};

const addTagToPost = async (req, res) => {
  try {
    const { id, tagId } = req.params;

    if (!isValidObjectId(id) || !isValidObjectId(tagId)) {
      return res.status(400).json({
        ok: false,
        message: "ID de post o tag inválido",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        ok: false,
        message: "Post no encontrado",
      });
    }

    const tag = await Tag.findById(tagId);

    if (!tag) {
      return res.status(404).json({
        ok: false,
        message: "Tag no encontrado",
      });
    }

    const alreadyExists = post.tags.some(
      (currentTagId) => currentTagId.toString() === tagId,
    );

    if (!alreadyExists) {
      post.tags.push(tagId);
      await post.save();
    }

    const populatedPost = await Post.findById(id)
      .populate("user", "nickName email")
      .populate("tags", "nombre");

    return res.status(200).json({
      ok: true,
      message: "Tag asociado correctamente",
      post: populatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al asociar tag",
      error: error.message,
    });
  }
};

const removeTagFromPost = async (req, res) => {
  try {
    const { id, tagId } = req.params;

    if (!isValidObjectId(id) || !isValidObjectId(tagId)) {
      return res.status(400).json({
        ok: false,
        message: "ID de post o tag inválido",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        ok: false,
        message: "Post no encontrado",
      });
    }

    post.tags = post.tags.filter(
      (currentTagId) => currentTagId.toString() !== tagId,
    );

    await post.save();

    const populatedPost = await Post.findById(id)
      .populate("user", "nickName email")
      .populate("tags", "nombre");

    return res.status(200).json({
      ok: true,
      message: "Tag eliminado correctamente",
      post: populatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al eliminar tag",
      error: error.message,
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addImageToPost,
  removeImageFromPost,
  addTagToPost,
  removeTagFromPost,
};