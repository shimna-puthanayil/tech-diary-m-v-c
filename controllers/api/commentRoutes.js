const router = require('express').Router();
const { Comment } = require('../../models');

// CREATE new comment
router.post('/', async (req, res) => {
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
