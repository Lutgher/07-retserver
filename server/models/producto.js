const mongoose=require('mongoose');
let Schema=mongoose.Schema;

let productosSchema= new Schema({
    nombre:{ type: String, required:[true, 'Es nesecario que ingrese el nombre del producto']},
    precioUnitario: { type: Number, require:[true, 'Es obligatorio el precio del producto']},
    descripcion:{ type: String, required: false },
    img:{ type: String, required:false },
    disponible:{ type: Boolean, required: false, default: true },
    categoria:{ type: Schema.Types.ObjectId,  ref: 'Categoria', required: true },
    usuario:{ type: Schema.Types.ObjectId, ref:'Usuario', required: true }
});

module.exports=mongoose.model('Producto', productosSchema);