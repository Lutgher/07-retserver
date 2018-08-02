const express=require('express'),
    bcrypt=require('bcrypt'),
    jwt=require('jsonwebtoken'),
    Usuario=require('../models/usuario'),
    app=express();

app.post('/login',(req, res)=>{
    let body=req.body;

    Usuario.findOne({ email: body.email},(err, usuariodb)=>{
        if(err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuariodb) {
            return res.status(400).json({
                ok: true,
                err:{
                    message:'(Usuario) o contraseña incorrecto'
                }
            });
        }

        if(!bcrypt.compareSync(body.password, usuariodb.password)){
            return res.status(400).json({
                ok: true,
                err:{
                    message:'Usuario o (contraseña) incorrecto'
                }
            });
        }

        let token=jwt.sign({
            usuario: usuariodb
        },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});
        res.json({
            ok: true,
            usuario: usuariodb,
            token
        });

    });
});



module.exports=app;