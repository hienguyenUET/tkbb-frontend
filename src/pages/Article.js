import React, { useEffect, useState } from 'react'
import { A } from 'hookrouter'
import { DataGrid, GridToolbar } from '@material-ui/data-grid'
import DeleteIcon from '@material-ui/icons/Delete'
import SearchIcon from '@material-ui/icons/Search'
import CachedOutlinedIcon from '@material-ui/icons/CachedOutlined'
import IconButton from '@material-ui/core/IconButton'
import { deleteArticle, reloadArticle, getArticles, updateArticles, getCategories } from '../api'

const Article = props => {
  const [rows, setRows] = useState([]);
  let [filterModel, setFilterModel] = useState({items: []});

  let [categories, setCategories] = useState([]);

  const categoryChanged = (event) => {
    let articleId = +event.target.dataset.params_id;
    let row = rows.find(r => r.id === articleId);
    row.categoryId = +event.target.value;
    updateArticles({categoryId: row.categoryId}, articleId);
    setRows(rows.map(r => r));
  }

  const handleRefreshArticle = async (id) => {
    await reloadArticle(id);
    await reloadTable()
  }

  const handleDeleteArticle = async (id) => {
    await deleteArticle(id);
    await reloadTable()
  }

  const reloadTable = async () => {
    const { data: articles } = await getArticles()
    setRows(articles)
  }

  const getCates = async () => {
    const { data: categories } = await getCategories()
    setCategories(categories)
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'authorName',
      headerName: 'Author',
      width: 180
    },
    {
      field: 'authors',
      headerName: 'Authors Count',
      width: 70,
      renderCell: (params) => {
        return (
          <div>
            {params.getValue('authors').split(',').length}
          </div>
        )
      },
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 260,
      renderCell: (params) => {
        return (
          <div>
            <a
              target="_blank"
              rel="noreferrer"
              className="overflow"
              title={params.getValue('title')}
              href={params.getValue('citedUrl')}
            >
              {params.getValue('title')}
            </a>
          </div>
        )
      },
    },
    {
      field: 'publicationDate',
      headerName: 'Publication Date',
      width: 140
    },
    {
      field: 'citedCount',
      headerName: 'Cited',
      width: 100,
    },
    {
      headerName: 'Category',
      field: 'category',
      width: 200,
      sortable: false,
      renderCell: (params) => {
        return (
          <select style={{width: '100%', border: 'none', height: '80%', color: (+params.getValue('categoryId') > 1)?'green':'red'}} data-params_id={params.getValue('id')} 
            value={params.getValue('categoryId')}
            onChange={categoryChanged}>
            { categories.map(c => (<option value={c.id}>{c.name}</option>)) }
          </select>
        )
      },
    },
    {
      field: 'venue',
      headerName: 'Publication',
      width: 450,
      renderCell: (params) => {
        return (
          <div style={{width: '100%', overflow:'hidden', textOverflow: 'ellipsis'}}>
            <IconButton color="primary" onClick={() => setFilterModel({
                items: [{columnField: 'venue', operatorValue: 'equals', value: params.getValue('venue')}]
            })}>
              <SearchIcon />
            </IconButton>
            <a href={encodeURI(`https://www.scimagojr.com/journalsearch.php?q=${params.getValue('venue')}`)} target="_blank" rel="noreferrer">{params.getValue('venue')}</a>
          </div>
        )
      },
    },
    {
      field: "publisher",
      width: 400,
      renderCell: (params) => (
          <div style={{width: '100%', overflow:'hidden', textOverflow: 'ellipsis'}} title={params.getValue('publisher')}>
            {params.getValue('publisher')}
          </div>
        )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
          <div>
            <IconButton color="primary" onClick={() => handleRefreshArticle(params.getValue('id'))}>
              <CachedOutlinedIcon />
            </IconButton>
            <IconButton color="secondary" onClick={() => handleDeleteArticle(params.getValue('id'))}>
              <DeleteIcon />
            </IconButton>
          </div>
      )
    }
  ]

  useEffect(() => {
    reloadTable();
    getCates();
  }, [])

  return (
    <div>
      <div className="content-wrapper">

        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Articles</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right nav-links">
                  <li className="breadcrumb-item"><A href="/" >Home</A></li>
                  <li className="breadcrumb-item active">Article</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">

            <div>

              <div style={{ height: 700, width: '100%', backgroundColor: '#fff' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={30}
                  components={{
                    Toolbar: GridToolbar
                  }}
                  filterModel={filterModel}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Article
