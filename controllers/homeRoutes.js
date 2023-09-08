const router = require('express').Router();
const { Post, User, Comment } = require('../models');
// Import the custom middleware
const withAuth = require('../utils/auth');

// GET all posts for homepage
router.get('/', async (req, res) => {
  try {
    const dbBlogData = await Post.findAll({
      order: [['id', 'DESC']],
      include: [{ model: User }],
    });

    const posts = dbBlogData.map((blog) => blog.get({ plain: true }));

    res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one post by id .This includes the comments related to the post
router.get('/post/:id', async (req, res) => {
  try {
    const dbBlogData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
        {
          //to get all the comments related to the post including the names of the users who commented
          model: Comment,
          attributes: ['dateCreated', 'comment'],
          include: [
            {
              model: User,
              attributes: ['name'],
            },
          ],
        },
      ],
    });
    req.session.postId = req.params.id;
    const post = dbBlogData.get({ plain: true });
    res.render('post', {
      post,
      postId: req.session.postId,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET blog posts of the logged in user
// Use the custom middleware before allowing the user to access the dashboard
router.get('/dashboard/', withAuth, async (req, res) => {
  try {
    const dbBlogData = await Post.findAll({
      include: [{ model: User }],
      where: {
        userId: req.session.userId,
      },
    });

    const posts = dbBlogData.map((blog) => blog.get({ plain: true }));
    const dbUserData = await User.findOne({
      where: {
        id: req.session.userId,
      },
    });
    res.render('dashboard', {
      posts,
      loggedIn: req.session.loggedIn,
      userName: dbUserData.name,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//to render login page
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

// CREATE new post
// Use the custom middleware before allowing the user to create a post
router.post('/', withAuth, async (req, res) => {
  try {
    const dbBlogData = await Post.create({
      title: req.body.title,
      description: req.body.description,
      userId: req.session.userId,
    });
    console.log(dbBlogData);
    if (dbBlogData) {
      res.status(200).json();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//GET route to get a post by id for editing
router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    const dbBlogData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
      ],
    });
    req.session.postId = req.params.id;
    const post = dbBlogData.get({ plain: true });
    console.log(post);
    res.render('editpost', {
      post,
      postId: req.session.postId,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//UPDATE route to update a post by id
router.put('/update/:id', withAuth, async (req, res) => {
  const post = await Post.update(
    {
      title: req.body.title,
      description: req.body.description,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );
  res.render('editpost', {
    post,
    postId: req.session.postId,
    loggedIn: req.session.loggedIn,
  });
});

//DELETE route to delete a post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    res.status(200).json();
  } catch (err) {
    res.status(500).json(err);
  }
});

//to render the handlebar addnewpost
router.get('/addnewpost', withAuth, async (req, res) => {
  try {
    res.render('addnewpost', {
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;
