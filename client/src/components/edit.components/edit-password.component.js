import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isStrongPassword } from "validator";

import EditService from "../../services/edit.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const vpassword = (value) => {
  if (!isStrongPassword(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be at least 8 characters and contain 1 lowercase
        letter, 1 uppercase letter, 1 number and 1 symbol.
      </div>
    );
  }
};

export default class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.handlePassword = this.handlePassword.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      password: "",
      succesful: false,
      message: "",
    };
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  handlePassword(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      EditService.editPassword(this.state.password).then(
        (response) => {
          this.setState({
            message: response.data.message,
            successful: true,
          });
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage,
          });
        }
      );
    }
  }

  render() {
    return (
      <div>
        <Form
          onSubmit={this.handlePassword}
          ref={(c) => {
            this.form = c;
          }}
        >
          <div>
            <div className="form-group">
              <label htmlFor="password">Change your password:</label>
              <Input
                type="password"
                className="form-control"
                name="password"
                value={this.state.password}
                onChange={this.onChangePassword}
                validations={[required, vpassword]}
                placeholder={"Enter a new password"}
              />
            </div>

            <div className="form-group">
              <button className="btn btn-primary btn-block">
                Edit Password
              </button>
            </div>
          </div>

          {this.state.message && (
            <div className="form-group">
              <div
                className={
                  this.state.successful === true
                    ? "alert alert-success"
                    : "alert alert-danger"
                }
                role="alert"
              >
                {this.state.message}
              </div>
            </div>
          )}
          <CheckButton
            style={{ display: "none" }}
            ref={(c) => {
              this.checkBtn = c;
            }}
          />
        </Form>
      </div>
    );
  }
}
