'use strict';
module.exports = function(sequelize, DataTypes) {
  var GitHubOAuth = sequelize.define('GitHubOAuth', {
    token: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return GitHubOAuth;
};