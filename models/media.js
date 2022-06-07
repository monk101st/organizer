var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const mediaSchema = new Schema({
    title:  {type: String, required: [true, 'Pole tytuł jest wymagane !']},
    gallery:  {type: String},
    filename: {type: String},
    date:  {type: Date, default: new Date()},
    author:  {type: String},
    description:  {type: String},
});

module.exports = mongoose.model('Media', mediaSchema);