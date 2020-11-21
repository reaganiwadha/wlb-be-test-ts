'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_posts', { 
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
        },
        onDelete : 'CASCADE',
        allowNull : false
      },
      title : {
        type : Sequelize.STRING,
        allowNull : false
      },
      content : {
        type : Sequelize.STRING,
        allowNull : false
      },
      is_moderation_enabled : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : false
      },
      created_at: Sequelize.DATE
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_posts')
  }
};
