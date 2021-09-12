import { GridToolbar } from '@material-ui/data-grid'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import DeleteSweepOutlinedIcon from '@material-ui/icons/DeleteSweepOutlined'
import SearchIcon from '@material-ui/icons/Search'
import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input'

function MyGridToolbar(props) {
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
    <Button size="small" onClick={ props.clearFilter }>
      <DeleteSweepOutlinedIcon />Clear Filter
    </Button>
  </div>)
}
export default MyGridToolbar;
