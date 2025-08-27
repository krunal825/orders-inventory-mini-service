'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("products", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    sku: { type: Sequelize.STRING, allowNull: false, unique: true },
    name: { type: Sequelize.STRING, allowNull: false },
    price_cents: { type: Sequelize.INTEGER, allowNull: false },
    stock: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("products");
}
