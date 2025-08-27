'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("order_items", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { 
      type: Sequelize.INTEGER, 
      allowNull: false, 
      references: { model: "orders", key: "id" }, 
      onDelete: "CASCADE" 
    },
    product_id: { 
      type: Sequelize.INTEGER, 
      allowNull: false, 
      references: { model: "products", key: "id" } 
    },
    qty: { type: Sequelize.INTEGER, allowNull: false },
    price_cents_at_purchase: { type: Sequelize.INTEGER, allowNull: false }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("order_items");
}
