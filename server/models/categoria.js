const mongoose=require('mongoose');
let Schema=mongoose.Schema;

let categoriaSchema=new Schema({
    descripcion:{
        type: String,
        required:[true,'Debe de ingresar la descripción de la categoría']
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

// categoriaSchema.methods.JSON=function(){
//     let 
// }

module.exports=mongoose.model('Categoria',categoriaSchema);