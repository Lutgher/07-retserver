require('./config/config');
const express=require('express'),
    app=express(),
    bodyParser=require('body-parser');
const mongoose=require('mongoose');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(require('./routes/usuario'));

mongoose.Promise=global.Promise;
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
    console.log('Escuchando el puerto',3000);
});