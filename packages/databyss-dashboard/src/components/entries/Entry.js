import React, { Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom'
import BackButton from './../buttons/BackButton'
import Spinner from '../layout/Spinner'
import SourceItem from './../sources/SourceItem'
import AuthorItem from './../authors/AuthorItem'
import { getEntry } from '../../actions/entry'
import { getSource } from '../../actions/source'

const Entry = ({ match }) => {
  const dispatch = useDispatch()
  useEffect(
    () => {
      dispatch(getEntry(match.params.id))
    },
    [dispatch, match.params.id]
  )

  const { entry, loading } = useSelector(state => state.entry)

  const { source } = useSelector(state => state.source)

  useEffect(
    () => {
      if (entry) {
        dispatch(getSource(entry.source))
      }
    },
    [entry, dispatch]
  )

  const [render, setRender] = useState({})

  useEffect(
    () => {
      if (entry) {
        const authorList = entry.author.map(async id => {
          const res = await axios.get(`/api/authors/${id}`)
          return res.data
        })
        Promise.all(authorList).then(list =>
          setRender(r => ({ ...r, list: list }))
        )
      }
    },
    [entry]
  )

  useEffect(
    () => {
      if (render.list) {
        let list = render.list.map(a => <AuthorItem key={a._id} author={a} />)
        setRender(r => ({ ...r, authors: list }))
      }
    },
    [render.list]
  )

  return loading || source === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <BackButton />
      <div className="dash-buttons p-1">
        <Link to={`/entries/edit/${source._id}`} className="btn btn-light">
          <i className="fas fa-user-circle text-primary" /> Edit Entry
        </Link>
      </div>

      <h1 className="lead text-dark">Entry: </h1>
      <div className="post bg-white p-1 my-1">
        <p>
          page(s): {entry && entry.pageFrom}
          {entry && entry.pageTo > 0 && '-' + entry.pageTo}
        </p>
        <p>{entry && entry.entry}</p>
      </div>
      <div className="m-2">
        <h3>Authors</h3>
        {render.authors && render.authors}
      </div>
      <div className="m-2">
        <h3>Source</h3>
        <div className="profile-grid">
          {source && <SourceItem source={source} />}
        </div>
      </div>
    </Fragment>
  )
}

export default Entry
