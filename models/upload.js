var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const uploadSchema = new Schema({
    imagename:  {type: String, required: [true, 'Pole tytuł jest wymagane !']},
    gallery:  {type: String},
});

module.exports = mongoose.model('Upload', uploadSchema);