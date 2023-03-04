const mongoose = require('mongoose')

const file = mongoose.Schema({
    path: {
        type: String,
        required: true,
    },
    orignalName: {
        type: String,
        required: true,
    },
    password: String,
    downloadCount: {
        type: String,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model("file", file)