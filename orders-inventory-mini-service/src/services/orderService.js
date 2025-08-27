import { sequelize, models } from '../db/index.js';

export async function placeOrder({ user_id, items }) {
  return sequelize.transaction(async (t) => {
    // Verify user exists (simple existence check)
    const user = await models.User.findByPk(user_id, { transaction: t });
    if (!user) throw { status: 400, code: 'USER_NOT_FOUND', message: 'User does not exist' };

    // Lock all involved products for update
    const productIds = [...new Set(items.map(i => i.product_id))];
    const products = await models.Product.findAll({
      where: { id: productIds },
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    if (products.length !== productIds.length) {
      throw { status: 400, code: 'PRODUCT_NOT_FOUND', message: 'One or more products do not exist' };
    }

    // Check stock and compute totals
    const byId = Object.fromEntries(products.map(p => [p.id, p]));
    let total = 0;
    for (const it of items) {
      const p = byId[it.product_id];
      if (p.stock < it.qty) {
        throw { status: 400, code: 'INSUFFICIENT_STOCK', message: `Product ${p.id} has only ${p.stock} in stock` };
      }
      total += p.price_cents * it.qty;
    }

    // Decrement stock
    for (const it of items) {
      const p = byId[it.product_id];
      p.stock = p.stock - it.qty;
      await p.save({ transaction: t });
    }

    // Create order and items
    const order = await models.Order.create({ user_id, total_cents: total, status: 'PLACED' }, { transaction: t });
    const orderItemsData = items.map(it => ({
      order_id: order.id,
      product_id: it.product_id,
      qty: it.qty,
      price_cents_at_purchase: byId[it.product_id].price_cents
    }));
    await models.OrderItem.bulkCreate(orderItemsData, { transaction: t });

    return order;
  });
}

export async function restoreStockForOrder(orderId) {
  return sequelize.transaction(async (t) => {
    const order = await models.Order.findByPk(orderId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!order) throw { status: 404, code: 'NOT_FOUND', message: 'Order not found' };
    if (order.status !== 'PLACED') {
      throw { status: 400, code: 'INVALID_STATE', message: 'Only PLACED orders can be cancelled' };
    }

    const items = await models.OrderItem.findAll({ where: { order_id: orderId }, transaction: t });
    const productIds = items.map(i => i.product_id);
    const products = await models.Product.findAll({ where: { id: productIds }, transaction: t, lock: t.LOCK.UPDATE });
    const byId = Object.fromEntries(products.map(p => [p.id, p]));
    for (const it of items) {
      const p = byId[it.product_id];
      p.stock = p.stock + it.qty;
      await p.save({ transaction: t });
    }

    order.status = 'CANCELLED';
    await order.save({ transaction: t });

    return order;
  });
}
