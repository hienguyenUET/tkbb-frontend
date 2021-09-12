import { useState, useEffect } from 'react'
import { 
  DataGrid, 
  GridToolbarExport
} from '@material-ui/data-grid'
import Button from '@material-ui/core/Button'
import { queryArticles, getCategories, getFaculties } from '../api';

function CustomGridToolbar(props) {
  const commonStyle = {
    border: '1px solid #ccc',
    marginRight: '3px'
  }
  const selectStyle = {
    padding: '3px',
    ...commonStyle
  }
  return (
    <div>
      <div>
        <GridToolbarExport />
        <select style={selectStyle} value={props.faculty} onChange={props.facultyChangeFn}>
          <option value={0}>--Any faculty--</option>
          {
            props.faculties.map(f => (<option value={f.faculty}>{f.faculty}</option>))
          }
        </select>
        <select style={selectStyle} value={props.category} onChange={props.categoryChangeFn}>
          <option value={0}>--Any category--</option>
          {
            props.categories.map(c => (<option value={c.id}>{c.name}</option>))
          }
        </select>
        <input style={commonStyle} type="date" value={props.startDate} onChange={props.startDateChangeFn} placeholder="From" />
        <input style={commonStyle} type="date" value={props.endDate} onChange={props.endDateChangeFn} placeholder="To" />
        <Button onClick={props.applyFilterFn}>Apply</Button>
      </div>
    </div>
  )
}

export default function Report() {
  const [faculties, setFaculties] = useState(['Khoa CNTT', 'Khoa DTVT']);
  const [categories, setCategories] = useState(['ISI Q1/Q2', 'ISI Q3/Q4']);
  const [faculty, setFaculty] = useState(null);
  const [category, setCategory] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rows, setRows] = useState([]);
  const reloadTable = async (criteria) => {
    console.log('Reload table');
    const { data: articles } = await queryArticles(criteria)
    setRows(articles);
  }
  useEffect(() => {
    (async () => {
      let { data: _faculties } = await getFaculties();
      setFaculties(_faculties);
      let { data: cats } = await getCategories()
      setCategories(cats);
    })()
  }, []);

  const columns = [
    {field: 'id', headerName: 'ID', width: 70},
    {field: 'authors', headerName: "Authors", width: 400},
    {field: 'title', headerName: 'Title', width: 700},
    {field: 'venue', headerName: 'Publication', width: 500},
    {field: 'publisher', headerName: 'Publisher', width: 120},
    {field: 'publicationDate', headerName:'Pub. Date', width: 120}, 
    {field: 'faculty', headerName: 'Faculty', width: 150},
    {field: 'category', headerName: 'Category', width: 150}
  ]
  return (
    <div className="content-wrapper">

      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Danh mục bài báo</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="text-right">
          </div>
          <div style={{ height: 700, width: '100%', backgroundColor: '#fff' }}>
            <DataGrid 
              rows={rows} columns={columns} pageSize={10}
              components={{ Toolbar: CustomGridToolbar }}
              componentsProps={{ 
                toolbar: {
                  faculties, categories, faculty, category, startDate, endDate,
                  facultyChangeFn: (evt) => setFaculty((evt.target.value !== '0')?evt.target.value:undefined),
                  categoryChangeFn: (evt) => setCategory((evt.target.value !== '0')?evt.target.value:undefined),
                  startDateChangeFn: (evt) => setStartDate(evt.target.value),
                  endDateChangeFn: (evt) => setEndDate(evt.target.value),
                  applyFilterFn: () => { 
                    console.log(faculty, category, startDate, endDate);
                    reloadTable({faculty, category, startDate, endDate});
                  }
                }
              }}/>
          </div>
        </div>
      </section>
    </div>
  )
}
