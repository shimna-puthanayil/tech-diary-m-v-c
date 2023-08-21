const router = require('express').Router();
const { Blog, User } = require('../models');
// Import the custom middleware
const withAuth = require('../utils/auth');

// GET all blogs for homepage
router.get('/', async (req, res) => {
  try {
    const dbBlogData = await Blog.findAll({ include: [{ model: User }] });

    const blogs = dbBlogData.map((blog) => blog.get({ plain: true }));

    res.render('homepage', {
      blogs,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one blog b
// Use the custom middleware before allowing the user to access the blog
router.get('/blog/:id', withAuth, async (req, res) => {
  try {
    const dbBlogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
      ],
    });
    req.session.blogId = req.params.id;
    const blog = dbBlogData.get({ plain: true });
    res.render('blog', {
      blog,
      blogId: req.session.blogId,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET blogs of the logged in user
// Use the custom middleware before allowing the user to access the blog
router.get('/dashboard/', withAuth, async (req, res) => {
  try {
    const dbBlogData = await Blog.findAll({
      include: [{ model: User }],
      where: {
        userId: req.session.userId,
      },
    });

    const blogs = dbBlogData.map((blog) => blog.get({ plain: true }));
    res.render('dashboard', {
      blogs,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;