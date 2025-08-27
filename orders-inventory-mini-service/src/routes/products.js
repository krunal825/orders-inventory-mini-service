import { Router } from 'express';
import { body, query } from 'express-validator';
import * as controller from '../controllers/productController.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.post('/',
  body('sku').isString().trim().notEmpty(),
  body('name').isString().trim().notEmpty(),
  body('price_cents').isInt({ gt: 0 }),
  body('stock').isInt({ min: 0 }),
  validate,
  controller.createProduct
);

router.get('/',
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('min_price').optional().isInt({ min: 0 }),
  query('max_price').optional().isInt({ min: 0 }),
  query('in_stock').optional().isBoolean().toBoolean(),
  validate,
  controller.listProducts
);

export default router;
