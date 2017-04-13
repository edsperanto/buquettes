'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
		queryInterface.addColumn(
			'Users',
			'first_name',
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
		queryInterface.removeColumn('Users', 'first_name');
  }
};
