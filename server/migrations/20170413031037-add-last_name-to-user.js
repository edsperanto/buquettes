'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
		queryInterface.addColumn(
			'Users',
			'last_name',
			{
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					isAlpha: true
				}
			}
		);
  },

  down: function (queryInterface, Sequelize) {
		queryInterface.removeColumn('Users', 'last_name');
  }
};
