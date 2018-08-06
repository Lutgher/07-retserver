const express=require('express');
const { verificaToken, verificaAdmin }=require('../middlewares/autenticacion');
const app=express();

let Categoria=require('../models/categoria');

//mostrar todas las categorias
app.get('/categoria',verificaToken,(req,res)=>{
    let desde=req.query.desde || 0;
    desde=Number(desde);
    let limite=req.query.limite || 5;
    limite=Number(limite);

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario','nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err,categorias)=>{
            if(err){
                res.status(200).json({
                    ok: false,
                    error: err
                });
            };

            res.json({
                ok:true,
                categoria: categorias
            });
        });
});


//mostrar una categia por id
app.get('/categoria/:id', verificaToken,(req,res)=>{
    //Categoria.findById();
    let id=req.params.id;
    Categoria.findById(id,(err, categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message:'No existe la categoria'
                }
            });
        }
        
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

//Crear una nueva categoría
app.post('/categoria', [verificaToken, verificaAdmin],(req,res)=>{
    //regresa la categoria
    //req.usuario.id
    let body=req.body;

    let categoria=new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

//Actualizar la categoria
app.put('/categoria/:id', [verificaToken, verificaAdmin],(req,res)=>{
    let id=req.params.id;
    let body=req.body;

    let descCategoria={
        descripcion: body.descripcion
    };
    Categoria.findByIdAndUpdate(id,descCategoria ,{new: true, runValidators: true},(err, categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                error: err
            });
        };
        

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//Eliminación del registro
app.delete('/categoria/:id',[verificaToken, verificaAdmin],(req,res)=>{
    //Solo un administrador puede eliminar
    //eliminar fisicamente, no ocultar
    let id=req.params.id;
    
    Categoria.findByIdAndRemove(id,(err, categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message:'Categoría borrada',
            categoria: categoriaDB
        });
    });
});


module.exports=app;