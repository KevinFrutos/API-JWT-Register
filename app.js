const express = require('express');
const bodyparser = require('body-parser');
require('dotenv').config()
const cors = require('cors')
// RUTAS
const register = require("./routes/register");
const token = require("./routes/token")

const app = express()

app.use(cors())
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.set('json spaces', 2);

app.get('/', (req, res) => {
    res.status(200).json({
        error: null,
        mensaje: "Estas conectado"
    })
})

app.use('/user', register)
app.use('/user', token)


app.listen(process.env.PORT, () => {
    console.log('Accede al servidor desde el puerto ' + process.env.PORT)
  })