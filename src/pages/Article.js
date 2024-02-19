import React, { useEffect, useState } from 'react'
import { A } from 'hookrouter'
import toast from '../toast'
import DataGrid from '../components/DataGrid';
import DeleteIcon from '@material-ui/icons/Delete'
import SearchIcon from '@material-ui/icons/Search'
import CheckIcon from '@material-ui/icons/CheckSharp'
import CachedOutlinedIcon from '@material-ui/icons/CachedOutlined'
import IconButton from '@material-ui/core/IconButton'
import { getCategories } from '../api/category'
import { updateArticles, deleteArticle, reloadArticle, getArticles } from '../api/article';
import { findJournal } from '../api/jounal';

const Article = () => {
  let [articles, setArticles] = useState([]);
  const [rows, setRows] = useState([]);
  let [searchText, setSearchText] = useState('');
  let [filterModel, setFilterModel] = useState({ items: [] });
  let [confirmedCond, setConfirmedCond] = useState(false);
  let [classifiedCond, setClassifiedCond] = useState(false);
  let [allCond, setAllCond] = useState(true);

  let [categories, setCategories] = useState([]);

  const checkPublication = async (venue) => {
    let { data: checkResults } = await findJournal(venue);
    let newRows = rows.map(r => ((r.venue === venue) ? Object.assign({}, r, checkResults) : r));
    setRows(newRows);
  }
  function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = articles.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(('' + row[field]));
      }) && (allCond || confirmedCond && row.classified || !confirmedCond && (!row.classified)) && (allCond || (classifiedCond && row.categoryId > 1) || (!classifiedCond && row.categoryId === 1));
    });
    setRows(filteredRows);
  };

  const handleCellChanged = ({ id, field, props }) => {
    const body = {}
    let value = props.value;
    if (field === 'publicationDate') {
      let v = Date.parse(props.value);
      if (isNaN(v)) {
        setRows(rows.map(r => r));
        return toast.error(
          'Wrong date format. Should be "yyyy/mm/dd"',
          { autoClose: 3000 }
        );
      }
    }
    let row = rows.find(r => r.id === id);
    row[field] = value;
    body[field] = value
    updateArticles(body, id);
    setRows(rows.map(r => r));
  }

  const categoryChanged = (event) => {
    let articleId = +event.target.dataset.params_id;
    let row = rows.find(r => r.id === articleId);
    row.categoryId = +event.target.value;
    row.classified = true;
    row.classifiedType = 1;
    updateArticles({ categoryId: row.categoryId, classified: true, classifiedType: row.classifiedType }, articleId);
    setRows(rows.map(r => r));
  }

  const toggleConfirm = (articleId, classified) => {
    let row = rows.find(r => r.id === articleId);
    row.classified = !classified;
    updateArticles({ classified: row.classified }, articleId);
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

  const getOriginalCategory = (id) => {
    const mappingCategory = categories.filter(category => category.id === id);
    return mappingCategory[0] ? mappingCategory[0].name : '';
  }

  const reloadTable = async () => {
    const { data } = await getArticles();
    const dataRows = data.map(r => ({ ...r, categoryName: r.category.name, authorCnt: r.authors.split(',').length, researchHours: r.category.researchHours }));
    setArticles(dataRows);
    setRows(dataRows);
  }

  const getCates = async () => {
    const { data: categories } = await getCategories()
    setCategories(categories)
  }

  const defaultStyle = {
    color: 'white',
    display: 'inline-block',
    lineHeight: '24px',
    verticalAlign: 'middle',
    borderRadius: '4px',
    padding: '0 0.5em',
    margin: '0 3px'
  }
  const negativeStyle = {
    backgroundColor: '#ccc',
    border: '1px solid #ccc',
  }
  const positiveStyle = {
    backgroundColor: '#080',
    border: '1px solid #080',
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'authorName',
      headerName: 'Author',
      width: 180
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 260,
      renderCell: (params) => {
        return (
          <div>
            <IconButton onClick={() => {
              setFilterModel({
                items: [{ columnField: 'title', operatorValue: 'equals', value: params.getValue('title') }]
              })
            }}>
              <SearchIcon />
            </IconButton>
            <a
              target="_blank"
              rel="noreferrer"
              className="overflow"
              title={params.getValue('title')}
              href={params.getValue('citedUrl')}>
              {params.getValue('title')}
            </a>
          </div>
        )
      },
    },
    {
      headerName: 'Category',
      field: 'categoryName',
      width: 200,
      sortable: false,
      renderCell: (params) => {
        return (
          <select style={{ width: '100%', border: 'none', height: '80%', color: params.getValue('classified') ? 'green' : 'red' }}
            data-params_id={params.getValue('id')}
            value={params.getValue('categoryId')}
            onChange={categoryChanged}>
            {categories.map(c => (<option value={c.id}>{c.name}</option>))}
          </select>
        )
      },
    },
    {
      headerName: 'Original Category',
      field: 'originalCategory',
      width: 200,
      sortable: false,
      renderCell: (params) => {
        return (
          <div>{getOriginalCategory(params.getValue('originalCategory'))}</div>
        )
      },
    },
    {
      headerName: 'Confirm',
      field: 'classified',
      width: 100,
      sortable: false,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => toggleConfirm(params.getValue('id'), params.getValue('classified'))}
            style={params.getValue('classified') ? { color: "green" } : { color: "#ccc" }}>
            <CheckIcon />
          </IconButton>
        )
      },
    },
    {
      field: 'publicationDate',
      editable: true,
      headerName: 'Publication Date',
      width: 140
    },
    {
      field: 'venue',
      headerName: 'Publication',
      editable: true,
      width: 650,
      renderCell: (params) => {
        return (
          <div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <IconButton color="primary" onClick={() => {
              setFilterModel({
                items: [{ columnField: 'venue', operatorValue: 'equals', value: params.getValue('venue') }]
              })
            }}>
              <SearchIcon />
            </IconButton>
            <a style={{
              backgroundColor: '#E77642',
              border: '1px solid #E77642',
              borderRadius: '4px',
              ...defaultStyle
            }}
              href={encodeURI(`https://www.scimagojr.com/journalsearch.php?q=${params.getValue('venue')}`)}
              target="_blank" rel="noreferrer">SCJ
            </a>
            <button style={params.getValue('isISI') ? { ...defaultStyle, ...positiveStyle } : { ...defaultStyle, ...negativeStyle }}
              onClick={() => checkPublication(params.getValue('venue'))}>ISI
            </button>
            <button style={params.getValue('isSCOPUS') ? { ...defaultStyle, ...positiveStyle } : { ...defaultStyle, ...negativeStyle }}
              onClick={() => checkPublication(params.getValue('venue'))}>SCOPUS
            </button>
            {params.getValue('venue')}
          </div>
        )
      },
    },
    {
      field: "publisher",
      width: 400,
      renderCell: (params) => (
        <div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }} title={params.getValue('publisher')}>
          {params.getValue('publisher')}
        </div>
      )
    },
    {
      field: 'authorCnt',
      headerName: 'Author Count',
      width: 70,
      editable: false
    },
    {
      field: 'authors',
      headerName: 'Authors',
      width: 270,
    },
    {
      field: 'researchHours',
      headerName: 'Giờ NCKH',
      width: 100
    },
    {
      field: 'citedCount',
      headerName: 'Cited',
      width: 100,
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
                  pageSize={10}
                  filterModel={filterModel}
                  onFilterModelChange={(params) => {
                    params.api.setPage(0);
                  }}
                  clearSearchTextFn={() => requestSearch('')}
                  clearFilterFn={() => {
                    setFilterModel({ items: [] })
                  }}
                  filterText={searchText}
                  filterTextChangeFn={(event) => requestSearch(event.target.value)}
                  all={allCond}
                  confirmed={confirmedCond}
                  classified={classifiedCond}
                  toggleAll={() => {
                    allCond = !allCond;
                    setAllCond(allCond);
                    requestSearch(searchText);
                  }}
                  toggleConfirmed={() => {
                    allCond = false;
                    setAllCond(allCond);
                    confirmedCond = !confirmedCond;
                    setConfirmedCond(confirmedCond)
                    requestSearch(searchText);
                  }}
                  toggleClassified={() => {
                    allCond = false;
                    setAllCond(allCond);
                    classifiedCond = !classifiedCond;
                    setClassifiedCond(classifiedCond);
                    requestSearch(searchText);
                  }}
                  onEditCellChangeCommitted={handleCellChanged}
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
