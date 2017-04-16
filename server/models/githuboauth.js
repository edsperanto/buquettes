'use strict';
module.exports = function(sequelize, DataTypes) {
  var GitHubOAuth = sequelize.define('GitHubOAuth', {
    token: DataTypes.STRING,
    username: DataTypes.STRING,
    scope: DataTypes.STRING
    /* user_id: DataTypes.INTEGER */
  }, {
    classMethods: {
      associate: function(models) {
				GitHubOAuth.belongsTo(models.User, {
					foreignKey: 'user_id',
					as: 'user'
				});
      }
    }
  });
  return GitHubOAuth;
};
