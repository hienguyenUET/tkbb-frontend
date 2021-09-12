export default function Oveview() {
  return (
    <div className="content-wrapper">
      <iframe title="overviewreport" style={{
              height: 'calc(100vh - 120px)', 
              position: 'relative', 
              left: '-60px', 
              width: 'calc(100% + 60px)'
          }}
          src="/grafana/d/uKjnJiS7z/thong-ke-nghien-cuu?orgId=1&theme=light" frameborder="0">
      </iframe>
    </div>
  )
}
