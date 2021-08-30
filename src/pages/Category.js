import React from 'react'
import { DataGrid, GridToolbar } from '@material-ui/data-grid'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Modal from 'react-bootstrap/Modal'

import { getCategories, deleteCategory, createCategory, updateCategory } from '../api';

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      description: null,
      researchHours: 300,
      creating: false,
      rows: []
    }
    this.doCreateCategory = this.doCreateCategory.bind(this);
    this.reloadTable = this.reloadTable.bind(this);
    this.onCellChanged = this.onCellChanged.bind(this);
    this.columns = [
      { field: 'id', headerName: 'ID', width: 70 },
      {
        field: 'name',
        headerName: 'Name',
        width: 300,
        editable: true
      },
      {
        field: 'description',
        headerName: 'Description',
        width: 600,
        editable: true,
        renderCell: (params) => {
          return (
            <div title={params.getValue('description')}>
              {params.getValue('description')}
            </div>
          )
        },
      },
      {
        field: 'researchHours',
        headerName: 'KPI',
        width: 100,
        editable: true
      },
      {
        headerName: "Actions",
        field: "actions",
        sortable: false,
        width: 100,
        renderCell: (params) => {
          return (
            <div>
              <IconButton
                color="secondary"
                onClick={async () => {
                  await deleteCategory(params.getValue('id'));
                  await this.reloadTable();
                }}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          )
        },
      }
    ]
  }
  async onCellChanged({id, field, props}) {
    const { data: changed } = await updateCategory(id, {[field]: props.value});
    console.log(changed);
  }
  async doCreateCategory() {
    const body = {
      name: this.state.name,
      description: this.state.description,
      researchHours: this.state.researchHours,
    }

    await createCategory(body)
    this.setState({creating: false});
    this.reloadTable();
  }
  async reloadTable() {
    const { data: categories } = await getCategories();
    this.setState({
      rows: categories
    });
  }
  componentDidMount() {
    this.reloadTable()
  }
  render() {
    return (
      <div>
        <div className="content-wrapper">

          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1 className="m-0">Category</h1>
                </div>
              </div>
            </div>
          </div>

          <section className="content">
            <div className="container-fluid">
              <div className="text-right">
                <Button variant="contained" color="primary"
                  size="small" className="ml-1" startIcon={<AddIcon />}
                  onClick={() => this.setState({creating:true})}
                >Create Category</Button>
              </div>
              <div>
                <div style={{ height: 700, width: '100%', backgroundColor: '#fff' }}>
                  {<DataGrid
                    rows={this.state.rows}
                    columns={this.columns}
                    pageSize={20}
                    components={{
                      Toolbar: GridToolbar
                    }} 
                    onEditCellChangeCommitted={this.onCellChanged} />}
                </div>
              </div>
            </div>
            <Modal show={this.state.creating} onHide={() => this.setState({creating:false})}>
              <Modal.Header closeButton>
                <Modal.Title>New Category</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <input
                    className="form-control m-1"
                    placeholder="Category Name"
                    type="text"
                    value={this.state.name}
                    onChange={(evt) => this.setState({name: evt.target.value})}
                  />
                  <input
                    className="form-control m-1"
                    placeholder="Description"
                    type="text"
                    value={this.state.description}
                    onChange={(evt) => this.setState({description: evt.target.value})}
                  />
                  <input
                    className="form-control m-1"
                    placeholder="Research Hours"
                    type="number"
                    value={this.state.researchHours}
                    onChange={(evt) => this.setState({researchHours: evt.target.value})}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="contained" className="mr-2" color="secondary" onClick={() => this.setState({creating:false})}>
                  Close
                    </Button>
                <Button variant="contained" color="primary" onClick={this.doCreateCategory}>
                  Create
                    </Button>
              </Modal.Footer>
            </Modal>
          </section>
        </div>
      </div>
    )
  }
}
export default Category
