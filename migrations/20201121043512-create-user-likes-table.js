'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_post_likes', { 
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
        },
        allowNull : false
      },
      user_post_id : {
        type : Sequelize.INTEGER,
        references : {
          model : 'user_posts',
          key : 'id',
          onDelete : 'CASCADE'
        },
        allowNull : false
      },
      content : {
        type : Sequelize.STRING,
        allowNull : false
      },
      createdAt: Sequelize.DATE
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_post_likes');
  }
};
