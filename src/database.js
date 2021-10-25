const mysql = require('mysql');
let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'paquetes_turisticos2'
});
conn.connect(function (err){
    if(err){
        console.log(err);
        return;
    }else{
        console.log('la base de datos esta conectada!')
    }
});
module.exports = conn;   

    
