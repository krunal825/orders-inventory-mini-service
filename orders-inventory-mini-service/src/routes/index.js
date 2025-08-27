import { Router } from 'express';
import productsRoute from './products.js';
import ordersRoute from './orders.js';

const router = Router();

router.use('/products', productsRoute);
router.use('/orders', ordersRoute);

export default router;
