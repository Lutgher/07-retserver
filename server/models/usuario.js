const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');


let roleValidos={
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol válido'
};
//obtener esquema de mongodb

let Schema=mongoose.Schema;

let usuarioSchema=new Schema({
    nombre:{
        type: String,
        required: [true,'Debe de ingresar el nombre']
    },
    email:{
        type: String,
        unique: true,
        required: [true,'Es obligatorio el correo']
    },
    password:{
        type: String,
        required: [true,'Es obligatorio al contraseña']
    },
    img:{
        type: String,
        required:false
    },
    role:{
        type: String,
        //required: true,
        default: 'USER_ROLE',
        enum: roleValidos
    },
    estado:{
        type: Boolean,
        //required: true,
        default: true
    },
    google:{
        type: Boolean,
        //required: true,
        default: false
    }
});

usuarioSchema.methods.toJSON = function(){
    let user = this
    let userObject=user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator,{message: '{PATH} debe de ser único'});

module.exports=mongoose.model('Usuario',usuarioSchema);