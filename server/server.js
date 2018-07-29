require('./config/config');

const express=require('express'),
    app=express(),
    bodyParser=require('body-parser');
const mongoose=require('mongoose');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


app.use(require('./routes/usuario'));

//mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/cafe',(err, res)=>{

    if(err) throw err;

    console.res(200).json({mensaje: 'Base de datos Online'});
});

app.listen(process.env.PORT,()=>{
    console.log('Escuchando el puerto',3000);
});