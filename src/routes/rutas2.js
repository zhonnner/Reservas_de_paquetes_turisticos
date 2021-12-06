const express = require('express');
const router = express.Router();
const conn = require('../database');

router.get('/', (req, res)=>{
  req.logout();
  res.render('backend/login.ejs');
});

/* MOSTRAR TABLA PERSONAS */
router.get('/2', isAuthenticated,function(req, res, next) {
  conn.query('select * from compra', (err, result) => {
    if(err) throw err;
    conn.query('select id_paquete, count(Id_compra) as vendido from paquete_compra group by id_paquete order by vendido desc;', (err2, result2) => {
      if(err2) throw err2;
      res.render('backend/backend.ejs',{ compra: result, paquete: result2 });
    });
  });
});

router.get('/busquedas', isAuthenticated,(req, res)=>{
  res.render('backend/busquedas.ejs');
});

router.get('/ingresar', isAuthenticated, (req, res) => {
  conn.query('select * from paquete', (err, result) => {
    if(err) throw err;
    res.render('backend/ingresar.ejs',{ paquete: result });
  });
});

router.get('/ingresar1', isAuthenticated, (req, res) => {
  conn.query('select * from viaje', (err, result) => {
    if(err) throw err; 
    res.render('backend/ingresar1.ejs',{ viaje: result });
  });
});

router.get('/ingresar2', isAuthenticated, (req, res) => {
  conn.query('select * from estadia', (err, result) => {
    if(err) throw err;
    conn.query('select Id_paquete from paquete', (err2, result2)=>{
      if(err2) throw err2;
      res.render('backend/ingresar2.ejs',{ estadia: result, paquete: result2 });
    })
  });
});
/* Añadir fila a la tabla persona */
router.post('/add',(req, res) => {
  const {Id_paquete, Nombre_paquete, Pais_destino, Tiempo_estadia_dias, Tiempo_estadia_noches, Fecha_llegada, Fecha_salida} = req.body;
  conn.query('INSERT into paquete SET ? ',{
      Id_paquete: Id_paquete,
      Nombre_paquete: Nombre_paquete,
      Pais_destino: Pais_destino,
      Tiempo_estadia_dias: Tiempo_estadia_dias,
      Tiempo_estadia_noches: Tiempo_estadia_noches,
      Fecha_llegada: Fecha_llegada,
      Fecha_salida: Fecha_salida
  }, (err, result) => {
      if(err) throw err;
      res.redirect('/ingresar');
  });
});

router.post('/add1',(req, res) => {
  const {Id_viaje, Fecha_viaje, Hora_viaje, Origen, Destino, Capacidad_viaje} = req.body;
  conn.query('INSERT into viaje SET ? ',{
      Id_viaje: Id_viaje,
      Fecha_viaje: Fecha_viaje,
      Hora_viaje: Hora_viaje,
      Origen: Origen,
      Destino: Destino,
      Capacidad_viaje: Capacidad_viaje
  }, (err, result) => {
      if(err) throw err
      res.redirect('/ingresar1');
  });
});

router.post('/add2',(req, res) => {
  const {Id_estadia, Id_paquete, Direccion_estadia, Telefono_estadia, Capacidad_estadia, Nombre_estadia} = req.body;
  conn.query('INSERT into estadia SET ? ',{
      Id_estadia: Id_estadia,
      Direccion_estadia: Direccion_estadia,
      Telefono_estadia: Telefono_estadia,
      Capacidad_estadia: Capacidad_estadia,
      Nombre_estadia: Nombre_estadia
  }, (err, result) => {
    if(err) throw err;
    conn.query('insert into paquete_estadia set ?', {
      Id_estadia: Id_estadia,
      Id_paquete: Id_paquete
    }, (err2, result2)=>{
      if(err2) throw err2;
      res.redirect('/ingresar2');  
    });
  });
});

/* Mostrar solamente una persona */
router.get('/ver/:id', (req, res) => {
  const { id } = req.params;  
  conn.query('SELECT * FROM cliente where rut = ?',[id], (err, result) => {
    if(err) throw err;
    res.render('backend/buscar.ejs',{ data: result[0] });
  });
});

//buscar
router.post('/buscar', (req, res) => {
    const {rut} = req.body;
    conn.query('SELECT * FROM cliente where rut = ?',[rut], (err, result) => {
        if(err) throw err;
        res.render('backend/buscar.ejs',{ data: result });
    });
  });

router.post('/buscar1', (req, res) =>{
  const {Id_compra} = req.body;  
  conn.query('select * from compra natural join compra_viaje natural join viaje where id_compra = ?', [Id_compra], (err, result) => {
    if(err) throw err;
    conn.query('select * from paquete_compra where id_compra = ?', [Id_compra], (err2, result2) => {
      if(err2) throw err2;
      res.render('backend/buscar1.ejs',{ compra: result, paquete: result2 });
    });
  });
});

router.post('/buscar2', (req, res) =>{
  const {Id_paquete} = req.body;  
  conn.query('select * from paquete_estadia natural join estadia where id_paquete = ?', [Id_paquete], (err, result) => {
    if(err) throw err;
    conn.query('select * from paquete where id_paquete = ?', [Id_paquete], (err2, result2) => {
      if(err2) throw err2;
      res.render('backend/buscar2.ejs',{ estadia: result, paquete: result2 });
    });
  });
});

router.post('/buscar3', (req, res) => {
  const {Id_viaje} = req.body;
  conn.query('SELECT * FROM viaje where Id_viaje = ?',[Id_viaje], (err, result) => {
      if(err) throw err;
      res.render('backend/buscar3.ejs',{
        data: result
      });
  });
});

function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}


module.exports = router;
