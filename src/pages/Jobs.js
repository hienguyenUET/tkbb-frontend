import React from 'react'
import Iframe from 'react-iframe'
import { A } from 'hookrouter'
const Jobs = props => {
  return (
      <div className="content-wrapper">

        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Job Tracking</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right nav-links">
                  <li className="breadcrumb-item"><A href="/jobs" >Home</A></li>
                  <li className="breadcrumb-item active">Jobs</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
            <Iframe
              url="http://112.137.129.214:35280/queues/queue/crawlGS"
              width="100%"
              height="592px"
            />
        </section>
      </div>
  )
}
export default Jobs;
