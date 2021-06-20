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

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
  { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  { title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 },
];

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
