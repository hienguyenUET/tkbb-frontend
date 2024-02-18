import { GridToolbar } from '@material-ui/data-grid'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'
import Input from '@material-ui/core/Input'

function ScholarGridToolbar(props) {
  return (<div style={{display:'flex', flexDirection:'row', alignItems: 'center'}}>
    <GridToolbar />
    <SearchIcon />
    <Input
        size="small"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
      />
    <IconButton onClick={props.clearSearchText}>
      <CloseIcon />
    </IconButton>
    <FormControlLabel style={{marginBottom: 0}} control={<Switch checked={props.errorOnly} onChange={props.toggleErrorOnly} color="primary" />} label={props.errorOnly?"Error Only":"All"} />
  </div>)
}
export default ScholarGridToolbar;

