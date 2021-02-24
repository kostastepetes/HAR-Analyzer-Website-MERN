import React, { Component } from "react";

import AuthService from "../services/auth.service";
import StatsService from "../services/stats.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthService.getCurrentUser(),
      userStats: null,
    };
  }

  componentDidMount() {
    StatsService.getStats().then((res) => {
      this.setState({
        userStats: res.data.sort(function (a, b) {
          return new Date(b.uploadedAt) - new Date(a.uploadedAt);
        }),
      });
    });
  }

  render() {
    const { currentUser } = this.state;
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>
            <strong>Hello there, {currentUser.username}</strong>
          </h3>
        </header>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "25px",
            padding: "20px",
          }}
        >
          <p>
            <strong>Email:</strong> {currentUser.email}
          </p>
          <strong>Authorities:</strong>
          <ul>
            {currentUser.roles &&
              currentUser.roles.map((role, index) => (
                <li key={index}>{role}</li>
              ))}
          </ul>
          <strong>File Upload History:</strong>
          {!this.state.userStats ? (
            <p>Loading...</p>
          ) : (
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">File Entries</th>
                  <th scope="col">Upload Date</th>
                </tr>
              </thead>
              <tbody>
                {this.state.userStats
                  ? this.state.userStats.map(function (item, key) {
                      return (
                        <tr key={key}>
                          <td>{item.numberOfEntries}</td>
                          <td>{item.uploadedAt}</td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
}
