const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const cookieParser = require('cookie-parser');
const PassportLocal = require('passport-local').Strategy;
const session = require('express-session');
const passport = require('passport');
var bodyParser = require('body-parser');

// Intializations
const app = express();
mongoose.connect('mongodb://localhost/Reservas_de_paquetes_turisticos')
  .then(db => console.log("Conectado a MongoDB"))
  .catch(err => console.log(err));

// Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

//  Middlewares
app.use('/css', express.static(path.join(__dirname, 'view/css')));
app.use('/js', express.static(path.join(__dirname, 'view/js')));
app.use(express.json()); //Transfomar a formato JSON
app.use(bodyParser.urlencoded({extended: true})); // analiza el texto como datos codificados de URL y expone el objeto resultante (FORMULARIOS)
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser('secreto'));
app.use(session({
  secret: 'secreto',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(function(username, password, done){
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("Reservas_de_paquetes_turisticos");
        dbo.collection("Paquete").find().toArray(function(err, result) {
            if (err) throw err;
            var salir = 0;
            result.forEach(element => {
                element.Compra.forEach(element2 => {
                    if(element2.Cliente.Correo == username && element2.Cliente.Contraseña == password){
                        if(element2.Cliente.Admin == true){
                            salir = 1;
                            return done(null, { id: 1, name: "cody"});
                        }
                    }
                });
            });
            if(salir == 0) {done(null, false);}
        });
    });
}));
//obj a id serializacion
passport.serializeUser(function(user, done){
    done(null, user.id);
  });
  //id a obj deserializacion
  passport.deserializeUser(function(id, done){
    done(null, { id: 1, name: "cody"})
  });

//  Rutas
app.use('/', require('./routes/rutas3'));
app.get('/', (req, res)=>{
  res.render('backend/login.ejs');
  //mostrar formulario login
});
app.get('/2', (req, res, next)=>{
  if(req.isAuthenticated()) return next();
  res.redirect('/');
},(req, res)=>{
  res.redirect('/2')
});
app.post('/', passport.authenticate('local', {
  successRedirect: '/2',
  failureRedirect: '/'
}));
//  Iniciando el servidor
app.listen(app.get('port'), () => {
  console.log('Servidor en puerto ',app.get('port'))
});
