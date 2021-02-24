import React, { Component } from "react";

import EditUsername from "./edit.components/edit-username.component";
import EditPassword from "./edit.components/edit-password.component";

export default class Edit extends Component {
  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <EditUsername />
          <EditPassword />
        </div>
      </div>
    );
  }
}
