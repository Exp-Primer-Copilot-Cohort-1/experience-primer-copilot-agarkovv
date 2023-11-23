// Create web server

// Load modules
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

// Load data
const comments = require("../data/comments.json");
const users = require("../data/users.json");

// Get all comments
router.get("/", (req, res) => {
  res.json(comments);
});

// Get comment by ID
router.get("/:id", (req, res) => {
  const comment = comments.find((comment) => comment.id === req.params.id);
  if (!comment) {
    return res.status(404).json({ msg: "Comment not found" });
  }
  res.json(comment);
});

// Get comments by user
router.get("/user/:id", (req, res) => {
  const user = users.find((user) => user.id === req.params.id);
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  const userComments = comments.filter((comment) => comment.user === user.id);
  res.json(userComments);
});

// Get comments by post
router.get("/post/:id", (req, res) => {
  const user = users.find((user) => user.id === req.params.id);
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  const userComments = comments.filter((comment) => comment.user === user.id);
  res.json(userComments);
});

// Create comment
router.post(
  "/",
  [
    check("text", "Text is required").not().isEmpty(),
    check("user", "User is required").not().isEmpty(),
    check("post", "Post is required").not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return any errors with 400 status
      return res.status(400).json({ errors: errors.array() });
    }

    // Create new comment
    const newComment = {
      id: uuidv4(),
      text: req.body.text,
      user: req.body.user,
      post: req.body.post,
      date: new Date().toISOString(),
    };
