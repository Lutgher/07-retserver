const express=require('express');
const fileUpload=require('express-fileupload');
const app=express();
const Usuario=require('../models/usuario');
const Producto=require('../models/producto');
const fs=require('fs');
const path=require('path');

//default options
app.use(fileUpload());

app.put('/upload/:tipo/:id',(req, res)=>{

    let tipo=req.params.tipo;
    let id=req.params.id;

    //si no hay archivos devuelve error
    if(!req.files)
        return res.status(500).json({
            ok: false,
            err:{
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    //tipo de carpetas
    let tiposValidos=['productos','usuarios'];
    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'La tipos permitos son'+tiposValidos.join(', ')
            }
        });
    }
    //El nombre que se le asigna al elemento cargado con el nombre archivo
    let archivo=req.files.archivo;

    let nombreCortado=archivo.name.split('.');
    let extension=nombreCortado[nombreCortado.length-1];
    //console.log(extension);
    //extensiones validas
    let extensionesValidas = ['png','jpg','gif','jpeg'];

    if(extensionesValidas.indexOf(extension)<0){
        return res.status(400).json({
            ok: false,
            err:{
                message:'Las extensiones validas es '+extensionesValidas.join(', ')
            }
        });
    }

    //cambiar nombre del archivo

    let nombreArchivo=`${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`,(err)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err:{
                    message:'Error de cargado'
                }
            });
        }

        if(tipo=='usuarios'){
            imagenUsuario(id, res, nombreArchivo);
        }else{
            imagenProducto(id, res, nombreArchivo);
        }

        // res.json({
        //     ok: true,
        //     message: 'Imagen subida correctamente'
        // });
    });

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB)=>{
        if(err){
            borrarArchivo(nombreArchivo.img, 'usuarios');
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if(!usuarioDB){
            borrarArchivo(nombreArchivo.img, 'usuarios');
            return res.status(500).json({
                ok: false,
                err:{
                    message:'Usuario no existe'
                }
            });
        }

        // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${ usuarioDB.img }`);
        // //verifica si existe el path
        // if( fs.existsSync(pathImagen) ){
        //     fs.unlinkSync(pathImagen);//si existe lo elimina
        // }
        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img=nombreArchivo;
        usuarioDB.save((err, usuarioGuardado)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok:true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });

}

function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id,(err, productoDB)=>{
        if(err){
            borrarArchivo(nombreArchivo.img, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            borrarArchivo(nombreArchivo.img, 'productos');
            return res.status(500).json({
                ok: false,
                err:{
                    message:'Producto no existe'
                }
            });
        }

        borrarArchivo(productoDB.img,'productos');
        productoDB.img=nombreArchivo;
        productoDB.save((err, productoGuardado)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok:true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    });
}

function borrarArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports=app;


// app.put('/upload',(req, res)=>{

//     //si no hay archivos devuelve error
//     if(!req.files)
//         return res.status(500).json({
//             ok: false,
//             err:{
//                 message: 'No se ha seleccionado ningún archivo'
//             }
//         });
//     //El nombre que se le asigna al elemento cargado con el nombre archivo
//     let archivo=req.files.archivo;

//     let nombreCortado=archivo.name.split('.');
//     let extension=nombreCortado[nombreCortado.length-1];
//     console.log(extension);
//     //extensiones validas
//     let extensionesValidas = ['png','jpg','gif'];

//     if(extensionesValidas.indexOf(extension)<0){
//         return res.status(400).json({
//             ok: false,
//             err:{
//                 message:'Las extensiones validas es '+extensionesValidas.join(', ')
//             }
//         });
//     }

//     archivo.mv(`uploads/${ archivo.name}.jpg`,(err)=>{
//         if(err){
//             return res.status(500).json({
//                 ok: false,
//                 err:{
//                     message:'Error de cargado'
//                 }
//             });
//         }
//         res.json({
//             ok: true,
//             message: 'Imagen subida correctamente'
//         });
//     });

// });