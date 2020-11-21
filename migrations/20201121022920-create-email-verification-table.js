'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_email_verifications', { 
      id : {
        type : Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id : {
        type : Sequelize.INTEGER,
        references : {
          model : 'users',
          key : 'id',
          onDelete : 'CASCADE'
        }
      },
      token : {
        type : Sequelize.STRING,
        allowNull : false
      },
      expires_at : {
        type : Sequelize.DATE,
        allowNull : false
      },
      createdAt: Sequelize.DATE
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_email_verifications')
  }
};
