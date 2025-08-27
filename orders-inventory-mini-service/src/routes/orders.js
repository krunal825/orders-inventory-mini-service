import { Router } from 'express';
import { body, param } from 'express-validator';
import * as controller from '../controllers/orderController.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.post('/',
  body('user_id').isInt({ min: 1 }),
  body('items').isArray({ min: 1 }),
  body('items.*.product_id').isInt({ min: 1 }),
  body('items.*.qty').isInt({ min: 1 }),
  validate,
  controller.createOrder
);

router.get('/:id',
  param('id').isInt({ min: 1 }),
  validate,
  controller.getOrderById
);

router.patch('/:id/cancel',
  param('id').isInt({ min: 1 }),
  validate,
  controller.cancelOrder
);

export default router;
