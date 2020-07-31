import React, { Component } from "react";
import {useRef} from "react";
import ReactDOM from "react-dom";
import MaterialTable from "material-table";
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import AddIcon from '@material-ui/icons/Add';
import Mydialog from './Components/Mydialog';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function App()  {
  // initializing component state variables
  const [opn,setopn] = React.useState(false);
  const [toast,settoast] = React.useState(false);
  const [msg,setmsg] = React.useState("");
  const [severity,setseverity] = React.useState("error");
  const [rw,setrw] = React.useState(null);
  const [schema,setschema] = React.useState([
    {
      name: null,
      data: null,
      schema: null,
      primary_key: null,
      isnull: null,
    }
  ]);
  const [data,setdata] = React.useState([
    {
      Sno: 1,
      tablename: "SetTablename",
      Schema: "Notset",
    },
  ]);

  // function to initialize and add new row
  const addrow = () => {
    var l = data.length;
    setdata(data.concat({Sno: l+1,tablename: "SetTablename",Schema: "Notset"}));
    setschema(schema.concat({name: null,data: null,schema: null,primary_key: null,isnull: null}));
  }

 //function to post table data to backend, where it will be saved in database
  const test = (rowData) => {

    const dt = schema[rowData.Sno-1];

    const config = { headers: {
     'Content-Type': 'application/x-www-form-urlencoded',
     'Accept': 'application/json'
                              }
    };
    axios.post('http://192.168.1.15:4000/upload',dt,config)
    .then((response) => {
        if(response.data=="Failure!")
        {
          setmsg("Failure!");
          setseverity("error");
          settoast(true);
        }
        else {
          setmsg("Success!");
          setseverity("success");
          settoast(true);
        }
      });
  }

  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        columns={[
          { title: 'Sno', field: 'Sno',
                                       cellStyle: { width: 40, maxWidth: 40},
                                       headerStyle: { width:40, maxWidth: 40}
          },
          { title: "tablename", field: "tablename" },
          { title: "Schema", field: "Schema" },
        ]}
        data={data}
        title="Upload CSV Files"
        actions={[
      {
        icon: EditTwoToneIcon,
        tooltip: 'Edit table',
        onClick: (event, rowData) => {setrw(rowData);setopn(true);}
      },
      {
        icon: AddIcon,
        tooltip: 'Add User',
        isFreeAction: true,
        onClick: (event) => addrow()
      },
      {
        icon: PublishRoundedIcon,
        tooltip: 'Upload to database',
        onClick: (event,rowData) => test(rowData)
      }
    ]}
      />
    <Snackbar open={toast} autoHideDuration={4000} onClose={() => settoast(false)}>
      <Alert onClose={() => settoast(false)} severity={severity}>
        {msg}
      </Alert>
    </Snackbar>
    <Mydialog open={opn} setopen={setopn} schema={schema} setschema={setschema} setdata={setdata} data={data} rw={rw}/>
    </div>
  );
}
