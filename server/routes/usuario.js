const express=require('express'),
    bcrypt=require('bcrypt'),
    _ =require('underscore'),//se usa de forma para ocultar objetos
    app=express(),
    Usuario=require('../models/usuario');

app.get('/usuario',(req, res)=>{
    let desde=req.query.desde || 0;
    desde= Number(desde);
    let limite=req.query.limite || 5;
    limite=Number(limite);
    //Usuario.find({},)
    Usuario.find({estado: true},'nombre email estado')
        .skip(desde)//salta los primeros registros
        .limit(limite)//mostrar una cantidad asignada
        .exec((err,usuarios)=>{
            if(err){
                return res.status(400).json({
                    ok: true,
                    err
                });
            }
            Usuario.count({estado: true},(err,conteo)=>{
                res.json({
                    ok:true,
                    usuarios,
                    cuantos: conteo
                });
            });
            
    });
});

app.post('/usuario',(req, res)=>{
    let body=req.body;

    let usuario=new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        //img: body.img,
        role: body.role
        //estado: body.estado,
        //google: body.google
    });//instancia del esquema usuario

    
    usuario.save((err, usuariodb)=>{
        if(err){
           return res.status(400).json({
                ok: false,
                error: err
            });
        }
        // usuariodb.password=null;

        res.json({
            ok:true,
            usuario: usuariodb
        });
    });
});

app.put('/usuario/:id?',(req, res)=>{
    let id=req.params.id;
    //let body=req.body;

    let body= _.pick( req.body , ['nombre','email','img','role','estado']);

    // delete body.google;
    // delete body.password;

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true},(err, usuariodb)=>{
        if(err){
            return res.status(400).json({
                 ok: false,
                 error: err
             });
         }

        res.json({
            ok:true,
            usuario:usuariodb    
        }); 

    });
});

app.delete('/usuario/:id',(req, res)=>{
    
    let id=req.params.id;

    let cambiaEstado={
        estado: false
    };
    // Usuario.findByIdAndRemove(id, (err, usuarioBorraod)=>{
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorraod)=>{

        if(err){
            res.status(400).json({
                ok:true,
                error: err
            })
        }

        if(!usuarioBorraod){
            res.status(400).json({
                ok:true,
                error: {
                    message:'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            usuario:usuarioBorraod
        });

    });

});



// app.delete('/usuario/:id',(req, res)=>{
    
//     let id=req.params.id;

//     Usuario.findByIdAndRemove(id, (err, usuarioBorraod)=>{

//         if(err){
//             res.status(400).json({
//                 ok:true,
//                 error: err
//             })
//         }

//         if(!usuarioBorraod){
//             res.status(400).json({
//                 ok:true,
//                 error: {
//                     message:'Usuario no encontrado'
//                 }
//             });
//         }

//         res.json({
//             ok:true,
//             usuario:usuarioBorraod
//         });

//     });

// });

module.exports=app;