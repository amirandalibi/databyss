const mongoose = require('mongoose')
const Range = require('./Range')

const RichTextSchema = new mongoose.Schema({
  textValue: { type: String },
  ranges: {
    type: [Range],
    default: [],
  },
})

const RichText = mongoose.model('richtext', RichTextSchema)

// RichText.createWithDefaults = () => RichText({ textValue: '', ranges: [] })

module.exports = RichText
