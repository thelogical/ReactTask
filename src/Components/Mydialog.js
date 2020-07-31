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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


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
  const [tbname,setname] = React.useState("default");
  const [open,setopen] = React.useState(false);
  const [msg,setmsg] = React.useState("");
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

var p = [];
var dis = [];
var isnull = [];
var filedata = null;


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
    var ts = {...props.schema[props.rw.Sno-1], name: tbname, schema: selected};
    var nwschema = props.schema.map((item,index) => index + 1 === r.Sno ? ts : item)
    props.setschema(nwschema);
    //reset this component variables
    setfrm(null);
    setselected([]);
    props.setopen(false);
  };

  const handleClosebar = () => {
    setopen(!open);
  }

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

  const togglep = (e,index) => {
    var dt = filedata.slice(1).map(function(v){ return v[index] });
    var unq = new Set(dt).size == dt.length;
    if(!unq)
    {
      setmsg("Column values are not unique.Please check the data");
      setopen(true);
      return;
    }
    if(e.target.checked)
    {
      dis = p.map((item,ind) => ind==index?false:true);
    }
    else
    {
      dis = p.map((item,ind) => false);
    }
    p[index] = e.target.checked;
    seth(filedata,false);
  }

  const togglenull = (e,index) => {
    for(var i=1;i<filedata.length-1;i++)
    {
      if(filedata[i][index]==null || filedata[i][index]=="")
      {
        setmsg("Empty value found at "+i+"th row for this column. Recheck the data");
        setopen(true);
        return;
      }
    }
    isnull[index] = e.target.checked;
    seth(filedata,false);
  }

 // set default state based on number of columns
  const initstate = (cols) => {
    var s = cols.map(() => "varchar");
    setselected(s);
    p = cols.map(() => false );
    dis = cols.map(() => false );
    isnull = cols.map(() => false );
  }


  const seth = (data,doinit) => {
    var cols = data[0];
    if(doinit) {
      initstate(cols);
    }
    props.schema[props.rw.Sno-1].data = data;
    props.schema[props.rw.Sno-1].primary_key = p;
    props.schema[props.rw.Sno-1].isnull = isnull;
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
     control={<Switch checked={p[index]} onChange={(e) => togglep(e,index)} classes={classes.formControl} disabled={dis[index]} />}
     label="Primary key"
   />
   <FormControlLabel
    control={<Switch checked={isnull[index]} onChange={(e) => togglenull(e,index)} classes={classes.formControl} />}
    label="Not Null"
  />
    </FormGroup>
       );
    setfrm(f);
  };

  return (
    <div>
    <Snackbar open={open} autoHideDuration={6000} onClose={() => setopen(false)}>
      <Alert onClose={() => setopen(false)} severity="error">
        {msg}
      </Alert>
      </Snackbar>
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
          <CSVReader onFileLoaded={(data, fileInfo) => {filedata=data;seth(data,true);}} />
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
