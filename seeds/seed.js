const sequelize = require('../config/connection');
const { User, Post } = require('../models');

const userData = require('./userData.json');
const blogData = require('./blogData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });
  //seeding users
  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  //seeding posts
  const posts = await Post.bulkCreate(blogData);
  process.exit(0);
};

seedDatabase();
