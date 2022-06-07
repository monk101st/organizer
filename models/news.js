var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const newsSchema = new Schema({
  title:  {type: String, required: [true, 'Pole tytuł jest wymagane !']},
  category: {type: String, required: [true, 'Pole autor jest wymagane !'], default: 'nocategory'},
  author: {type: String, required: [true, 'Pole autor jest wymagane !']},
  description: {type: String, required: [true, 'Pole treść jest wymagane !']},
  articleText: {type: String, required: [true, 'Pole treść jest wymagane !']},
  picture: {type: String},
  created: {type: Date, default: new Date()},
  counter: {type: Number, default: 0},
});

module.exports = mongoose.model('News', newsSchema);