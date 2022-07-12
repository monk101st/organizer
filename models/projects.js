var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const projectsSchema = new Schema({
  title:  {type: String, required: [true, 'Pole tytuł jest wymagane !']},
  author: {type: String, required: [true, 'Pole autor jest wymagane !']},
  description: {type: String, required: [true, 'Pole opis jest wymagane !']},
  articleText: {type: String, required: [true, 'Pole treść jest wymagane !']},
  technology: [
    javascript = {type: String},
    react = {type: String},
  ],
  picture: {type: String, default: 'nopicture'},
  created: {type: Date, default: Date.now},
  counter: {type: Number, default: 0},
});

module.exports = mongoose.model('Projects', projectsSchema);

