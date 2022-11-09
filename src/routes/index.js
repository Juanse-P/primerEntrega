import { Router } from "express";
import prouctsRouter from './routerProducts.js';
import cartRouter from './routerCart.js';

const router = Router();

router.use('/productos', prouctsRouter);
router.use('/carrito', cartRouter);

export default router;