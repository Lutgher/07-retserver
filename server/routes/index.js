const express=require('express'),
    app=express();

app.use(require('./usuario'));
app.use(require('./login'));

module.exports=app;