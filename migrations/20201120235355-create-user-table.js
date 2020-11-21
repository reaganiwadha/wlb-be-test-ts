'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', { 
      id : {
        type : Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      username : {
        type : Sequelize.STRING,
        allowNull : false,
        unique : true
      },
      email : {
        type : Sequelize.STRING,
        allowNull : false,
        unique : true
      },
      password : {
        type : Sequelize.STRING,
        allowNull : false
      },
      is_verified : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : false
      },
      createdAt: Sequelize.DATE
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
};
