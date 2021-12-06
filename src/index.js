const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const PassportLocal = require('passport-local').Strategy;

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
  conn.query('select * from cliente where Correo = ? ', [username],  (err, rut1)=>{
    if(err){
      console.log(err);
    }else{
      salir = 0;
      rut1.forEach(element => {
        if(element.Correo == username && element.Contraseña == password){
          if(element.Admin == 1){
            salir = 1;
            return done(null, { id: 1, name: "cody"});
          }
        }   
      });
      if(salir == 0) done(null, false);  
    }
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
app.use('/', require('./routes/rutas'));
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
