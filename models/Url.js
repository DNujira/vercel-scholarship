const mongoose= require('mongoose');

const UrlSchema = new mongoose.Schema({
    url:Array,
    webname: String,
    starturl: String
})

module.exports = mongoose.model('Url', UrlSchema)

module.exports.saveUrl = function(model,data) {
    model.save(data)
}