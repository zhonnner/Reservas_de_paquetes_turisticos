const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');

// Intializations
const app = express();
const conn = require('./database');

// Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

//  Middlewares
app.use('/css', express.static(path.join(__dirname, 'view/css')));
app.use('/js', express.static(path.join(__dirname, 'view/js')));
app.use(express.json()); //Transfomar a formato JSON
app.use(bodyParser.urlencoded({extended: true})); // analiza el texto como datos codificados de URL y expone el objeto resultante (FORMULARIOS)

//  Rutas
app.use('/', require('./routes/rutas'));

//  Iniciando el servidor
app.listen(app.get('port'), () => {
  console.log('Servidor en puerto ',app.get('port'))
});