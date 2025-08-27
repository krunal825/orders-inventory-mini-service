import { models } from '../db/index.js';
import { cacheClient, cacheKeyForProducts, TTL_SECONDS, bustProductsCache } from '../cache/redisClient.js';

// Create Product
export async function createProduct(req, res, next) {
  try {
    const { sku, name, price_cents, stock } = req.body;
    const product = await models.Product.create({ sku, name, price_cents, stock });
    await bustProductsCache();
    return res.status(201).json({ id: product.id, sku, name, price_cents, stock, created_at: product.created_at });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return next({ status: 400, code: 'DUPLICATE', message: 'SKU already exists' });
    }
    return next(err);
  }
}


// get all products with pagination
export async function listProducts(req, res, next) {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const offset = (page - 1) * limit;

    const minPrice = req.query.min_price ? parseInt(req.query.min_price, 10) : undefined;
    const maxPrice = req.query.max_price ? parseInt(req.query.max_price, 10) : undefined;
    const inStock = typeof req.query.in_stock === 'boolean' ? req.query.in_stock : undefined;

    const key = cacheKeyForProducts({ page, limit, minPrice, maxPrice, inStock });
    const cached = await cacheClient.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const where = {};
    if (minPrice !== undefined) where.price_cents = { ...(where.price_cents || {}), ['gte']: minPrice };
    if (maxPrice !== undefined) where.price_cents = { ...(where.price_cents || {}), ['lte']: maxPrice };
    if (inStock !== undefined) where.stock = inStock ? { ['gt']: 0 } : 0;

    // Sequelize operators via plain object keys
    const { Op } = (await import('sequelize')).default;
    const whereSequelize = {};
    if (where.price_cents) {
      whereSequelize.price_cents = {};
      if (where.price_cents.gte !== undefined) whereSequelize.price_cents[Op.gte] = where.price_cents.gte;
      if (where.price_cents.lte !== undefined) whereSequelize.price_cents[Op.lte] = where.price_cents.lte;
    }
    if (where.stock !== undefined) {
      if (typeof where.stock === 'object') {
        whereSequelize.stock = { [Op.gt]: 0 };
      } else {
        whereSequelize.stock = 0;
      }
    }

    const { rows, count } = await models.Product.findAndCountAll({
      where: whereSequelize,
      limit,
      offset,
      order: [['id', 'ASC']]
    });

    const payload = {
      page, limit, total: count,
      data: rows.map(p => ({
        id: p.id, sku: p.sku, name: p.name, price_cents: p.price_cents, stock: p.stock,
        created_at: p.created_at, updated_at: p.updated_at
      }))
    };

    await cacheClient.set(key, JSON.stringify(payload), 'EX', TTL_SECONDS);
    return res.json(payload);
  } catch (err) {
    return next(err);
  }
}
