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

//this was in material UI documentation
const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(5),
      width: '25ch',
    },
  },
}));

export default function MyDialog(props) {
  //Initialize component state variables
  const classes = useStyles();
  const [frm,setfrm] = React.useState(null);
  const [selected,setselected] = React.useState([]);
  const [dt,setdt] = React.useState(null);
  const [tbname,setname] = React.useState("default");
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
    value: 'timeStamp',
    label: 'timeStamp',
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

  const seth = (cols) => {
    var s = [];
    for(var i=0;i<cols.length;i++)
    {
      s.push("Varchar");
    }
    setselected(s);
    const f = cols.map((item,index) =>
    <Box m={2}>
    <TextField
       name={item}
       select
       label={item}
       value={selected[index]}
       onChange={(e) => handleChange(e, index)}
       helperText=""
     >
       {datatypes.map((option) => (
         <MenuItem key={option.value} value={option.value}>
           {option.label}
         </MenuItem>
       ))}
     </TextField>
    </Box>
       );
    setfrm(f);
  };

  return (
    <div>

      <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Set Schema</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <h1>Set Schema for each column field</h1>
            <TextField required id="standard-required" label="Table name" defaultValue="Default" onChange={(e) => handleNameChange(e)}/>
            <div>{frm}</div>
          </DialogContentText>
          //I would like to change the design of CSV uploader button
          <CSVReader onFileLoaded={(data, fileInfo) => {console.log(fileInfo);seth(data[0]);setdt(data);}} />
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
