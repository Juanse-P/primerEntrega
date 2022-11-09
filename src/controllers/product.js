import fs, { readFile } from 'fs';
import moment from 'moment';

class Product {
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
            let productsDefault = [
                {
                    id: 1,
                    timestamp: '08-11-22 11:49:03',
                    title: 'celular',
                    description: 'celular',
                    code: 'a',
                    photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMIYOmS0jlH25OCe9ICj0q3hx5OOrihmY7IPHwSnQHnM-9OaG2qe-hq7PBe87vUzdvEME&usqp=CAU',
                    value: 23698745,
                    stock: 4,
                },
                {
                    id: 2,
                    timestamp: '08-11-22 11:53:32',
                    title: 'casa',
                    description: 'casa',
                    code: 'b',
                    photo: 'https://http2.mlstatic.com/D_NQ_NP_677956-MCO44617601660_012021-V.jpg',
                    value: 152000,
                    stock: 9,
                },
            ];
            const data = JSON.stringify(productsDefault, null, '\t');
            await fs.promises.writeFile(this.fileName, data);
        } catch (error) {
            throw new Error('No se pudieron cargar los productos por defecto', error);
        }
    }

    async getAll() {
        try {
            let fileExist = await this.validateExistFile();
            if (!fileExist) {
                await this.loadEmptyFile();
            }
            const data = await fs.promises.readFile(this.fileName, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error('No se pudieron obtener todos los productos', error);
        }
    }

    async updateProduct(id, body) {
        const products = await this.getAll();
        let editable = false;

        try {
            products.forEach((prod) => {
                if (prod.id == id) {
                    prod.timestamp = moment().format('DD-MM-YYYY HH:MM:SS');
                    prod.title = !body.title ? prod.title : body.title;
                    prod.description = !body.description ? prod.description : body.description;
                    prod.code = !body.code ? prod.code : body.code;
                    prod.photo = !body.photo ? prod.photo : body.photo;
                    prod.value = !body.value ? prod.value : body.value;
                    prod.stock = !body.stock ? prod.stock : body.stock;
                    editable = true;
                }
            });
            if (editable) {
                await this.saveProducts(products);
            } else {
                throw 'No existe un producto con este id';
            }
        } catch (error) {
            throw error;
        }
    }

    async saveProducts(products) {
        try {
            const data = JSON.stringify(products, null, '\t');
            await fs.promises.writeFile(this.fileName, data);
        } catch (error) {
            throw new Error('No se pudieron guardar los productos ', error);
        }
    }

    async getById(id) {
        try {
            const products = await this.getAll();
            const index = products.findIndex((prod) => prod.id == id);
            if (index < 0) {
                throw 'El producto con el id ingresado no existe';
            }
            return products[index];
        } catch (error) {
            throw error;
        }
    }

    async saveProduct(data) {
        if (
            !data.title ||
            !data.description ||
            !data.code ||
            !data.photo ||
            !data.value ||
            !data.stock ||
            typeof data.title !== "string" ||
            typeof data.description !== "string" ||
            typeof data.code !== "string" ||
            typeof data.photo !== "string" ||
            typeof data.value !== "number" ||
            typeof data.stock !== "number"
        )

            try {
                const products = await this.getAll();
                let id = 1;
                if (products.length) {
                    id = products[products.length - 1].id + 1;
                }

                const newProduct = {
                    id: id,
                    timestamp: moment().format('DD-MM-YYYY HH:MM:SS'),
                    title: data.title,
                    description: data.description,
                    code: data.code,
                    photo: data.photo,
                    value: data.value,
                    stock: data.stock,
                };

                products.push(newProduct);

                await this.saveProducts(products);
            } catch (error) {
                throw new Error(
                    'Problema al guardar el producto', error
                );
            }
    }


    async deleteById(id) {
        try {
            const products = await this.getAll();

            const index = products.findIndex((prod) => prod.id == id);

            if (index < 0) {
                throw 'El producto que desea eliminar no existe';
            }

            products.splice(index, 1);

            await this.saveProducts(products);
        } catch (error) {
            throw error;
        }
    }
}

export default Product;