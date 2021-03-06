var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const aboutsSchema = new Schema({
  title:  {type: String, required: [true, 'Pole tytuł jest wymagane !']},
  author: {type: String, required: [true, 'Pole autor jest wymagane !']},
  description: {type: String, required: [true, 'Pole treść jest wymagane !']},
  articleText: {type: String, required: [true, 'Pole treść jest wymagane !']},
  picture: {type: String},
  created: {type: Date, default: Date.now},
  counter: {type: Number, default: 0},
});

module.exports = mongoose.model('Abouts', aboutsSchema);

