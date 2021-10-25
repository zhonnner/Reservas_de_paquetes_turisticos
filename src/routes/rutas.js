const express = require('express');
const router = express.Router();
const conn = require('../database');


router.get('/', function(req, res) {
    res.render('test2.ejs');
  });
router.get('/home', (req, res) => {

    conn.query("select * from cliente", (err, result) => {
        if(!err) {
          res.render('home.ejs',{
            cliente: result
          });
        } else {
          console.log(err);
        }
    });
});


/* Mostrar solamente una persona */ 
router.get('/ver/:id', (req, res) => {
    const { id } = req.params;  
    conn.query('SELECT * FROM paquete where id_paquete = ?',[id], (err, result) => {
        if(!err) {
          res.render('cliente.ejs',{
            data: result[0]
          });
        } else {
          console.log(err);
        }
    });
  });
  
  /* ELIMINAR FILA DE TABLA PERSONAS */
  router.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    conn.query('DELETE FROM cliente WHERE Rut = ?', [id]);
    res.redirect('/');
  });

  /* Añadir fila a la tabla persona */
router.post('/add',(req, res) => {
    //console.log(req.body);
    const {Rut, Nombre_cliente, Correo, Direccion_cliente} = req.body;
    conn.query('INSERT into cliente SET ? ',{
        Rut: Rut,
        Nombre_cliente: Nombre_cliente,
        Correo: Correo,
        direccion_cliente: Direccion_cliente
    }, (err, result) => {
        if(!err) {
            res.redirect('/');
        } else {
            console.log(err);
        }
    });
  });
