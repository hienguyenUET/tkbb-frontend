export default function Yearly() {
  return (
    <div className="content-wrapper">
      <iframe title="yearlyreport" style={{
              height: 'calc(100vh - 120px)', 
              position: 'relative', 
              left: '-60px', 
              width: 'calc(100% + 60px)'
          }}
          src="/grafana/d/QEDeRFInk/thong-ke-theo-nam?orgId=1&theme=light" frameborder="0">
      </iframe>
    </div>
  )
}
