import React, { Component } from "react";

import {
  getFromStorage,
  setInStorage,
} from "../../utils/storage";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: "",
      signInError: "",
      signUpError: "",
      signInEmail: "",
      signInPassword: "",
      signUpFirstName: "",
      signUpLastName: "",
      signUpEmail: "",
      signUpPassword: "",
    }
  }

  componentDidMount() {
    const obj = getFromStorage("eportfolio");
    if (obj && obj.token) {
      const { token } = obj;
      // verify token
      fetch("/users/verify?token=" + token)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            token,
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false,
          })
        }
      })
    } else {
      // no token
      this.setState({
        isLoading: false,
      });
    }
  }

  onChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  onSignUp = () => {
    // Grab state
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch("/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            signUpFirstName: "",
            signUpLastName: "",
            signUpEmail: "",
            signUpPassword: "",
            isLoading: false,
          })
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false,
          })
        }
      });
  }

  onSignIn = () => {
    // Grab state
    const {
      signInEmail,
      signInPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch("users/signin",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          console.log("json success in sign in");
          setInStorage("eportfolio", {token: json.token});
          this.setState({
            signIn: json.message,
            isLoading: false,
            signInPassword: "",
            signInEmail: "",
            token: json.token,
          });
        } else {
          console.log("json failure in sign in");
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      });
  }

  logout = () => {
    this.setState({
      isLoading: true,
      signInError: "",
    });
    const obj = getFromStorage("eportfolio");
    if (obj && obj.token) {
      const { token } = obj;
      fetch("/users/logout?token=" + token)
        .then(res => res.json())
        .then(json => {
          console.log(json);
          if (json.success) {
            setInStorage("eportfolio", { token: "" });
            this.setState({
              token: "",
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    const {
      isLoading,
      token,
      signInError,
      signUpError,
      signInEmail,
      signInPassword,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    if (!token) {
      return (
        <div>
          <div>
            {
              (signInError) ? (
                <p>{signInError}</p>
              ) : (null)
            }
            <p>Sign In</p>
            <input 
              onChange={this.onChange}
              id="signInEmail"
              type="email" 
              placeholder="Email" 
              value={signInEmail}/>
            <br />
            <input 
              onChange={this.onChange}
              id="signInPassword"
              type="password" 
              placeholder="Password" 
              value={signInPassword}/>
            <br />
            <button onClick={this.onSignIn}>Sign In</button>
          </div>
          <br />
          <div>
            {
              (signUpError) ? (
                <p>{signUpError}</p>
              ) : (null)
            }
            <p>Sign Up</p>
            <input 
              onChange={this.onChange}
              id="signUpFirstName"
              type="text" 
              placeholder="First Name" 
              value={signUpFirstName}
            />
            <br />
            <input 
              onChange={this.onChange}
              id="signUpLastName"
              type="text" 
              placeholder="Last Name"
              value={signUpLastName}
            />
            <br />
            <input 
              onChange={this.onChange}
              id="signUpEmail"
              type="email" 
              placeholder="Email"
              value={signUpEmail}
            />
            <br />
            <input 
              onChange={this.onChange}
              id="signUpPassword"
              type="password" 
              placeholder="Password"
              value={signUpPassword}
            />
            <br />
            <button onClick={this.onSignUp}>Sign Up</button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <p>Account</p>
        <button onClick={this.logout}>Logout</button>
      </div>
    )
  }
}

export default Home;