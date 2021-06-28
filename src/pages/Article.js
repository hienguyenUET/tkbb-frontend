import React, { useEffect, useState, useRef } from 'react'
import { A } from 'hookrouter'
import { DataGrid, GridToolbar } from '@material-ui/data-grid'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import useModal from '../hooks/useModal'
import Modal from '../components/Modal'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { getArticles, updateArticles, getPublishcation } from '../api'

export const fontStacks = [
    {
        type: 'group',
        name: 'Sans serif',
        items: [
            { name: 'Roboto', value: 'Roboto', stack: 'Roboto, sans-serif' },
            { name: 'Helvetica', value: 'Helvetica', stack: 'Helvetica, sans-serif' },
        ],
    },
    {
        type: 'group',
        name: 'Serif',
        items: [
            { name: 'Playfair Display', value: 'Playfair Display', stack: '"Playfair Display", serif' },
        ],
    },
    {
        type: 'group',
        name: 'Cursive',
        items: [
            { name: 'Monoton', value: 'Monoton', stack: 'Monoton, cursive' },
            { name: 'Gloria Hallelujah', value: '"Gloria Hallelujah", cursive', stack: '"Gloria Hallelujah", cursive' },
        ],
    },
    {
        type: 'group',
        name: 'Monospace',
        items: [
            { name: 'VT323', value: 'VT323', stack: 'VT323, monospace' },
        ],
    },
];


const Article = props => {
  const [rows, setRows] = useState([])
  const { isShowing, toggle } = useModal()
  const [open, setOpen] = useState(false)
  const [uArticleId, setUArticleId] = useState('')
  const [fullWidth, setFullWidth] = React.useState(true)
  const [maxWidth, setMaxWidth] = React.useState('sm')
  const [pubs, setPubs] = useState()
  const [pubSelectValue, setPubSelectValue] = useState('')
  const [uPubSelect, setUPubSelect] = useState({})

  const handleClickOpen = (articelId) => {
    setUArticleId(articelId)
    setOpen(true)
  }

  const handleSubmit = async () => {
    const body = {
      pubId: uPubSelect.id,
    }

    await updateArticles(body, uArticleId)
    reloadArticle()
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const reloadArticle = async () => {
    const { data: articles } = await getArticles()

    setRows(articles)
  }

  const getPubs = async () => {
    const { data: pubData } = await getPublishcation()
    setPubs(pubData.map(e => {
      return {
        title: e.name, 
        id: e.id,
      }
    }))
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'authorName',
      headerName: 'Author',
      width: 160,
      // renderCell: (params) => {
      //   return (
      //     <div>
      //       {params.getValue('user').fullName}
      //     </div>
      //   )
      // },
    },
    {
      field: 'authors',
      headerName: 'Authors Count',
      width: 150,
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
              className="overflow"
              href={'https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=' + params.getValue('title')}
            >
              {params.getValue('title')}
            </a>
          </div>
        )
      },
    },
    {
      field: 'year',
      headerName: 'Year',
      width: 160,
    },
    {
      field: 'citedCount',
      headerName: 'Cited Count',
      width: 150,
    },
    {
      headerName: 'Publishcation classify',
      field: 'publishcation',
      width: 500,
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="row">
            <IconButton
              color="primary"
              onClick={() => handleClickOpen(params.getValue('id'))}
            >
              <EditIcon />
            </IconButton>
            {params.getValue('publishcation') ? params.getValue('publishcation').name : <p className="text-warning">--</p>}
          </div>
        )
      },
    },
    {
      field: 'publisher',
      headerName: 'Publishcation Raw',
      width: 700,
      renderCell: (params) => {
        return (
          <div className="row">
            {params.getValue('publisher')}
          </div>
        )
      },
    },
    {
      field: 'createdAt',
      headerName: 'Create time',
      renderCell: (params) => {
        const date = new Date(params.getValue('createdAt'))

        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const dt = date.getDate()

        return (
          <div className="row">{`${dt}/${month}/${year}`}</div>
        )
      },
    },
  ]

  useEffect(() => {
    reloadArticle()
    getPubs()
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
                  components={{
                    Toolbar: GridToolbar
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Dialog 
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          open={open} 
          onClose={handleClose} 
          aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent >
          <DialogContentText>
            Update publication classify
          </DialogContentText>
          <Autocomplete
            id="combo-box-demo"
            className="m-1"
            value={uPubSelect}
            onChange={(e, newUPubSelect) => {
              setUPubSelect(newUPubSelect)
            }}
            inputValue={pubSelectValue}
            onInputChange={(event, newInputValue) => {
              setPubSelectValue(newInputValue)
            }}
            options={pubs}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => <TextField {...params} label="Publications" variant="outlined" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Article
