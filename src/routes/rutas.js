const express = require('express');
const router = express.Router();
const conn = require('../database');
let date_ob = new Date();

let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
console.log(year + "-" + month + "-" + date);
console.log(hours + ":" + minutes);


router.get('/', function(req, res) {
    res.render('home.ejs');
});

router.post('/2', (req, res) => {
    const { Id_viaje, Id_paquete} = req.body;
    conn.query('SELECT * FROM compra', (err, result) => {
        if(err) throw err;
        conn.query('SELECT Id_estadia FROM paquete_estadia where Id_paquete = ?', [Id_paquete], (err2, result2) => {
            if(err2) throw err2;
            res.render('pago.ejs',{ Id_viaje, result, result2, Id_paquete });
        });
    });
});

router.get('/3', (req, res) => {
    res.render('comprado.ejs')
});

/* Mostrar solamente una persona */ 
router.get('/ver/:id', (req, res) => {
    const { id } = req.params;  
    conn.query('SELECT * FROM paquete where id_paquete = ?',[id], (err, result) => {
        if(err) throw err;
        res.render('paquete.ejs',{ data: result[0] });
    });
  });

router.get('/ver2/:id', (req, res) => {
    const { id } = req.params;  
    conn.query('SELECT * FROM paquete where id_paquete = ?',[id], (err, result) => {
        if(err) throw err;
        res.render('viajes.ejs',{ data: result[0] });
    });
});

router.post('/compra',(req, res) => {
    const {Numero_tarjeta, Vencimiento, Rut, Email, Banco, Nombre, Direccion, Id_viaje, Id_compra, Pago, Id_paquete, Id_estadia} = req.body;
    conn.query('insert into cliente set ?', {
        Nombre_cliente: Nombre,
        Correo: Email,
        Direccion_cliente: Direccion,
        Rut: Rut,
        Admin: 0,
        Contraseña: null
    }, (err, result1) =>{
        if(err) throw err;
        conn.query('insert into TarjetaCred set ?', {
            Numero_tarjeta: Numero_tarjeta,
            Fecha_vencimiento: Vencimiento,
            Rut: Rut,
            Banco: Banco
        }, (err2, result1) =>{
            if(err2) throw err2;
            conn.query('insert into compra set ?', {
                Id_compra: Id_compra,
                Fecha_compra: year + "-" + month + "-" + date,
                Rut: Rut,
                Hora_compra: hours + ":" + minutes,
                Estado: 1
            }, (err3, result1) =>{
                if(err3) throw err3;
                conn.query('insert into boleta set ?', {
                    Id_compra: Id_compra,
                    Id_boleta: Id_compra,
                    Descuento: parseInt(Id_paquete * 10),
                    Precio_viaje: Id_viaje.length * parseInt(Id_paquete * 10) *1000,
                    Precio_estadia: Id_estadia.length * 25000,
                    Valor_total:( Id_viaje.length * parseInt(Id_paquete * 10) *1000 + Id_estadia.length * parseInt(Id_paquete * 10)* 1000 * Id_estadia.length * 25000),
                    Metodo_pago: Pago
                }, (err4, result1) =>{
                    if(err4) throw err4
                    for (let index = 0; index < Id_viaje.length; index++) {
                    const element = Id_viaje[index];
                    if(!isNaN(element)){
                        conn.query('insert into compra_viaje set ?',{
                            Id_compra: Id_compra,
                            Id_viaje: element
                        },
                        (err5, result) =>{
                            if(err5) throw err5;
                        });
                    }
                }
                    for (let index = 0; index < Id_compra.length; index++) {
                        const element = Id_paquete[index];
                        if(!isNaN(element)){
                            conn.query('insert into paquete_compra set ?',{
                                Id_compra: Id_compra,
                                Id_paquete: element
                            },
                            (err, result) =>{
                                if(err) throw err;
                            });
                        }
                    }
                    res.redirect('/3');
                });
            });
        });    
    });
});

router.post('/buscar3', (req, res) => {
    const {Fecha_viaje, Id_paquete} = req.body;
    conn.query('SELECT * FROM viaje where Fecha_viaje = ?',[Fecha_viaje], (err, result) => {
        if(err) throw err;
        conn.query('select * from paquete where Id_paquete = ?', [Id_paquete], (err2, result2) => {
            if(err2) throw err2;
            res.render('viajes2.ejs',{ data: result, paquete: result2 });
        });
    });
});

router.post('/buscar4', (req, res) => {
    const {Fecha_viaje, Id_paquete} = req.body;
    conn.query('SELECT * FROM viaje where Fecha_viaje >= ?',[Fecha_viaje], (err, result) => {
        if(err) throw err;
        conn.query('select * from paquete where Id_paquete = ?', [Id_paquete], (err2, result2) => {
            if(err2) throw err2;
            res.render('viajes2.ejs',{ data: result, paquete: result2 });
        });
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
/*conn.query('select id_paquete as paquete, count(rut)  as vendido from compra natural join paquete group by id_paquete;',  (err,res,campos) =>{
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
/*conn.query('select id_estadia from paquete_estadia WHERE id_paquete IN ( SELECT id_paquete FROM compra NATURAL JOIN paquete where id_compra = 1);',  (err,res,campos) =>{
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