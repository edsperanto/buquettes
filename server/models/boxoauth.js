'use strict';
module.exports = function(sequelize, DataTypes) {
  var BoxOAuth = sequelize.define('BoxOAuth', {
    token: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
				BoxOAuth.belongsTo(models.User, {
					foreignKey: 'user_id',
					as: 'user'
				});
      }
    }
  });
  return BoxOAuth;
};
