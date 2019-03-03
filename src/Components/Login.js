import React, { Component } from 'react';
import '../App.css';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

class Login extends Component {
  componentDidMount() {
    const login = localStorage.getItem('login')
    if (login == 'true')
      window.location.assign('http://localhost:3000/home')
  }
  state = {
    username: '',
    password: '',
    errMsgDisplay: 'none'
  }
  userControl = () => {
    const userInfo = {
      username: this.state.username,
      password: this.state.password,
      errMsgDisplay: 'none'
    }

    fetch('http://localhost:9000/login', {
      method: 'POST',
      body: JSON.stringify(userInfo),
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json()).then(res => {
      console.log(res)
      if (res.giris) {
        localStorage.setItem('login', 'true')
        window.location.assign('http://localhost:3000/home')
      }
      else
        this.setState({ errMsgDisplay: 'block', username: '', password: '' })
      //this.setState({ load: 'block' })
    })
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.userControl()
    }
  }
  render() {
    return (
      <div className="cover">
        <AppBar position="fixed" style={{ top: 0 }}>
          <Toolbar>
            <Typography variant="h6" color="inherit" >
              Giriş Yap
            </Typography>
          </Toolbar>
        </AppBar>

        <div className={'bg'}></div>
        <Paper className={'kcard'} elevation={1} style={{height: 400,width: 400, borderRadius: '100%',zIndex: 2}}>
          <Typography style={{ color: 'gray', fontWeight: 'bold' }} variant="h6" component="h3">
            Kullanıcı Giriş Ekranı
        </Typography>
          <TextField
            id="outlined-with-placeholder"
            label="Kullanıcı Adı"
            placeholder="Kullanıcı Adı"
            margin="normal"
            variant="outlined"
            value={this.state.username}
            onChange={(evt) => this.setState({ username: evt.target.value })}
            onKeyPress= {this.onKeyPress}
          />

          <TextField
            id="outlined-with-placeholder"
            type='password'
            label="Şifre"
            placeholder="Şifre"
            margin="normal"
            variant="outlined"
            value={this.state.password}
            onChange={(evt) => this.setState({ password: evt.target.value })}
            onKeyPress= {this.onKeyPress}
          />
          <h4 style={{ color: 'brown', display: this.state.errMsgDisplay }}>Kullanıcı adı veya şifre hatalı..!</h4>
          <Button style={{ margin: 20, width: 223 }} variant="contained" color="secondary" onClick={this.userControl} >
            Giriş
        </Button>
        </Paper>
      </div>
    );
  }
}

export default Login;
