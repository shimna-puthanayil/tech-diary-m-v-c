const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

//User can have many posts
User.hasMany(Post, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

//post belongs to one user
Post.belongsTo(User, {
  foreignKey: 'userId',
});

//Post can have many comments
Post.hasMany(Comment, {
  foreignKey: 'blogId',
  onDelete: 'CASCADE',
});

//comment belongs to one post
Comment.belongsTo(Post, {
  foreignKey: 'blogId',
});

//User can write many comments
User.hasMany(Comment, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

//comment belongs to one user
Comment.belongsTo(User, {
  foreignKey: 'userId',
});

module.exports = { User, Post, Comment };
