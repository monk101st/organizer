var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const newsSchema = new Schema({
  title:  {type: String, required: [true, 'Pole tytuł jest wymagane !']},
  author: {type: String, required: [true, 'Pole autor jest wymagane !']},
  description: {type: String, required: [true, 'Pole treść jest wymagane !']},
  created: {type: Date, default: Date.now},
});

module.exports = mongoose.model('News', newsSchema);