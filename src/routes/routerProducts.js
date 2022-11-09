import express from "express";
const router = express.Router();
import Product from "../controllers/product.js";
/* ---------- */

const productsFileName = 'products.json';
const productObj = new Product(productsFileName);
//Verificacion de si es admin o no
let isAdmin = true;

router.get('/', async (req, res) => {
    try {
        const product = await productObj.getAll();
        res.status(201).json({
            msg: product
        })
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            meg: 'Error al obtener los productos'
        })
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productObj.getById(id);
        return res.status(201).json({
            msg: product
        });
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            msg: 'Error al traer el producto por el id'
        });
    }
});

router.post('/', async (req, res) => {
    try {
        if (!isAdmin) {
            return res.status(403).json({
                error: '-1',
                descripcion: 'No tiene los permisos suficientes para la ruta "/api/productos" con el metodo post'
            })
        }
        const body = req.body;
        await productObj.saveProduct(body);
        return res.status(201).json({
            msg: 'se añadio el producto correctamente'
        })
    } catch (error) {
        return res.status(404).json({
            error: error
        })
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!isAdmin) {
            return res.status(403).json({
                error: '-1',
                descripcion: 'No tiene los permisos suficientes para la ruta "/api/productos/:id" con el metodo put'
            })
        }
        const id = req.params.id;
        const body = req.body;

        await productObj.updateProduct(id, body);
        return res.status(200).json({
            msg: 'Se actualizo el producto'
        })
    } catch (error) {
        return res.status(404).json({
            error: error
        })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        if (!isAdmin) {
            return res.status(403).json({
                error: '-1',
                descripcion: 'No tiene los permisos suficientes para la ruta "/api/productos" con el metodo delete'
            })
        }
        const id = req.params.id;
        await productObj.deleteById(id);
        return res.status(200).json({
            msg: 'producto eliminado'
        })
    } catch (error) {
        return res.status(404).json({
            error: error
        })
    }
})

export default router;