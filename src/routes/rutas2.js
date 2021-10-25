const express = require('express');
const router = express.Router();
const conn = require('../database');

//conn.query("select * from cliente", (err,res,campos) =>{
  //  console.log(res);
//});
/* MOSTRAR TABLA PERSONAS */
router.get('/', (req, res) => {
  conn.query('select * from cliente', (err, result) => {
      if(!err) {
        res.render('backend/backend.ejs',{
          cliente: result
        });
      } else {
        console.log(err);
      }
  });
});

/* ELIMINAR FILA DE TABLA PERSONAS */
router.get('/delete/:id', (req, res) => {
  const { id } = req.params;
  conn.query('DELETE FROM cliente WHERE rut = ?', [id]);
  res.redirect('/');
});

/* Añadir fila a la tabla persona */
router.post('/add',(req, res) => {
  const {rut, nombre_cliente, correo,direccion_cliente} = req.body;
  conn.query('INSERT into cliente SET ? ',{
      rut: rut,
      nombre_cliente: nombre_cliente,
      correo: correo,
      direccion_cliente: direccion_cliente
  }, (err, result) => {
      if(!err) {
          res.redirect('/');
      } else {
          console.log(err);
      }
  });
});

/* Mostrar solamente una persona */
router.get('/ver/:id', (req, res) => {
  const { id } = req.params;  
  conn.query('SELECT * FROM cliente where rut = ?',[id], (err, result) => {
      if(!err) {
        res.render('backend/buscar.ejs',{
          data: result[0]
        });
      } else {
        console.log(err);
      }
  });
});

//buscar
router.get('/buscar/:id', (req, res) => {
    const { id } = req.params;  
    conn.query('SELECT * FROM cliente where rut = ?',[id], (err, result) => {
        if(!err) {
          res.render('backend/buscar.ejs',{
            data: result[0]
          });
        } else {
          console.log(err);
        }
    });
  });
    
module.exports = router;
