var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const rulesSchema = new Schema({
    nr: {type: Number, required: [true, 'Pole numer jest wymagane !']},
    title:  {type: String, required: [true, 'Pole tytuł jest wymagane !']},
    description: {type: String, required: [true, 'Pole treść jest wymagane !']},
});

module.exports = mongoose.model('Rules', rulesSchema);