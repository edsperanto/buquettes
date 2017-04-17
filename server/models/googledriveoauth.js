'use strict';
module.exports = function(sequelize, DataTypes) {
  var GoogleDriveOAuth = sequelize.define('GoogleDriveOAuth', {
    token: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
		credentials: DataTypes.TEXT,
  }, {
    classMethods: {
      associate: function(models) {
				GoogleDriveOAuth.belongsTo(models.User, {
					foreignKey: 'user_id',
					as: 'user'
				});
      }
    }
  });
  return GoogleDriveOAuth;
};
