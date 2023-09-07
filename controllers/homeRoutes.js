const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
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

// GET one blog by id
router.get('/post/:id', async (req, res) => {
  try {
    const dbBlogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
        {
          //to get all the comments related to the recipe including the names of the users who commented
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

// CREATE new post
// Use the custom middleware before allowing the user to create a post
router.post('/', withAuth, async (req, res) => {
  try {
    const dbBlogData = await Blog.create({
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

router.get('/edit/:id', withAuth, async (req, res) => {
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
    const post = dbBlogData.get({ plain: true });
    console.log(post);
    res.render('editpost', {
      post,
      blogId: req.session.blogId,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/update/:id', withAuth, async (req, res) => {
  const post = await Blog.update(
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
  // if (post[0] === 0) {
  //   res.status(404).json({ message: 'No post found with this id!' });
  //   return;
  // }
  res.render('editpost', {
    post,
    blogId: req.session.blogId,
    loggedIn: req.session.loggedIn,
  });
});
//delete post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Blog.destroy({
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
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;
