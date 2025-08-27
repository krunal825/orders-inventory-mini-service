import { models } from '../db/index.js';
import { placeOrder, restoreStockForOrder } from '../services/orderService.js';

// Create Order
export async function createOrder(req, res, next) {
  try {
    const order = await placeOrder(req.body);

    const items = await models.OrderItem.findAll({ where: { order_id: order.id }, include: [{ model: models.Product }] });
    const user = await models.User.findByPk(order.user_id);

    return res.status(201).json({
      id: order.id,
      user: { id: user.id, email: user.email, name: user.name },
      status: order.status,
      total_cents: order.total_cents,
      items: items.map(i => ({
        product_id: i.product_id,
        qty: i.qty,
        price_cents_at_purchase: i.price_cents_at_purchase,
        product: { id: i.Product.id, sku: i.Product.sku, name: i.Product.name }
      })),
      created_at: order.created_at
    });
  } catch (err) {
    return next(err);
  }
}

// get order by id
export async function getOrderById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const order = await models.Order.findByPk(id, {
      include: [
        { model: models.OrderItem, include: [{ model: models.Product }] },
        { association: models.Order.associations.User, required: false }
      ]
    });
    if (!order) return next({ status: 404, code: 'NOT_FOUND', message: 'Order not found' });

    const user = await models.User.findByPk(order.user_id);
    return res.json({
      id: order.id,
      user: user ? { id: user.id, email: user.email, name: user.name } : null,
      status: order.status,
      total_cents: order.total_cents,
      items: order.OrderItems.map(i => ({
        product_id: i.product_id,
        qty: i.qty,
        price_cents_at_purchase: i.price_cents_at_purchase,
        product: { id: i.Product.id, sku: i.Product.sku, name: i.Product.name }
      })),
      created_at: order.created_at
    });
  } catch (err) {
    return next(err);
  }
}

// cancel order by id
export async function cancelOrder(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const order = await restoreStockForOrder(id);
    const items = await models.OrderItem.findAll({ where: { order_id: id }, include: [{ model: models.Product }] });
    const user = await models.User.findByPk(order.user_id);
    return res.json({
      id: order.id,
      user: { id: user.id, email: user.email, name: user.name },
      status: order.status,
      total_cents: order.total_cents,
      items: items.map(i => ({
        product_id: i.product_id,
        qty: i.qty,
        price_cents_at_purchase: i.price_cents_at_purchase,
        product: { id: i.Product.id, sku: i.Product.sku, name: i.Product.name }
      })),
      created_at: order.created_at
    });
  } catch (err) {
    return next(err);
  }
}
