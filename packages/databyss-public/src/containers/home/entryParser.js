import axios from 'axios'

export const entryParser = ({ entries, source, author }) => {
  const res = getEntriesList(entries).then(e => {
    return {
      title: source.resource,
      display: e.abbreviation ? e.abbreviation : 'ABV',
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

export const getEntriesList = entries => {
  const promises = entries.map(async e => {
    const entryRes = await axios.get(`/api/entries/${e}`)
    return entryRes.data
  })
  return Promise.all(promises)
}

export const entries = [
  {
    title: 'Spectors of Marx',
    display: 'SPOM',
    locations: [
      {
        raw: 'p. 106',
        entries: [
          {
            content:
              'Derrida less concerned w/ art of Plato [re: <em>mises en abyme</em> of <em>khōra</em> and politics] but in a constraint, a <em>programme</em>, the being-programme of the programme, the being-logical of logic: Plato apprehends them as such, though in a dream, put <em>en abyme</em>'
          }
        ]
      },
      {
        raw: 'p.27',
        entries: [
          {
            starred: true,
            content:
              ' analogy of abyss &amp; bridge over abyss require 3rd term, that which heals the gap, a symbol, bridge is symbol, symbol bridge &gt; abyss calls for analogy (active resource of <em>Critique</em>), <em>mais l’analogie s’abîme sans fin dès lors qu’il faut bien un certain art pour décrire analogiquement le jeu de l’analogie</em>'
          }
        ]
      },
      {
        raw: 'p. 106',
        entries: [
          {
            content:
              'Derrida less concerned w/ art of Plato [re: <em>mises en abyme</em> of <em>khōra</em> and politics] but in a constraint, a <em>programme</em>, the being-programme of the programme, the being-logical of logic: Plato apprehends them as such, though in a dream, put <em>en abyme</em>'
          }
        ]
      },
      {
        raw: 'p.27',
        entries: [
          {
            starred: true,
            content:
              ' analogy of abyss &amp; bridge over abyss require 3rd term, that which heals the gap, a symbol, bridge is symbol, symbol bridge &gt; abyss calls for analogy (active resource of <em>Critique</em>), <em>mais l’analogie s’abîme sans fin dès lors qu’il faut bien un certain art pour décrire analogiquement le jeu de l’analogie</em>'
          }
        ]
      },
      {
        raw: 'p. 106',
        entries: [
          {
            content:
              'Derrida less concerned w/ art of Plato [re: <em>mises en abyme</em> of <em>khōra</em> and politics] but in a constraint, a <em>programme</em>, the being-programme of the programme, the being-logical of logic: Plato apprehends them as such, though in a dream, put <em>en abyme</em>'
          }
        ]
      },
      {
        raw: 'p.27',
        entries: [
          {
            starred: true,
            content:
              ' analogy of abyss &amp; bridge over abyss require 3rd term, that which heals the gap, a symbol, bridge is symbol, symbol bridge &gt; abyss calls for analogy (active resource of <em>Critique</em>), <em>mais l’analogie s’abîme sans fin dès lors qu’il faut bien un certain art pour décrire analogiquement le jeu de l’analogie</em>'
          }
        ]
      },
      {
        raw: 'p. 106',
        entries: [
          {
            content:
              'Derrida less concerned w/ art of Plato [re: <em>mises en abyme</em> of <em>khōra</em> and politics] but in a constraint, a <em>programme</em>, the being-programme of the programme, the being-logical of logic: Plato apprehends them as such, though in a dream, put <em>en abyme</em>'
          }
        ]
      },
      {
        raw: 'p.27',
        entries: [
          {
            starred: true,
            content:
              ' analogy of abyss &amp; bridge over abyss require 3rd term, that which heals the gap, a symbol, bridge is symbol, symbol bridge &gt; abyss calls for analogy (active resource of <em>Critique</em>), <em>mais l’analogie s’abîme sans fin dès lors qu’il faut bien un certain art pour décrire analogiquement le jeu de l’analogie</em>'
          }
        ]
      },
      {
        raw: 'p. 106',
        entries: [
          {
            content:
              'Derrida less concerned w/ art of Plato [re: <em>mises en abyme</em> of <em>khōra</em> and politics] but in a constraint, a <em>programme</em>, the being-programme of the programme, the being-logical of logic: Plato apprehends them as such, though in a dream, put <em>en abyme</em>'
          }
        ]
      },
      {
        raw: 'p.27',
        entries: [
          {
            starred: true,
            content:
              ' analogy of abyss &amp; bridge over abyss require 3rd term, that which heals the gap, a symbol, bridge is symbol, symbol bridge &gt; abyss calls for analogy (active resource of <em>Critique</em>), <em>mais l’analogie s’abîme sans fin dès lors qu’il faut bien un certain art pour décrire analogiquement le jeu de l’analogie</em>'
          }
        ]
      },
      {
        raw: 'p. 106',
        entries: [
          {
            content:
              'Derrida less concerned w/ art of Plato [re: <em>mises en abyme</em> of <em>khōra</em> and politics] but in a constraint, a <em>programme</em>, the being-programme of the programme, the being-logical of logic: Plato apprehends them as such, though in a dream, put <em>en abyme</em>'
          }
        ]
      },
      {
        raw: 'p.27',
        entries: [
          {
            starred: true,
            content:
              ' analogy of abyss &amp; bridge over abyss require 3rd term, that which heals the gap, a symbol, bridge is symbol, symbol bridge &gt; abyss calls for analogy (active resource of <em>Critique</em>), <em>mais l’analogie s’abîme sans fin dès lors qu’il faut bien un certain art pour décrire analogiquement le jeu de l’analogie</em>'
          }
        ]
      }
    ]
  },
  {
    title: 'Cosmopolitanism and Forgiveness',
    display: 'CF',
    locations: [
      {
        raw: 'p. 50',
        entries: [
          {
            content:
              'must forgiveness saturate the abyss (suture, reconcile)? but who could object to imperative of reconciliation? amnesties, work of mourning—political strategy, psycho-therapeutic economy'
          }
        ]
      },
      {
        raw: 'pp. 53-54',
        entries: [
          {
            content:
              'when not insoluble, when I know what to do (program), no decision or responsibility'
          },
          {
            content: 'an abyss remains and must remain'
          }
        ]
      }
    ]
  }
]
