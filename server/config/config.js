/*==================
puerto
===================*/
process.env.PORT = process.env.PORT || 3000;


/*==================
Entorno
===================*/
process.env.NODE_ENV=process.env.NODE_ENV || 'dev';


/*==================
Vencimiento del Token
===================*/
//60 s * 60 m * 24h * 30 d
//60 segundos
//60 minutos
//24 horas
//30 días
// process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

process.env.CADUCIDAD_TOKEN = '24h';

/*==================
SEED de autenticación
===================*/

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

/*==================
Base de datos
===================*/

let urlDB;
if(process.env.NODE_ENV ==='dev'){
     urlDB='mongodb://localhost:27017/cafe';
}else{
    urlDB=process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

/*==================
Google client ID
===================*/

process.env.CLIENT_ID = process.env.CLIENT_ID || '514847810623-p505l1b3glmkq92ptrn1npuo9fd55n0t.apps.googleusercontent.com';