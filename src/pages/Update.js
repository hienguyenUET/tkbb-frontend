import {useRef} from 'react';
import { A } from 'hookrouter'
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import {uploadJournalList} from '../api';
export default function Update() {
  const isiFileRef = useRef('');
  const scopusFileRef = useRef('');
  return (
    <div className="content-wrapper">

      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Update Journal DB</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right nav-links">
                <li className="breadcrumb-item"><A href="/" >Home</A></li>
                <li className="breadcrumb-item active">Update</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-3">ISI Journals:</div>
            <div className="col-sm-4"><input accept=".csv" type="file" ref={isiFileRef} /></div>
            <div className="col-sm-2">
              <Button variant="contained" color="primary" component="span" size="small" startIcon={<CloudUploadIcon />}
                onClick={() => uploadJournalList('isi', isiFileRef.current.files[0]) }>Upload ISI </Button>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-sm-3">SCOPUS Journals:</div>
            <div className="col-sm-4"><input accept=".csv" type="file" ref={scopusFileRef} /></div>
            <div className="col-sm-2">
              <Button variant="contained" color="primary" component="span" size="small" startIcon={<CloudUploadIcon />}
                onClick={() => uploadJournalList('scopus', scopusFileRef.current.files[0]) }>Upload SCOPUS</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
