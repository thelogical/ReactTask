import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CSVReader from 'react-csv-reader'
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';


//this was in material UI documentation
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function MyDialog(props) {
  //Initialize component state variables
  const classes = useStyles();
  const [frm,setfrm] = React.useState(null);
  const [selected,setselected] = React.useState([]);
  const [dt,setdt] = React.useState(null);
  const [tbname,setname] = React.useState("default");
  const [p_key, setp_key] = React.useState([]);
  const [disabled, setdisabled] = React.useState([]);
  const datatypes = [
  {
    value: 'varchar',
    label: 'varchar',
  },
  {
    value: 'int',
    label: 'int',
  },
  {
    value: 'float',
    label: 'float',
  },
  {
    value: 'timestamp',
    label: 'timestamp',
  },
  {
    value: 'date',
    label: 'date',
  },
  {
    value: 'time',
    label: 'time',
  },
  {
    value: 'datetime',
    label: 'datetime',
  },
  {
    value: 'interval',
    label: 'interval',
  },
];

  //set the datatype chosen by user for a column in UI
  const handleChange = (event,index) => {
    var f = selected;
    f[index] = event.target.value;
    setselected(f);
  };

  //function to save data and update parent component
  const handleClose = () => {
    var r = props.rw;
    r.Schema = "Set";
    r.tablename = tbname;
    //get default tabledata at a row
    //props.data has data for all rows
    var newtabledata = props.data.map((item,key) => item.Sno === r.Sno ? r : item);
    props.setdata(newtabledata);
    var ts = {name: tbname,data: dt,schema: selected};
    var nwschema = props.schema.map((item,index) => index + 1 === r.Sno ? ts : item);
    props.setschema(nwschema);
    //reset this component variables
    setfrm(null);
    setselected([]);
    props.setopen(false);
  };

  //triggered on cancel
  const handleCancelClose = () => {
    setfrm(null);
    setselected([]);
    props.setopen(false);
  };

  //This sets the table name typed by user in UI
  const handleNameChange = (e) => {
    setname(e.target.value);
  }

  const toggle = (e,index) => {
    var p = p_key;
    console.log(p_key.length);
    p[index] = !e.target.checked;
    setp_key([...p]);
  }

  const initstate = (cols) => {
    var s = new Array(cols.length);
    var p = new Array(cols.length);
    var dis = new Array(cols.length);
    for(var i=0;i<cols.length;i++)
    {
      s[i]="Varchar";
      p[i]=false;
      dis[i]=false;
    }
    console.log(p);
    setselected(s);
    setdisabled(dis);
  }


  const seth = (cols) => {
    initstate(cols);
    const f = cols.map((item,index) =>
    <FormGroup row>
    <Box m={2}>
    <TextField
       name={item}
       select
       label={item}
       value={selected[index]}
       onChange={(e) => handleChange(e, index)}
       helperText=""
       autowidth={true}
       labelwidth={10000}
       variant="outlined"
       className={classes.formControl}
     >
       {datatypes.map((option) => (
         <MenuItem key={option.value} value={option.value}>
           {option.label}
         </MenuItem>
       ))}
     </TextField>
    </Box>
    <FormControlLabel
     control={<Switch checked={p_key[index]} onChange={(e) => toggle(e,index)} classes={classes.formControl} disabled={disabled[index]} />}
     label="Primary key"
   />
    </FormGroup>
       );
    setfrm(f);
  };

  return (
    <div>
      <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Set Schema</DialogTitle>
        <DialogContent>
          <DialogContentText>
           <FormControl className={classes.formControl}>
            <h1>Set Schema for each column field</h1>
            <TextField required id="standard-required" label="Table name" defaultValue="Default" onChange={(e) => handleNameChange(e)}/>
            <div>{frm}</div>
            </FormControl>
          </DialogContentText>
          <CSVReader onFileLoaded={(data, fileInfo) => {seth(data[0]);setdt(data);}} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
