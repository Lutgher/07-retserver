require('./config/config');
const express=require('express'),
    bodyParser=require('body-parser');
const mongoose=require('mongoose');

const path=require('path');
const app=express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
// app.use(require('./routes/usuario'));
// app.use(require('./routes/login'));

//habilitar la carpeta public
app.use(express.static( path.resolve(__dirname, '../public')));

//configuración global de rutas
app.use(require('./routes/index'));

// console.log(path.resolve(__dirname, '../public'));
//mongoose.Promise=global.Promise;
// mongoose.connect(process.env.URLDB, { useNewUrlParser: true },(err, res)=>{
//     if(err) throw err;
//     console.json({mensaje: 'Base de datos Online'});
// });
mongoose.connect(process.env.URLDB, { useNewUrlParser: true })
    .then(()=>{
        // console.json({mensaje: 'Base de datos Online'})
        console.log(`Base de datos Online`, process.env.URLDB)
    })
    .catch(err=>{
        console.log(err);
    });
app.listen(process.env.PORT,()=>{
    console.log('Escuchando el puerto',process.env.PORT);
});