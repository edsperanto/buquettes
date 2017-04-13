'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
		queryInterface.addColumn(
			'Users',
			'active',
			{
				type: Sequelize.BOOLEAN,
				allowNull: false,
				validate: {
					isBoolean: function(value) {
						if(typeof value !== 'boolean') {
							throw new Error('"Active" must be a boolean');
						}
					}
				}
			}
		)
  },

  down: function (queryInterface, Sequelize) {
		queryInterface.removeColumn('Users', 'active');
  }
};
