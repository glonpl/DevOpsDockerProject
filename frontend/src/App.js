import React, { useState} from 'react';
import logo from './logo.svg';
import {  TextField, Box, Button } from '@material-ui/core'
import { makeStyles, ThemeProvider  } from '@material-ui/core/styles';
import './App.css';
import axios from "axios";
import theme from './theme'
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },

}));

function App() {
  const [radius, setRadius] = useState('');
  const [price, setPrice] = useState('');
  const [profitability, setProfitability] = useState('');
  const [error, setError] = useState('');
  const handleClick = async (event) => {
    event.preventDefault();
    axios.get(`/api/${radius}/${price}/`).then(res => {
      console.log(radius,price);
      if (res.data.error) {
        setProfitability('');
        setError(res.data.error);
      } else {
        setError('');
        setProfitability(res.data.result);
      }
    })
  };



  const classes = useStyles();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Count pizza price per square meter:
        </p>
        <form onSubmit={handleClick}>
        <ThemeProvider theme={theme}>
        <form className={classes.root} noValidate autoComplete="off">
        <TextField id="txtf-radius" label="Radius" value={radius} required variant="filled" color="secondary" onInput={e => setRadius(e.target.value)}/>
        <TextField id="txtf-price" label="Price" value={price} required variant="filled" color="primary" onInput={e => setPrice(e.target.value)}  />
        </form>
        <form className={classes.root} theme={theme}>
                <Button variant="contained" color="primary" type="submit">
          Calculate!
        </Button>
        </form>
        <form>
        {error ? <h4>{error}</h4> : <h4>{profitability ?  `You pay ${profitability} for a square meter.`  : 'Waiting for orders!'}</h4>}
        
        </form>
        
        </ThemeProvider>
        </form>
      </header>
    </div>
  );
}

export default App;
