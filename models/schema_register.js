const { Schema } = require("mongoose");
const db_usuarios = require('../database/dbUsers');

const schema = new Schema({
    user: { type: String, required: true, unique: true },
    // name: { type: String, required: true },
    // last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwd: { type: String, required: true },
    refresh_token: { type: String },
    time_exp: { type: String }
});

module.exports = db_usuarios.model('Register', schema)