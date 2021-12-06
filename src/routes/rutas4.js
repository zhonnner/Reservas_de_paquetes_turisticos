const express = require('express');
const router = express.Router();
const conn = require('../database');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Reservas_de_paquetes_turisticos')
var db = mongoose.connection;

router.get('/', (req, res)=>{
    req.logout();
    res.render('backend/login.ejs');
});

router.get('/2', isAuthenticated, function(req, res, next){
    let o = [], arr = []
    db.collection("Paquete").find().toArray(function(err, result) {
        if (err) throw err;
        result.forEach(element => {
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
        res.render('backend/backend.ejs',{ compra: arr, paquete: o });
    });
});

router.get('/busquedas', isAuthenticated, (req, res)=>{
  res.render('backend/busquedas.ejs');
});

router.get('/ingresar', isAuthenticated, (req, res)=>{
    db.collection("Paquete").find().project({Compra: 0, Estadia: 0}).toArray(function(err, result) {
        if (err) throw err;
        result.sort((a, b) => parseFloat(a.Id_paquete) - parseFloat(b.Id_paquete));
        res.render('backend/ingresar.ejs',{ paquete: result });
    });
});

router.get('/ingresar1', isAuthenticated, (req, res)=>{
    db.collection("Viajes").find().toArray(function(err, result) {
        if (err) throw err;
        res.render('backend/ingresar1.ejs',{ viaje: result });
    });
});

router.get('/ingresar2', isAuthenticated, (req, res)=>{
    arr = []
    db.collection("Paquete").find().project({Estadia: 1}).toArray(function(err, result) {
        if (err) throw err;
        result.forEach(element => {
            element.Estadia.forEach(element2 =>{
                if(arr.length == 0){
                    arr.push(element2);
                }else{
                    var guardar = 0;
                    arr.forEach(element3 => {
                        if(element2.Id_estadia == element3.Id_estadia){ guardar = 1}
                    });
                    if( guardar == 0){ arr.push(element2)}   
                }
            });    
        });
        arr.sort((a, b) => parseFloat(a.Id_estadia) - parseFloat(b.Id_estadia));
        res.render('backend/ingresar2.ejs',{ estadia: arr, paquete: result });
    });
});

/* Añadir fila a la tabla persona */
router.post('/add', isAuthenticated, (req, res) => {
  const {Id_paquete, Nombre_paquete, Pais_destino, Tiempo_estadia_dias, Tiempo_estadia_noches, Fecha_llegada, Fecha_salida} = req.body; 
  db.collection('Paquete').insertOne({
        Id_paquete: Id_paquete,
        Nombre_paquete: Nombre_paquete,
        Pais_destino: Pais_destino,
        Tiempo_estadia_dias: Tiempo_estadia_dias,
        Tiempo_estadia_noches: Tiempo_estadia_noches,
        Fecha_llegada: new Date(Fecha_llegada),
        Fecha_salida: new Date(Fecha_salida),
        Estadia: [],
        Compra: []
    }, (err, result)=>{
        if(err) throw err;
        res.redirect('/ingresar');
    })
});

router.post('/add1', isAuthenticated, (req, res) => {
  const {Id_viaje, Fecha_viaje, Hora_viaje, Origen, Destino, Capacidad_viaje} = req.body;
  db.collection('Viajes').insertOne({
    Id_viaje: Id_viaje,
    Fecha_viaje: new Date(Fecha_viaje),
    Hora_viaje: Hora_viaje,
    Origen: Origen,
    Destino: Destino,
    Capacidad_viaje: Capacidad_viaje
    }, (err, result)=>{
        if(err) throw err;
        res.redirect('/ingresar1');
    })
});

router.post('/add2',isAuthenticated, (req, res) => {
  const {Id_estadia, Id_paquete, Direccion_estadia, Telefono_estadia, Capacidad_estadia, Nombre_estadia} = req.body;
    db.collection('Paquete').find({'Id_paquete': parseInt(Id_paquete)}).toArray(function(err, result){
        if(err) throw err;
        var user = {"Id_estadia": Id_estadia,
            "Direccion_estadia": Direccion_estadia,
            "Telefono_estadia": Telefono_estadia,
            "Capacidad_estadia": Capacidad_estadia,
            "Nombre_estadia": Nombre_estadia    }
        var removeid = result[0]._id;
        result[0].Estadia.push(user)
        db.collection('Paquete').deleteOne({_id: removeid})
        db.collection('Paquete').insertOne(result[0]);
        res.redirect('/ingresar2');
    });
});


//buscar
router.post('/buscar', isAuthenticated, (req, res) => {
    const {rut} = req.body;
    db.collection('Paquete').find({'Compra.Cliente.Rut': rut}).toArray(function(err, result){
        if(err) throw err;
        if(result.length == 0){res.render('backend/buscar.ejs',{data: result})}
        else{
            for (let i = 0; i < result[0].Compra.length; i++) {
                if(result[0].Compra[i].Cliente.Rut == rut){
                    var b =[result[0].Compra[i].Cliente]
                    res.render('backend/buscar.ejs',{data: b});
                    break;
                }    
            } 
        }
    })
});

router.post('/buscar1', isAuthenticated, (req, res) =>{
    const {Id_compra} = req.body;  
    let b = [], c = []
    db.collection('Paquete').find({'Compra.Id_compra': parseInt(Id_compra)}).toArray(function(err, result){
        if(err) throw err;
        if(result.length == 0){res.render('backend/buscar1.ejs',{ compra: b, paquete: result })}
        else{
            for (let i = 0; i < result.length; i++) {
                for (let j = 0; j < result[i].Compra.length; j++) {
                    if(result[i].Compra[j].Id_compra == parseInt(Id_compra)){ 
                        var user2 = { "Id_paquete": result[i].Id_paquete, "Rut": result[i].Compra[j].Cliente.Rut }
                        c.push(user2)
                        for (let k = 0; k < result[i].Compra[j].Viaje_comprados.length; k++) {
                            var user = { "Id_compra": parseInt(Id_compra), "Estado": result[i].Compra[j].Estado, 
                                "Fecha_compra": result[i].Compra[j].Fecha_compra, "Hora_compra": result[i].Compra[j].Fecha_compra,
                                "Id_viaje": result[i].Compra[j].Viaje_comprados[k].Id_viaje, 
                                "Fecha_viaje": result[i].Compra[j].Viaje_comprados[k].Fecha_viaje,
                                "Hora_viaje": result[i].Compra[j].Viaje_comprados[k].Hora_viaje,
                                "Origen": result[i].Compra[j].Viaje_comprados[k].Origen, "Destino": result[i].Compra[j].Viaje_comprados[k].Destino,
                                "Capacidad_viaje": result[i].Compra[j].Viaje_comprados[k].Capacidad_viaje, "Rut": result[i].Compra[j].Cliente.Rut    }
                            if(b.length == 0){ b.push(user)
                            }else{
                                var guardar = 0;
                                b.forEach(element3 => {
                                    if(result[i].Compra[j].Viaje_comprados[k].Id_viaje == element3.Id_viaje){ 
                                        guardar = 1 }
                                });
                                if( guardar == 0){ b.push(user) } 
                            }   
                        }
                    }
                }
            }
            res.render('backend/buscar1.ejs',{ compra: b, paquete: result });
        }
        
    })
});

router.post('/buscar2', isAuthenticated, (req, res) =>{
    const {Id_paquete} = req.body;
    let c = []
    db.collection('Paquete').find({'Id_paquete': parseInt(Id_paquete)}).project({Compra:0}).toArray(function(err, result){
        if(err) throw err;
        if(result.length == 0){res.render('backend/buscar2.ejs',{ estadia: c, paquete: result})}
        else{
            result[0].Estadia.forEach(element => {
                var user = {"Id_estadia": element.Id_estadia,
                "Direccion_estadia": element.Direccion_estadia,
                "Telefono_estadia": element.Telefono_estadia,
                "Capacidad_estadia": element.Capacidad_estadia,
                "Nombre_estadia": element.Nombre_estadia,
                "Id_paquete": result[0].Id_paquete    }
                    c.push(user)
            });
            res.render('backend/buscar2.ejs',{ estadia: c, paquete: result});
        }
        
    })
});

router.post('/buscar3', isAuthenticated, (req, res) => {
  const {Id_viaje} = req.body;
  db.collection("Viajes").find({'Id_viaje': parseInt(Id_viaje)}).toArray(function(err, result) { 
    if(err) throw err;
    res.render('backend/buscar3.ejs',{data: result});
  })
});

function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } res.redirect('/')
}

module.exports = router;
