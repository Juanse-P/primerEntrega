import fs from 'fs';
import moment from 'moment';

class Cart {
    constructor(fileName) {
        this.fileName = fileName;
    }

    async validateExistFile() {
        try {
            await fs.promises.stat(this.fileName);
            return true;
        } catch (error) {
            console.log('el archivo no exite, se esta creando!');
            await fs.promises.writeFile(this.fileName, JSON.stringify([]));
            return false;
        }
    }

    async loadEmptyFile() {
        try {
            const DefaultCart = [
                {
                    id: 1,
                    timestamp: '08-11-22 19:14:23',
                    products: [
                        {
                            id: 1,
                            timestamp: '07-11-22 21:05:24',
                            title: 'carro',
                            description: 'carro',
                            code: 'a',
                            photo: 'https://acroadtrip.blob.core.windows.net/catalogo-imagenes/s/RT_V_a230ca5eee0c4a888e70d572d8065b7a.jpg',
                            value: 1985632,
                            stock: 4,
                        },
                        {
                            id: 2,
                            timestamp: '07-11-22 21:10:36',
                            title: 'balon',
                            description: 'balon',
                            code: 'c',
                            photo: 'https://www.diffusionsport.com/wp-content/uploads/2017/08/adidas-balones-futbol-champions-league.jpg',
                            value: 36221,
                            stock: 56,
                        },
                    ]
                }
            ]
            const data = JSON.stringify(DefaultCart, null, '\t');
            await fs.promises.writeFile(this.fileName, data);
        } catch (error) {
            throw new Error('No se cargo el carrito por defecto :(')
        }
    }

    async getAllProductsCart() {
        try {
            let fileExist = await this.validateExistFile();
            if (!fileExist) {
                await this.loadEmptyFile();
            }
            const data = await fs.promises.readFile(this.fileName, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error('Error al obtener los productos del carrito', error);
        }
    }

    async saveCarts(carts) {
        try {
            const data = JSON.stringify(carts, null, '\t');
            await fs.promises.writeFile(this.fileName, data);
        } catch (error) {
            throw new Error('No se pudieron guardar los carritos', error);
        }
    }

    async getCartById(id) {
        try {
            const productsCart = await this.getAllProductsCart();
            const index = productsCart.findIndex((cart) => cart.id == id);
            if (index < 0) {
                throw 'El producto con el id ingresado no exite';
            }
            return productsCart[index];
        } catch (error) {
            throw error;
        }
    }

    async createCart() {
        try {
            const carts = await this.getAllProductsCart();
            let id = 1;
            if (carts.length) {
                id = carts[carts.length - 1].id + 1;
            }

            const newCart = {
                id: id,
                timestamp: moment().format('DD-MM-YYYY HH:MM:SS'),
                products: [],
            };
            carts.push(newCart);
            await this.saveCarts(carts);
        } catch (error) {
            throw new Error('No se puso crear el carrito', error);
        }
    }

    async deleteAll() {
        try {
            await this.saveProducts([]);
        } catch (error) {
            throw new Error('Error al eliminar todos los productos', error);
        }
    }

    async deleteById(id) {
        try {
            const carts = await this.getAllProductsCart();

            const index = carts.findIndex((cart) => cart.id == id);

            if (index < 0) {
                throw 'El carrito que desea eliminar no existe';
            }

            carts.splice(index, 1);

            await this.saveCarts(carts);
        } catch (error) {
            throw error;
        }
    }

    async deleteProductInCartByID(cartId, productId) {
        try {
            const carts = await this.getAllProductsCart();
            const cartIndex = carts.findIndex((cart) => cart.id == cartId);

            const productIndex = carts[cartIndex].products.findIndex((prod) => prod.id == productId);

            if (productIndex < 0) {
                throw 'El producto no existe';
            }
            carts[cartIndex].products.splice(productIndex, 1);

            await this.saveCarts(carts);
        } catch (error) {
            throw error;
        }
    }

    async addNewProductToCart(cartId, product) {
        try {
            const carts = await this.getAllProductsCart();
            const index = carts.findIndex((cart) => cart.id == cartId);
            carts[index].products.push(product);
            await this.saveCarts(carts);
        } catch (error) {
            throw new Error('No se logro agregar el producto al carrito', error);
        }
    }
}

export default Cart;