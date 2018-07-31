/*==================
puerto
===================*/
process.env.PORT = process.env.PORT || 3000;


/*==================
Entorno
===================*/
process.env.NODE_ENV=process.env.NODE_ENV || 'dev'

/*==================
Base de datos
===================*/

let urlDB;
if(process.env.NODE_ENV ==='dev'){
     urlDB='mongodb://localhost:27017/cafe';
}else{
    //urlDB='mongodb://hlazo:f123456@ds159661.mlab.com:59661/cafe';
    urlDB=process.env.MONGO_URI;
}
process.env.URLDB = urlDB;