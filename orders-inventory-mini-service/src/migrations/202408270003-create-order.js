'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("orders", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { 
      type: Sequelize.INTEGER, 
      allowNull: false, 
      references: { model: "users", key: "id" }, 
      onDelete: "CASCADE" 
    },
    total_cents: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    status: { type: Sequelize.ENUM("PLACED","PAID","CANCELLED"), allowNull: false, defaultValue: "PLACED" },
    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("orders");
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_orders_status";');
}
