const express = require("express");

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addImageToPost,
  removeImageFromPost,
  addTagToPost,
  removeTagFromPost
} = require("../controllers/post.controller");

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

router.post("/:id/images", addImageToPost);
router.delete("/:id/images/:imageId", removeImageFromPost);

router.post("/:id/tags/:tagId", addTagToPost);
router.delete("/:id/tags/:tagId", removeTagFromPost);

module.exports = router;
