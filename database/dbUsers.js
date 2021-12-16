const mongoose = require('mongoose');

const url_usuarios = "mongodb+srv://" + process.env.USER_NAME + ":" + process.env.PASSWORD + "@" + process.env.HOST + "/" + process.env.DBUSERS + "?retryWrites=true&w=majority";

const db_usuarios = mongoose.createConnection(url_usuarios, { useNewUrlParser: true, useUnifiedTopology: true })
db_usuarios.on('error', (err) => {
  console.log(err);
 });

module.exports = db_usuarios;