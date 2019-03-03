import React, { Component } from 'react'; 
import '../App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

class Home extends Component {
  componentDidMount() {
    const login = localStorage.getItem('login')
    if(login == 'true'){ 
      fetch('http://localhost:9000/control', {
        method: 'POST',
        body: JSON.stringify({ cont: this.state.veriControl }),
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(res => res.json()).then(res => {
        console.log(res) 
        res.count != 0 ? this.setState({veriControl:'none'}) : this.setState({veriControl:'block'})
        //this.setState({ load: 'block' })
      })
    }
    else  
      window.location.assign('http://localhost:3000')
  }
  setFile = (event) => {
    var input = event.target
    var reader = new FileReader();
    reader.readAsDataURL(input.files[0])
    const file = input.files[0]
    reader.onloadend = () => {
      console.log(file)
      const formdata = new FormData()
      formdata.append('csvfile', file)
      fetch('http://localhost:9000/upload', {
        method: 'POST',
        body: formdata,
      }).then(res => res.json()).then(res => {
        console.log(res)
        this.setState({ load: 'block',veriControl:'none' }) 
      })

    }
  }

  state = {
    load: 'none',
    selectedDate: new Date('2000-11-19'),
    getAdet: 0, 
    veriControl: 'none'
  }
  handleChange = (date) => {
    this.setState({ selectedDate: date })
    const newDate = new Date(date)
    const day = newDate.getUTCDate()
    const month = newDate.getUTCMonth() + 1
    const year = newDate.getUTCFullYear()
    const fdate = month + "/" + day + "/" + year 
    
    fetch('http://localhost:9000/getadet', {
      method: 'POST',
      body: JSON.stringify({ date: fdate }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(res => {
      console.log(res)
      res== null ? this.setState({ getAdet: "Bulunamadı"}) : this.setState({ getAdet: res.adet })  
    })
  }

  logout = () =>{
    localStorage.clear()
    window.location.assign('http://localhost:3000')
  }


  render() {
    return (
      <div className="cover">  
        <AppBar position="fixed" style={{ top: 0 }}>
          <Toolbar>
            <Typography variant="h6" color="inherit" >
              Anasayfa
            </Typography> 
              <Button color="inherit" style={{position: 'fixed', right: 20}} onClick={this.logout}>Çıkış</Button>
          </Toolbar>
        </AppBar>
        <div className={'bg'}></div>
        <Paper className={'kcard'} elevation={1}  style={{height: 400,width: 400, borderRadius: '100%'}}>
          <input style={{ display: 'none' }} type="file" name="ffile" id="fupload" onChange={this.setFile} />
          <label htmlFor="fupload">
            <Button style={{ margin: 20, width: 223 }} variant="contained" component="span" color="secondary" >
              Veri yükle(CSV file)
        </Button>
          </label>
          <h6 style={{ color: 'green', display: this.state.load }}>Data Başarıyla yüklendi!</h6>

          <h4 style={{display:this.state.veriControl}}>Veri yüklemelisiniz..!</h4>
          <DatePicker
            dateFormat="MM/dd/yyyy"
            selected={this.state.selectedDate}
            onChange={this.handleChange}
            className="red-border"
          />
          <h4>Adet: {this.state.getAdet}</h4>
        </Paper>
      </div>
    );
  }
}

export default Home;
