'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
		email: DataTypes.STRING,
		first_name: DataTypes.STRING,
		last_name: DataTypes.STRING,
		active: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
				User.hasMany(models.GoogleDriveOAuth, {
					foreignKey: 'user_id'
				});
				User.hasMany(models.GitHubOAuth, {
					foreignKey: 'user_id'
				});
				User.hasMany(models.BoxOAuth, {
					foreignKey: 'user_id'
				});
      }
    }
  });
  return User;
};
