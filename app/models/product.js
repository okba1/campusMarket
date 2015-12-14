var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var productSchema = Schema({
    title       : String,
    description : String, 
    toSell      : Boolean,
    userId      : ObjectId
});


module.exports = mongoose.model('Product', productSchema);