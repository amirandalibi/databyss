export const _initialState = {
  showMenuActions: false,
  showFormatMenu: false,
  showNewBlockMenu: true,
  activeBlockId: '5e48cdc1dbce857f65e4662d',
  newEntities: [], // renamed from `newAtomics`
  entityCache: {
    '5e3b2000fda293001813b1d6': {
      type: 'SOURCE',
      _id: '5e3b2000fda293001813b1d6',
      text: {
        textValue:
          'Stamenov, Language Structure, Discourse and the Access to Consciousness',
        ranges: [
          { offset: 3, length: 2, mark: 'italic' },
          { offset: 0, length: 2, mark: 'bold' },
        ],
      },
    },
    '5e3f829ce5447c0018baebed': {
      type: 'ENTRY',
      _id: '5e3f829ce5447c0018baebed',
      text: {
        textValue: 'On the limitation of third-order thought to assertion',
        ranges: [
          {
            offset: 7,
            length: 10,
            mark: 'bold',
          },
        ],
      },
    },
    '5e3b1bc48fb28680fe26437d': {
      type: 'TOPIC',
      _id: '5e3b1bc48fb28680fe26437d',
      text: {
        textValue: 'Some topic',
        ranges: [],
      },
    },
  },
  blockCache: {
    '5e48cdc1dbce857f65e46627': {
      type: 'SOURCE',
      entityId: '5e3b2000fda293001813b1d6',
    },
    '5e48cdc1dbce857f65e4662d': {
      type: 'ENTRY',
      entityId: '5e3f829ce5447c0018baebed',
    },
    '5e36ff96b21e9400186c3125': {
      type: 'TOPIC',
      entityId: '5e3b1bc48fb28680fe26437d',
    },
  },
  blocks: [
    {
      _id: '5e48cdc1dbce857f65e46627',
    },
    {
      _id: '5e48cdc1dbce857f65e4662d',
    },
    {
      _id: '5e36ff96b21e9400186c3125',
    },
  ],
}
