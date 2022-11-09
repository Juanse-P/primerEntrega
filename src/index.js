import Server from './server/server.js';

const PORT = 8080;

Server.listen(PORT, () => {
    console.log(`el server esta encendido y funcionando en el puerto ${PORT}`);
});

