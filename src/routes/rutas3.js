const express = require('express');
const router = express.Router();
const conn = require('../database');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Reservas_de_paquetes_turisticos')

var db = mongoose.connection;
let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();

router.get('/', function(req, res) {
    db.collection("Paquete").find({}).project({Id_paquete: 1}).toArray(function(err, res1){
        if(err) throw err;
        res.render('home2.ejs',{ paquete: res1 });
    })
});

router.post('/2', (req, res) => {
    const { Id_viaje, Id_paquete} = req.body;
    let o = [], arr = [], result2 = []
    db.collection("Paquete").find({'Id_paquete': parseInt(Id_paquete)}).toArray(function(err, res1) {
        if (err) throw err; 
        res1[0].Estadia.forEach(element2 => {
            result2.push(element2.Id_estadia);
        })
    db.collection("Paquete").find().toArray(function(err, res2) {
        if (err) throw err;
        res2.forEach(element => {
            o.push({id_paquete: element.Id_paquete, vendido: element.Compra.length})
            element.Compra.forEach(element2 => {
                if(arr.length == 0){
                    arr.push(element2);
                }
                else{
                    var guardar = 0;
                    arr.forEach(element3 => {
                        if(element2.Id_compra == element3.Id_compra){
                            guardar = 1;
                        }
                    });
                    if( guardar == 0){
                        arr.push(element2);
                    } 
                }   
            });               
        });
        o.sort((a, b) => parseFloat(b.vendido) - parseFloat(a.vendido));
        arr.sort((a, b) => parseFloat(a.Id_compra) - parseFloat(b.Id_compra));
        res.render('pago.ejs',{Id_viaje, result: arr, result2, Id_paquete });
    });
    })
});

router.get('/3', (req, res) => {
    res.render('comprado.ejs')
});

/* Mostrar solamente una persona */ 
router.get('/ver/:id', (req, res) => {
    const { id } = req.params;  
    db.collection("Paquete").find({'Id_paquete': parseInt(id)}).toArray(function(err, res2) {
        if(err) throw err;
        res.render('paquete.ejs',{ data: res2[0] });
    })
  });

router.get('/ver2/:id', (req, res) => {
    const { id } = req.params;  
    db.collection("Paquete").find({'Id_paquete': parseInt(id)}).toArray(function(err, res2) {
        if(err) throw err;
        res.render('viajes.ejs',{ data: res2[0] });
    })
});


router.post('/compra',(req, res) => {
    v = []
    const {Numero_tarjeta, Vencimiento, Rut, Email, Banco, Nombre, Direccion, Id_viaje, Id_compra, Pago, Id_paquete, Id_estadia} = req.body;
    db.collection('Viajes').find().toArray(function(arr, res1){
        if(arr) throw arr;
        var b = Id_viaje.split(',');
        b.forEach(element => {
            res1.forEach(element2 => {
                if(element2.Id_viaje == parseInt(element)){ v.push(element2) }
            });
        });
        db.collection('Paquete').find({'Id_paquete': parseInt(Id_paquete)}).toArray(function(arr, result){
            var user = {
                "Id_compra": parseInt(Id_compra),
                "Estado": true,
                "Fecha_compra": new Date(year + "-" + month + "-" + date),
                "Hora_compra": hours + ":" + minutes,
                "Boleta": {
                    "Id_boleta": parseInt(Id_compra),
                    "Descuento": parseInt(Id_paquete * 10),
                    "Precio_viaje": b.length * parseInt(Id_paquete * 10) *1000,
                    "Precio_estadia": Id_estadia.length * 25000,
                    "Valor_total":( b.length * parseInt(Id_paquete * 10) *1000 + Id_estadia.length * parseInt(Id_paquete * 10)* 1000 * Id_estadia.length * 25000),              
                    "Metodo_pago": Pago
                },
                "Viajes_comprados": v,
                "Cliente": {
                    "Rut": Rut,
                    "Nombre_cliente": Nombre,
                    "Correo": Email,
                    "Direccion_cliente": Direccion,
                    "Contraseña": null,
                    "Admin": false,
                    "TarjetaCred":[{
                        "Numero_tarjeta": Numero_tarjeta,
                        "Fecha_vencimiento": Vencimiento,
                        "Banco": Banco
                    }]
                }
            }
            var removeid = result[0]._id;
            result[0].Compra.push(user)
            db.collection('Paquete').deleteOne({_id: removeid})
            db.collection('Paquete').insertOne(result[0]);
            res.redirect('/3');
        });
    })
})

router.post('/buscar3', (req, res) => {
    const {Fecha_viaje, Id_paquete} = req.body;
    db.collection("Paquete").find({'Id_paquete': parseInt(Id_paquete)}).toArray(function(err, res1) {
        if(err) throw err;
        db.collection("Viajes").find({'Fecha_viaje': new Date(Fecha_viaje)}).toArray(function(err2, res2) {
            if(err2) throw err2;
            res.render('viajes2.ejs',{ data: res2, paquete: res1 });
        })
    })
});

router.post('/buscar4', (req, res) => {
    const {Fecha_viaje, Id_paquete} = req.body;
    db.collection("Paquete").find({'Id_paquete': parseInt(Id_paquete)}).toArray(function(err, res1) {
        if(err) throw err;
        db.collection("Viajes").find({'Fecha_viaje': { $gte: new Date(Fecha_viaje)}}).toArray(function(err2, res2) {
            if(err2) throw err2;
            res.render('viajes2.ejs',{ data: res2, paquete: res1 });
        })
    })
});

module.exports = router;