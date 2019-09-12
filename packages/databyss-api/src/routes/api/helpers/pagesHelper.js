const Block = require('../../../models/Block')
const Source = require('../../../models/Source')
const Entry = require('../../../models/Entry')
const Topic = require('../../../models/Topic')

const getBlockItemsFromId = blocks => {
  const promises = blocks.map(async b => {
    const _id = b._id.toString()
    const block = await Block.findOne({
      _id,
    }).catch(err => console.log(err))
    if (block) {
      const { type, entryId, sourceId, authorId, topicId } = block
      const response = { type, _id }
      if (type === 'ENTRY') {
        response.refId = entryId
      }
      if (type === 'SOURCE') {
        response.refId = sourceId
      }
      if (type === 'TOPIC') {
        response.refId = topicId
      }
      if (type === 'AUTHOR') {
        response.refId = authorId
      }
      return response
    }
    return {}
  })
  return Promise.all(promises)
}

const getSourcesFromId = list => {
  const promises = list.map(async b => {
    const _id = b.refId
    const source = await Source.findOne({
      _id,
    }).catch(err => console.log(err))
    if (!source) return {}

    const { resource } = source
    const response = { rawHtml: resource, _id }
    return response
  })
  return Promise.all(promises)
}

const getTopicsFromId = list => {
  const promises = list.map(async b => {
    const _id = b.refId
    const topic = await Topic.findOne({
      _id,
    }).catch(err => console.log(err))
    if (!topic) return {}
    const { text } = topic
    const response = { rawHtml: text, _id }
    return response
  })
  return Promise.all(promises)
}

const getEntriesFromId = list => {
  const promises = list.map(async b => {
    const _id = b.refId
    const entryResponse = await Entry.findOne({
      _id,
    }).catch(err => console.log(err))
    if (!entryResponse) return {}

    const { entry } = entryResponse
    const response = { rawHtml: entry, _id }
    return response
  })
  return Promise.all(promises)
}

const dictionaryFromList = list => {
  const result = {}
  list.forEach(b => {
    if (b) {
      result[b._id] = b
    }
  })
  return result
}

module.exports.getBlockItemsFromId = getBlockItemsFromId
module.exports.dictionaryFromList = dictionaryFromList
module.exports.getSourcesFromId = getSourcesFromId
module.exports.getEntriesFromId = getEntriesFromId
module.exports.getTopicsFromId = getTopicsFromId
