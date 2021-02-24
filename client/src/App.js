import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";

import Edit from "./components/edit.component";
import Upload from "./components/upload.component";
import Visualization from "./components/visualization.component";

import BasicInfo from "./components/basic-info.component";
import TimeAnalysis from "./components/time-analysis.component";
import CacheAnalysis from "./components/cache-analysis.component";
import AdminVisualization from "./components/admin-visualization.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.openUserNav = this.openUserNav.bind(this);
    this.closeUserNav = this.closeUserNav.bind(this);
    this.openAdminNav = this.openAdminNav.bind(this);
    this.closeAdminNav = this.closeAdminNav.bind(this);

    this.state = {
      isAdmin: false,
      currentUser: undefined,
      isUserSidenavOpen: false,
      isAdminSidenavOpen: false,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,

        isAdmin: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  openUserNav(e) {
    e.preventDefault(e);

    if (this.state.isAdminSidenavOpen) {
      this.closeAdminNav(e);
    }

    this.setState({ isUserSidenavOpen: true });

    document.getElementById("userSidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "#341064";
  }

  closeUserNav(e) {
    e.preventDefault(e);
    document.getElementById("userSidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "#341064";

    this.setState({ isUserSidenavOpen: false });
  }

  openAdminNav(e) {
    e.preventDefault(e);

    if (this.state.isUserSidenavOpen) {
      this.closeUserNav(e);
    }

    this.setState({ isAdminSidenavOpen: true });

    document.getElementById("adminSidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "#341064";
  }

  closeAdminNav(e) {
    e.preventDefault(e);
    document.getElementById("adminSidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "#341064";

    this.setState({ isAdminSidenavOpen: false });
  }

  render() {
    const { currentUser, isAdmin } = this.state;

    return (
      <div>
        <div id="main">
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <Link to={"/"} className="navbar-brand">
              <img
                src="favicon-32x32.png"
                alt="click-logo-for-home"
                width="30"
                height="35"
              ></img>
            </Link>
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link
                  to={"/home"}
                  className="nav-link"
                  style={{ color: "white" }}
                >
                  Home
                </Link>
              </li>

              {currentUser && (
                <li className="nav-item">
                  <span
                    className="nav-link"
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={this.openUserNav}
                  >
                    &#9776; User options
                  </span>
                </li>
              )}
              {currentUser && isAdmin && (
                <li className="nav-item">
                  <span
                    className="nav-link"
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={this.openAdminNav}
                  >
                    &#9776; Admin options
                  </span>
                </li>
              )}
            </div>
            {currentUser ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link
                    to={"/profile"}
                    className="nav-link"
                    style={{ color: "white" }}
                  >
                    {currentUser.username}
                  </Link>
                </li>
                <li className="nav-item">
                  <a
                    href="/login"
                    className="nav-link"
                    onClick={this.logOut}
                    style={{ color: "white" }}
                  >
                    Sign out
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link
                    to={"/login"}
                    className="nav-link"
                    style={{ color: "white" }}
                  >
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to={"/register"}
                    className="nav-link"
                    style={{ color: "white" }}
                  >
                    Sign up
                  </Link>
                </li>
              </div>
            )}
          </nav>

          <div className="container mt-3">
            <Switch>
              <Route exact path={["/", "/home"]} component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/edit" component={Edit} />
              <Route exact path="/upload" component={Upload} />
              <Route exact path="/visualization" component={Visualization} />
              <Route exact path="/basic-info" component={BasicInfo} />
              <Route exact path="/time-analysis" component={TimeAnalysis} />
              <Route exact path="/cache-analysis" component={CacheAnalysis} />
              <Route
                exact
                path="/admin-visualization"
                component={AdminVisualization}
              />
            </Switch>
          </div>
        </div>
        <div id="userSidenav" className="sidenav">
          <a href="/#" className="closebtn" onClick={this.closeUserNav}>
            &times;
          </a>
          <Link to={"/edit"} className="nav-link">
            Edit profile
          </Link>
          <Link to={"/upload"} className="nav-link">
            Upload a file
          </Link>

          <Link to={"/visualization"} className="nav-link">
            Visualize data
          </Link>
        </div>
        <div id="adminSidenav" className="sidenav">
          <a href="/#" className="closebtn" onClick={this.closeAdminNav}>
            &times;
          </a>
          <Link to={"/basic-info"} className="nav-link">
            Display basic info
          </Link>
          <Link to={"/time-analysis"} className="nav-link">
            Analyze response times
          </Link>
          <Link to={"/cache-analysis"} className="nav-link">
            Analyze HTTP headers
          </Link>
          <Link to={"/admin-visualization"} className="nav-link">
            Visualize data
          </Link>
        </div>
        <footer style={{ color: "white", textAlign: "center" }}>
          {" "}
          <small>
            Copyright &copy; 2021 HAR Sourcerer, All Rights Reserved
          </small>{" "}
        </footer>
      </div>
    );
  }
}

export default App;
