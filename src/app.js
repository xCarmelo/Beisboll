import express from 'express';
import { PORT } from './config/config.js';
import { create } from 'express-handlebars';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import router from './router/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.js está dentro de src.
// node_modules está un nivel arriba.
const projectRoot = path.resolve(__dirname, '..');

const app = express();

app.set('port', PORT);

app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', create({
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    defaultLayout: 'main',
    extname: '.hbs'
}).engine);

app.set('view engine', '.hbs');

// Archivos propios: CSS, JavaScript e imágenes.
app.use(
    express.static(path.join(__dirname, 'public'))
);

// Bootstrap: CSS y JavaScript.
app.use(
    '/vendor/bootstrap',
    express.static(
        path.join(projectRoot, 'node_modules', 'bootstrap', 'dist')
    )
);

// Bootstrap Icons: CSS y fuentes.
app.use(
    '/vendor/bootstrap-icons',
    express.static(
        path.join(projectRoot, 'node_modules', 'bootstrap-icons')
    )
);

// Rutas de la aplicación.
app.use(router);

// Página no encontrada.
app.use((req, res) => {
    res.status(404).render('404');
});

export default app;