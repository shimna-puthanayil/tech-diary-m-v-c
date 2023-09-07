const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// CREATE new comment
// Use the custom middleware before allowing the user to post a comment 
router.post('/', withAuth, async (req, res) => {
  try {
    const dbCommentData = await Comment.create({
      comment: req.body.comment,
      blogId: req.session.blogId,
      userId: req.session.userId,
    });
    console.log(dbCommentData);
    if (dbCommentData) {
      res.status(200).json(dbCommentData);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;
