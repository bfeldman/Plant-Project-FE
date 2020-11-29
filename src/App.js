import React from 'react'
import { Route, Switch, withRouter} from 'react-router-dom'
import './App.css';
import Signup from "./Components/Signup"
import Login from "./Components/Login"
import Navbar from "./Components/Navbar"
import SearchContainer from "./Containers/SearchContainer"
import CollectionContainer from './Containers/CollectionContainer';

class App extends React.Component {

  state = {
    user: null
  }

  componentDidMount() {
    const token = localStorage.getItem("token")
    if (token) {
      fetch('http://localhost:3000/api/v1/profile', {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => response.json())
      .then(data => {
        this.setState({user: data.user}, () => console.log("CURRENT USER: ", this.state.user))
      })
    } else {
      this.props.history.push("/login")
    }
  }
  
  signupHandler = (userObj) => {
    fetch('http://localhost:3000/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Accepts": 'application/json'
      },
      body: JSON.stringify({ user: userObj})
    })
    .then(response => response.json())
    .then(console.log)
  }
  
  loginHandler = (userObj) => {
    const token = localStorage.getItem("token")
    if (token) {
      this.props.history.push("/")
    } else {
      fetch('http://localhost:3000/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Accepts": 'application/json'
        },
        body: JSON.stringify({ user: userObj})
      })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem("token", data.jwt)
        this.setState({user: data.user}, () => console.log("LOGGED IN AS: ", this.state.user))
        this.props.history.push("/collection")
      })
    }
  }
  
  logoutHandler = () => {
    localStorage.removeItem("token")
    this.setState({user: null})
    this.props.history.push("/")
  }
  
  render() {
    return (
        <div className="App">
          <h1>Plant App</h1>
          <Navbar user={this.state.user} logoutHandler={this.logoutHandler}/>
          <Switch>
            <Route path ="/signup" render={ () => <Signup submitHandler={this.signupHandler} /> } />
            <Route path ="/login" render={ () => <Login submitHandler={this.loginHandler} /> } />
            <Route path ="/search" render={ () => <SearchContainer user={this.state.user} /> } />
            <Route path="/collection" render={ () => <CollectionContainer user={this.state.user}/>} />
          </Switch>
          {/* footer component here */}
        </div>
    );
  }
}

export default withRouter(App);