//π Rut, Nombre_cliente, Correo, Direccion_cliente (Cliente)
/*con.query("select * from cliente", (err,res,campos) =>{
    console.log(res);
});*/
//
/*con.query("UPDATE Compra set Estado = 1 WHERE Id_compra = 1;", (err,res,campos) =>{
    console.log(res);
});*/
/*con.query('UPDATE Paquete set Fecha_llegada = "2021-9-25" WHERE Id_paquete = 1;', (err,res,campos) =>{
    console.log(res);
});*/
/*con.query('UPDATE Paquete set Fecha_salida = "2021-9-30" WHERE Id_paquete = 1;', (err,res,campos) =>{
    console.log(res);
});*/
/*con.query("ALTER TABLE cliente MODIFY COLUMN Correo varchar(50);", (err,res,campos) =>{
    console.log(res);
});*/
/*con.query('DELETE FROM cliente where Rut = "19.533.610-5";', (err,res,campos) =>{
    console.log(res);
});*/
/*con.query('insert into viaje(Id_viaje, Fecha_viaje, Hora_viaje, Origen, Destino)VALUES	(10, 2021-09-01, "11:00", "Valpo", "Tokyo");', (err,res,campos) =>{
    console.log(res);
});*/
/*con.query('insert into cliente(Rut,Nombre_cliente,Correo,Direccion_cliente)VALUES	("11.111.119-9", "geraldine", "gera@gmail.com", "egaña 622"),("11.111.121-1", "arnold", "hi1@gmail.com", "oceano pacifico 1");', (err,res,campos) =>{
    console.log(res);
});*/
/*con.query('insert into estadia(Id_estadia, Direccion_estadia, Telefono_estadia, Capacidad_estadia, nombre_estadia)VALUES (10, "Calle 10 Berlin", "11111121", 30, "Hotel 10");', (err,res,campos) =>{
    console.log(res);
});*/
/*con.query('select * from Estadia natural join Paquete_Estadia ;', (err,res,campos) =>{
    console.log(res);
});*/
/*con.query('SELECT * from Viaje natural join Compra_viaje;', (err,res,campos) =>{
    console.log(res);
});*/
/*con.query('DELETE FROM estadia where nombre_estadia = "hotel 11";', (err,res,campos) =>{
    console.log(res);
});*/
/*con.query('drop table borrar;', (err,res,campos) =>{
    console.log(res);
});*/
// consultas nuevas abajo
//mostrar fecha y hora del viaje de un cliente x 
/*conn.query('select fecha_viaje, hora_viaje from viaje WHERE id_viaje IN ( SELECT id_viaje FROM compra NATURAL JOIN compra_viaje where rut = "11.111.111-1");', (err,res,campos) =>{
    console.log(res);
});*/
//pagos mayor a 100.000 de un cliente x
/*conn.query('select count(valor_total) from boleta natural join compra where rut = "11.111.111-1" and valor_total > 100000;', (err,res,campos) =>{
    console.log(res);
});*/
//numeros de clientes que han comprado cada paquete
/*conn.query('select id_paquete, count(rut) from compra natural join paquete group by id_paquete;',  (err,res,campos) =>{
    console.log(res);
});*/
//numero de clientes en cada viaje
/*conn.query('select id_viaje, count(rut) from compra natural join compra_viaje group by id_viaje;',  (err,res,campos) =>{
    console.log(res);
});*/
//numero de compras por banco
/*conn.query('select banco, count(id_compra) from tarjetacred natural join cliente natural join compra group by banco;',  (err,res,campos) =>{
    console.log(res);
});*/
//cantidad de clientes por destino
/*conn.query('select destino, count(rut) from compra natural join compra_viaje natural join viaje group by destino;',  (err,res,campos) =>{
    console.log(res);
});*/
// cantidad clientes que pagaron en credito o debito
/*conn.query('select metodo_pago, count(rut) as cliente from compra natural join boleta group by metodo_pago;',  (err,res,campos) =>{
    console.log(res);
});*/
//identificar estadia de una compra x
/*onn.query('select id_estadia from paquete_estadia WHERE id_paquete IN ( SELECT id_paquete FROM compra NATURAL JOIN paquete where id_compra = 1);',  (err,res,campos) =>{
    console.log(res);
});*/
//mostrar los datos de un cliente que va a argentina
/*conn.query('select * from cliente where rut in(select rut from compra natural join paquete where pais_destino = "argentina");',  (err,res,campos) =>{
    console.log(res);
});*/
//nombre de las estadias que reservaron un dia x
/*conn.query('select nombre_estadia from estadia natural join paquete_estadia where id_paquete = any(select id_paquete from compra natural join paquete where fecha_compra = "2021-09-18");',  (err,res,campos) =>{
    console.log(res);
});*/
// ALGEBRA RELACIONAL ABAJO
//π Nombre_estadia (σ Id_paquete = 1 (Estadia ⨝ Paquete_Estadia)), muestre el nombre de la estadia dentro del primer paquete
/*conn.query('select nombre_estadia from estadia natural join paquete_estadia where id_paquete = 1;',  (err,res,campos) =>{
    console.log(res);
});*/2
//π Rut (σ Id_paquete = 3 ∨ Id_paquete = 1 (Cliente ⨝ Compra)), muestre el rut de aquellos que compraron el paquete 3 o 1
/*conn.query('select Rut from Cliente natural join Compra where Id_paquete = 3 or Id_paquete = 1;',  (err,res,campos) =>{
    console.log(res);
});*/3
//π Numero_tarjeta (σ Nombre_cliente = 'melanie perez' (TarjetaCred ⨝ Cliente)), muestre las tarjetas del cliente de nombre "melanie perez"
/*conn.query('select Numero_tarjeta from TarjetaCred natural join Cliente where Nombre_cliente = "melanie perez";',  (err,res,campos) =>{
    console.log(res);
});*/4
//π Valor_total (σ Rut = '11.111.111-1' (Boleta ⨝ Compra)), valor de las compras del cliente = "11.111.111-1"
/*conn.query('select Valor_total from Boleta natural join Compra where Rut = "11.111.111-1";',  (err,res,campos) =>{
    console.log(res);
});*/5
//π Fecha_viaje, Hora_viaje, Destino (σ Rut = '11.111.111-1' (Viaje ⨝ Compra_Viaje ⨝ Compra)), mostrar la fecha y hora de los viajes comprados por un rut especifico
/*conn.query('select Fecha_viaje, Hora_viaje, Destino from Viaje natural join Compra_Viaje natural join Compra where Rut = "11.111.111-1";',  (err,res,campos) =>{
    console.log(res);
});*/6
//π Telefono_estadia (σ Id_compra = 1 (Estadia ⨝ Paquete_Estadia ⨝ Paquete ⨝ Compra)), mostrar los o el telefono de la o las estadias que reservaron en la compra id 1
/*conn.query('select Telefono_estadia from Estadia natural join Paquete_estadia natural join Paquete natural join Compra where Id_compra = 1;',  (err,res,campos) =>{
    console.log(res);
});*/7
//π Id_compra, Rut (σ Banco = 'Banco Estado' (TarjetaCred ⨝ Cliente ⨝ Compra)), mostar la compra y cliente que han comprado con una tarjeta del banco estado
/*conn.query('select Id_compra, Rut from TarjetaCred natural join Cliente natural join Compra where Banco = "Banco Estado";',  (err,res,campos) =>{
    console.log(res);
});*/8
//π Rut (σ Valor_total > 90000 (Boleta ⨝ Compra)), mostrar clientes con pagos mayores a 90.000 pesos
/*conn.query('select Rut from Compra natural join Boleta where Valor_total > 90000;',  (err,res,campos) =>{
    console.log(res);
});*/9
//π Numero_tarjeta (σ Id_compra = 1 (TarjetaCred ⨝ Cliente ⨝ Compra)), mostrar el numero de tarjeta ocupado en la compra id 1
/*conn.query('select Numero_tarjeta from TarjetaCred natural join Cliente natural join Compra where Id_compra = 1;',  (err,res,campos) =>{
    console.log(res);
});*/10
//π Direccion_estadia (σ Destino = 'Buenos Aires' ( Viaje ⨝ Compra_Viaje ⨝ Compra ⨝ Paquete ⨝ Paquete_Estadia ⨝ Estadia)), mostrar las posibles direcciones de estadia que pueden tener los pasajeros que se dirigen a Buenos Aires de acuerdo a los paquetes comprados
/*conn.query('select Direccion_estadia from Viaje natural join Compra_Viaje natural join Compra natural join Paquete natural join Paquete_Estadia natural join Estadia where Destino = "Buenos Aires";',  (err,res,campos) =>{
    console.log(res);
});*/
module.exports = router;