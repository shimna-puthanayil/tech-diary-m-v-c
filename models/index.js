const User = require('./User');
const Blog = require('./Post');
const Comment = require('./Comment');
User.hasMany(Blog, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Blog.belongsTo(User, {
  foreignKey: 'userId',
});
Blog.hasMany(Comment, {
  foreignKey: 'blogId',
  onDelete: 'CASCADE',
});
Comment.belongsTo(Blog, {
  foreignKey: 'blogId',
});
User.hasMany(Comment, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Comment.belongsTo(User, {
  foreignKey: 'userId',
});

module.exports = { User, Blog, Comment };
