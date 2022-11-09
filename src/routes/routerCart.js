import express from "express";
const router = express.Router();
import Cart from "../controllers/cart.js";
import Product from "../controllers/product.js";
/* ------ */

const cartFileName = 'cart.json';
const cartObj = new Cart(cartFileName);
const productsFileName = 'products.json';
const productObj = new Product(productsFileName);

router.get('/:id/productos', async (req, res) => {
    try {
        const id = req.params.id;
        const productsInCart = await cartObj.getCartById(id);
        return res.status(200).json({ msg: productsInCart });
    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: 'No se pudo obtener el carrito con el id soleccionado' });
    }
});

router.post('/', async (req,res) => {
    try {
        await cartObj.createCart();
        const carts = await cartObj.getAllProductsCart();
        let idAddedCart = carts[carts.length - 1].id;
        return res.status(201).json({
            msg: `carrito con el id ${idAddedCart} creado `
        })
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            msg: 'Ocurrio un error al crear el carrito'
        })
    }
});

router.post('/:id/productos', async (req,res) => {
    try {
        const cartId = req.params.id;
        const productId = req.body.id;
        const cartselected = await cartObj.getCartById(cartId);
        const producToAdd = await productObj.getById(productId);
        await cartObj.addNewProductToCart(cartselected.id, producToAdd);
        return res.status(201).json({
            msg: 'Se agrego el producto al carrito'
        })
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            msg: 'No se pudo añadir el producto al carrito solicitado'
        })
    }
});

router.delete('/:id', async (req,res) => {
    try {
        const id = req.params.id;
        await cartObj.deleteById(id);
        return res.status(201).json({
            msg: 'Se elimino el carrito'
        });
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            msg: 'Error al eliminar el carrito, ingrese un id valido'
        })
    }
});

router.delete('/:id/productos/:id_prod', async (req,res) => {
    try {
        const cartId = req.params.id;
        const productId = req.params.id_prod;
        await cartObj.deleteProductInCartByID(cartId, productId);
        return res.status(200).json({
            msg: 'Producto eliminado del carrito correctamente'
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'No se pudo elminar el producto del carrito seleccionado'
        })
    }
});

export default router;