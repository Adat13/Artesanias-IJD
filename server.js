const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const winston = require('winston');
const multer = require('multer'); // Importar multer

// Configuración de almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif'
};

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

const hostname = '127.0.0.1';
const port = 3000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tienda_online"
});

db.connect(err => {
    if (err) throw err;
    logger.info('Conexión a la base de datos establecida.');
});

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    logger.info(`Request for ${pathname}`);

    if (pathname === '/upload') {
        fs.readFile(path.join(__dirname, 'upload.html'), (err, data) => {
            if (err) {
                logger.error('Error reading upload.html:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 - Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (pathname === '/display') {
        fs.readFile(path.join(__dirname, 'display.html'), (err, data) => {
            if (err) {
                logger.error('Error reading display.html:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 - Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (pathname === '/get_products') {
        db.query('SELECT id, name, price FROM productos', (err, results) => {
            if (err) {
                logger.error('Error querying database:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
    } else if (pathname.startsWith('/get_image/')) {
        const productId = pathname.split('/').pop();
        db.query('SELECT image FROM productos WHERE id = ?', [productId], (err, results) => {
            if (err) {
                logger.error('Error querying database:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }
            if (results.length === 0) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 - Not Found');
                return;
            }
            const image = results[0].image;
            res.writeHead(200, { 'Content-Type': 'image/jpeg' }); // Ajusta el tipo MIME según el tipo de imagen
            res.end(image); // Enviar la imagen como respuesta
        });
    } else if (pathname.startsWith('/css/') || pathname.startsWith('/js/')) {
        const filePath = path.join(__dirname, pathname);
        const extname = path.extname(filePath);
        const contentType = mimeTypes[extname] || 'application/octet-stream';
        fs.readFile(filePath, (err, data) => {
            if (err) {
                logger.error('Error reading file:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 - Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
    } else if (pathname === '/add_product' && req.method === 'POST') {
        upload.single('image')(req, res, (err) => {
            if (err) {
                logger.error('Error uploading file:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 - Internal Server Error');
                return;
            }

            const { name, price } = req.body;
            const image = req.file ? req.file.buffer : null; // Obtiene los datos binarios de la imagen

            const sql = 'INSERT INTO productos (name, price, image) VALUES (?, ?, ?)';
            db.query(sql, [name, price, image], (err, results) => {
                if (err) {
                    logger.error('Error inserting product:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: 'Producto agregado con éxito' }));
                }
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        fs.readFile(path.join(__dirname, '404.html'), (err, data) => {
            if (err) {
                res.end('404 - Not Found');
            } else {
                res.end(data);
            }
        });
    }
});

server.listen(port, hostname, () => {
    logger.info(`Servidor corriendo en http://${hostname}:${port}/`);
});
