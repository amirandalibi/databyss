import axios from 'axios'

export const entryParser = ({ entries, source, author }) => {
  const res = getEntriesList(entries).then(e => {
    return {
      title: source.resource,
      display: source.abbreviation ? source.abbreviation : 'ABV',
      locations: e.map(l => {
        // console.log(l.pageFrom.toString())
        return {
          raw: l.pageFrom ? `p. ${l.pageFrom.toString()}` : '',
          entries: [
            {
              content: l.entry
            }
          ]
        }
      })
    }
  })
  return res
}

export const entriesParser = sources => {
  const entries = sources.map(async s => {
    const author = await axios.get(`/api/authors/${s.authors[0]}`)
    return {
      author: author.data,
      entryCount: s.entries.length,
      title: s.resource,
      id: s._id
    }
    /*
    return {
      entryCount: s.entries.length,
      title: s.resource,
      id: s._id
    }
    */
  })
  return Promise.all(entries)
}

export const getAuthorName = async authorList => {
  if (authorList[0]) {
    const entryRes = await axios.get(`/api/authors/${authorList[0]}`)
    return entryRes.data
  }
}

export const getEntriesList = entries => {
  const promises = entries.map(async e => {
    const entryRes = await axios.get(`/api/entries/${e}`)
    return entryRes.data
  })
  return Promise.all(promises)
}

export const getAuthor = idList => {
  const promises = idList.map(async e => {
    if (e.authors[0]) {
      const entryRes = await axios.get(`/api/authors/${e.authors[0]}`)
      const { firstName, lastName } = entryRes.data
      if (entryRes.data) {
        return { firstName, lastName, ...e }
      } else {
        return null
      }
    }
  })
  return Promise.all(promises)
}

/*

{ entryCount: 17, title: 'Parergon ', id: 'P' },
  { entryCount: 14, title: 'Restitutions ', id: 'REST' },
  { entryCount: 10, title: '<em>Kh</em><em>ō</em><em>ra</em> ', id: 'KH' },
  { entryCount: 10, title: 'On Touching—Jean-Luc Nancy ', id: 'TN' },
  { entryCount: 9, title: 'Dissemination ', id: 'D' },
  { entryCount: 7, title: 'Of Grammatology ', id: 'OG' },
  { entryCount: 6, title: 'To Speculate—on “Freud” ', id: 'SPEC' },
  { entryCount: 5, title: 'Double Session ', id: 'DS' },
  {
    entryCount: 5,
    title: '<em>Le Facteur de la V</em><em>é</em><em>rit</em><em>é</em> ',
    id: 'FV',
  },
  { entryCount: 5, title: 'The Animal That Therefore I Am ', id: 'ATIA' },
  { entryCount: 5, title: 'The Beast & the Sovereign ', id: 'BSi' },
  { entryCount: 4, title: '+R ', id: '+R' },
  { entryCount: 4, title: 'Cartouches ', id: 'C' },
  { entryCount: 4, title: '<em>D</em><em>é</em><em>sistance </em>', id: 'DST' },
  { entryCount: 3, title: 'Cosmopolitanism and Forgiveness ', id: 'CF' },
  {
    entryCount: 3,
    title: 'Heidegger’s Hand (<em>Geschlecht</em> II) ',
    id: 'Gii',
  },
  { entryCount: 3, title: 'Spurs: Nietzsche’s Styles ', id: 'SP' },
  { entryCount: 2, title: 'Adieu to Emmanuel Levinas ', id: 'AD' },
  {
    entryCount: 2,
    title: 'Gift of Death and Literature in Secret ',
    id: 'GOD',
  },
  { entryCount: 2, title: 'Given Time ', id: 'GT' },
  { entryCount: 2, title: 'Hostipitality ', id: 'HST' },
  {
    entryCount: 2,
    title: 'Interpretations at War: Kant, the Jew, the German ',
    id: 'IW',
  },
  { entryCount: 2, title: 'Passions: “An Oblique Offering” ', id: 'POO' },
  {
    entryCount: 2,
    title: 'Psychoanalysis Searches the States of its Soul ',
    id: 'PSSS',
  },
  { entryCount: 2, title: 'Signature Event Context ', id: 'SEC' },
  {
    entryCount: 2,
    title: 'The Archeology of the Frivolous: Reading Condillac ',
    id: 'AFR',
  },
  { entryCount: 2, title: 'The Politics of Friendship ', id: 'POOF' },
  { entryCount: 2, title: 'The Principle of Reason ', id: 'POR' },
  { entryCount: 1, title: 'A Silkworm of One’s Own ', id: 'SW' },
  { entryCount: 1, title: 'Aporias ', id: 'A' },
  { entryCount: 1, title: 'Archive Fever ', id: 'AF' },
  { entryCount: 1, title: 'Death Penalty: Volume I ', id: 'DPi' },
  { entryCount: 1, title: 'Des Tours Des Babel ', id: 'TB' },
  { entryCount: 1, title: 'Ends of Man ', id: 'EM' },
  { entryCount: 1, title: 'For What Tomorrow… ', id: 'FWT' },
  { entryCount: 1, title: 'Memoires for Paul de Man ', id: 'MPM' },
  { entryCount: 1, title: 'Of Spirit: Heidegger and the Question ', id: 'S' },
  { entryCount: 1, title: '<em>Pas </em>', id: 'PAS' },
  { entryCount: 1, title: 'Plato’s Pharmacy ', id: 'PP' },
  { entryCount: 1, title: 'Psyche: Invention of the Other ', id: 'PIO' },
  { entryCount: 1, title: 'Resistances of Psychoanalysis ', id: 'ROP' },
  { entryCount: 1, title: 'Specters of Marx ', id: 'SPOM' },
  { entryCount: 1, title: 'The <em>Retrait</em> of Metaphor ', id: 'RM' },
  { entryCount: 1, title: 'White Mythology ', id: 'WM' },
  */
