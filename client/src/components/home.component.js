import React, { Component } from "react";

import UserService from "../services/user.service";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
    };
  }

  componentDidMount() {
    UserService.getPublicContent().then(
      (response) => {
        this.setState({
          content: response.data,
        });
      },
      (error) => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <img
            style={{
              display: "block",
              maxWidth: "30%",
              height: "auto",
              borderRadius: "8px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "50px",
            }}
            src="homepage-logo.png"
            alt="official-logo"
            // style={{ width: "200", height: "190", align: "left", hspace: "10" }}
          ></img>
          <h3 style={{ textAlign: "center" }}>
            <strong>Welcome to HAR Sourcerer</strong>
          </h3>
          <br />

          <h5 style={{ textAlign: "center" }}>
            <strong>HAR Sourcerer</strong> is a crowdsourcing platform that
            allows its users to upload, analyze and process their{" "}
            <strong>HAR (HTTP Archive)</strong> files.
          </h5>
        </header>
      </div>
    );
  }
}
