var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const gallerysSchema = new Schema({
    title:  {type: String, required: [true, 'Pole tytuł jest wymagane !']},
    description:  {type: String},
});

module.exports = mongoose.model('Gallerys', gallerysSchema);