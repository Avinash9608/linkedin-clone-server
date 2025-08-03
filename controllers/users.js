const User = require("../models/User");
const Post = require("../models/Post");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get user profile
// @route   GET /api/v1/users/:id
// @access  Public
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  const posts = await Post.find({ author: req.params.id }).populate("author", "name").sort("-createdAt");

  res.status(200).json({
    success: true,
    data: {
      user,
      posts,
    },
  });
});
