const router = require('express').Router();
const Register = require('../models/schema_register')
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

router.post('/register',
    body('user').isLength({ min: 6 }),
    body('email').isEmail(),
    body('passwd').isLength({ min: 6 }),
    (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const password = bcrypt.hashSync(req.body.passwd, 10)

        const token = jwt.sign({
            user: req.body.user,
            email: req.body.email
        }, process.env.TOKEN_SECRET, {expiresIn: '1h'})

        let validez_jwt = new Date();
        validez_jwt.setHours(validez_jwt.getHours() + 1);
        let time_exp = Date.parse(validez_jwt)

        const refresh_token = uuidv4()

        const refresh_token_encrypt = bcrypt.hashSync(refresh_token, 10)

        const register = new Register({
            user: req.body.user,
            email: req.body.email,
            passwd: password,
            refresh_token: refresh_token_encrypt,
            time_exp: time_exp
        })

        register.save(err => {
            if (err) {
                console.log(err);
                res.status(400).json({
                    error: err,
                    data: 'Algo fue mal'
                })
            } else {
                res.status(200).json({
                    error: null,
                    token: token,
                    refresh_token: refresh_token,
                    mensaje: "Recuerda que tus token solo duran 1 hora y que necesitas tu refresh_token para generar nuevos token, no compartas estos token con nadie!"
                })
            }
        })

    })

module.exports = router;