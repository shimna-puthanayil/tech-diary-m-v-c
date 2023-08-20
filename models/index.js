const User = require('./User');
const Blog = require('./Blog');

User.hasMany(Blog, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Blog.belongsTo(User, {
  foreignKey: 'userId',
});

module.exports = { User, Blog };
