const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// POST route to create new comment
// Use the custom middleware before allowing the user to post a comment
router.post('/', withAuth, async (req, res) => {
  try {
    const dbCommentData = await Comment.create({
      comment: req.body.comment,
      postId: req.session.postId,
      userId: req.session.userId,
    });
    if (dbCommentData) {
      res.status(200).json(dbCommentData);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;
