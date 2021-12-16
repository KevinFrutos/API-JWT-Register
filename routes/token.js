const router = require('express').Router();
const db_usuarios = require('../database/dbUsers');
const Register = require('../models/schema_register')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { validate: uuidValidate } = require('uuid');

router.post('/token', async (req, res) => {
    const refresh_token = req.header('refresh_token')
    if (!refresh_token) {
        return res.status(401).json({ error: 'Acceso denegado' })
    }
    try {
        const token_validado = uuidValidate(refresh_token)
        if (!token_validado) {
            return res.status(401).json({
                error: 'Acceso denegado',
                mensaje: 'Token no valido.'
            })
        } else {
            const cursor = await db_usuarios.collection('registers').findOne({ user: req.header('user') })
            bcrypt.compare(refresh_token, cursor.refresh_token, async function (err, resultado) {
                if (!resultado) {
                    res.status(400).json({
                        error: err,
                        mensaje: "El token no es valido!"
                    })
                } else {
                    let time = new Date();
                    let actual_time = Date.parse(time)
                    if (cursor.time_exp >= actual_time) {
                        res.status(400).json({
                            error: true,
                            mensaje: "Tu token actual sigue siendo valido"
                        })
                    } else {
                        const token = jwt.sign({
                            user: cursor.user,
                            email: cursor.email
                        }, process.env.TOKEN_SECRET, { expiresIn: '1h' })

                        let validez_jwt = new Date();
                        validez_jwt.setHours(validez_jwt.getHours() + 1);
                        let time_exp = Date.parse(validez_jwt)

                        await Register.updateOne({ user: cursor.user }, { time_exp: time_exp })

                        res.status(200).json({
                            error: null,
                            token: token,
                            mensaje: "Recuerda que tus token solo duran 1 hora y que necesitas tu refresh_token para generar nuevos token, no compartas estos token con nadie!"
                        })
                    }
                }
            })
        }

    } catch (error) {
        console.log(error);
        res.status(401).json({
            error: true,
            mensaje: "Ha habido un error en tu peticion, intentalo de nuevo mas tarde."
        })
    }
})

module.exports = router;