'use strict';
module.exports = function(sequelize, DataTypes) {
  var GoogleDriveOAuth = sequelize.define('GoogleDriveOAuth', {
    token: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
				GoogleDriveOAuth.belongsTo(models.User, {
					foreignKey: 'user_id',
					as: 'user'
				});
      }
    }
  });
  return GoogleDriveOAuth;
};
