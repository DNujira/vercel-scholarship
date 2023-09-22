const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    sid: Number,
    sname: String,
    stype: Array,
    opendate: String,
    closedate: String,
    sfaculty: Array,
    sbranch: Array,
    sclass: String,
    sgpa: Number,
    country: String,
    university: String,
    costoflive: String,
    costoflean: String,
    costofabode: String,
    stoeic: Number,
    sielts: Number,
    stoefl: Number,
    sgiver: String,
    url: String,
    pinnedcount: Number,
    scrapdate: Date,
    watchcount: Number,
    tunfrome: String
})

module.exports = mongoose.model('Test', TestSchema)

module.exports.saveTest = function(model, data) {
    model.save(data)
}
