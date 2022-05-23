var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const usersSchema = new Schema({
    nick: {type: String, required: [true, 'Pole nick jest wymagane !']},
    name: {type: String, required: [true, 'Pole imię jest wymagane !']},
    surname: {type: String, required: [true, 'Pole nazwisko jest wymagane !']},
    email: {type: String, required: [true, 'Pole email jest wymagane !']},
    password: {type: String, required: [true, 'Pole hasło jest wymagane !']},
    avatar: {type: String, default: 'nopicture'},
    created: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Users', usersSchema);