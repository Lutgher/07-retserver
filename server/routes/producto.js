const express=require('express');
const { verificaToken, verificaAdmin }=require('../middlewares/autenticacion');
const app=express();
const Producto=require('../models/producto');
const _=require('underscore');

//listar todos los productos
app.get('/producto', verificaToken ,(req, res)=>{
    let desde=req.query.desde||0;
    desde=Number(desde);
    let limite=req.query.limite || 5;
    limite=Number(limite);

    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('categoria','descripcion')
        .populate('usuario','nombre')
        .skip(desde)
        .limit(limite)
        .exec((err, productos)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err:{
                        message:'No hay registro de productos'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productos
            })
        });
});

//listar por el id del producto
app.get('/producto/:id', verificaToken,(req, res)=>{
    let id=req.params.id;

    Producto.findById(id)
        .populate('usuario','nombre')
        .populate('categoria','descripcion')
        .exec((err, productoDB)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!productoDB){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:'No existe el producto'
                    }
                });
            }
            
            res.json({
                ok:true,
                producto: productoDB
            });
        });

    // Producto.findById(id,(err, productoDB)=>{
    //     if(err){
    //         return res.status(400).json({
    //             ok:false,
    //             err
    //         });
    //     }
    //     if(!productoDB){
    //         return res.status(400).json({
    //             ok:false,
    //             err:{
    //                 message:'No existe el producto'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok:true,
    //         producto: productoDB
    //     });
    // });
});

//buscar productos

app.get('/producto/buscar/:termino', verificaToken,(req, res)=>{

    let termino=req.params.termino;
    //expresión regular
    let regexp=new RegExp(termino,'i');

    Producto.find({ nombre: regexp })
        .populate('categoria','nombre')
        .populate('usuario','nombre')
        .exec((err, productoDB)=>{
            if(err){
                return res.status(500).json({
                    ok: true,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });

});


//Insertar registros

app.post('/producto',[verificaToken, verificaAdmin ],(req, res)=>{
    let body=req.body;

    let producto=new Producto({
        nombre: body.nombre,
        precioUnitario: body.precioUnitario,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    });

});

app.put('/producto/:id',[verificaToken, verificaAdmin],(req, res)=>{
    let id=req.params.id;
    let body=req.body;
    //let body=_.pick('nombre precioUnitario descripcion disponible categoria usuario');

    //Producto.findByIdAndUpdate(id, body,{ new: true, runValidators: true },(err, productoDB)=>{
    Producto.findById(id,(err, productoDB)=>{        
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message:'No existe el producto'
                }
            });
        }

        productoDB.nombre=body.nombre;
        productoDB.precioUnitario=body.precioUnitario;
        productoDB.descripcion=body.descripcion;
        productoDB.disponible=body.disponible;
        productoDB.categoria=body.categoria;

        productoDB.save((err, productoGuardado)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.status(201).json({
                ok: true,
                producto: productoGuardado
            });
        });

        // res.status(201).json({
        //     ok: true,
        //     producto: productoDB
        // });
    });
    
});


app.delete('/producto/:id',verificaToken,(req, res)=>{
    let id=req.params.id;

    Producto.findById(id,(err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!productoDB){
            return res.status(500).json({
                ok: false,
                err:{
                    message:'No existe'
                }
            });
        }

        productoDB.disponible=false;

        productoDB.save((err,productoBorrado)=>{
            if(err){
                return res.status(400).json({
                    ok: true,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje:'Producto borrado'
            })
        });
    })
});


module.exports=app;