'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
		queryInterface.addColumn(
			'Users',
			'email',
			{
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					isEmail: true
				}
			}
		);
  },

  down: function (queryInterface, Sequelize) {
		queryInterface.removeColumn('Users', 'email');
  }
};
