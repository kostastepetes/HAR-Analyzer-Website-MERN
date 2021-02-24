import React, { Component } from "react";

import cleanFileData from "../services/clean-file-data";
import UploadService from "../services/upload.service";

export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.handleFileSave = this.handleFileSave.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.onFileChange = this.onFileChange.bind(this);

    this.state = {
      selectedFile: null,
      slectedFileName: null,
      fileData: null,
      successful: false,
      message: "",
      uploadSuccessful: false,
      uploadMessage: null,
    };
  }

  onFileChange(e) {
    this.setState({
      selectedFile: e.target.files[0],
      selectedFileName: e.target.files[0] && e.target.files[0].name,
      successful: false,
      message: "",
      uploadSuccessful: false,
      uploadMessage: null,
    });
  }

  handleFileSave(e) {
    e.preventDefault();

    this.setState({
      successful: false,
      message: "",
    });

    const file = this.state.selectedFile;

    if (file) {
      const reader = new FileReader();

      const scope = this;

      reader.onload = function () {
        try {
          const uncleanData = JSON.parse(reader.result);
          const cleanData = cleanFileData(uncleanData);

          scope.setState({
            fileData: cleanData,
            successful: true,
            message: `${scope.state.selectedFileName} has been processed and saved locally!`,
          });

          console.log(scope.state.fileData);
        } catch (e) {
          scope.setState({
            successful: false,
            message: `${scope.state.selectedFileName} is empty or contains syntax errors!`,
          });
        }
      };
      reader.readAsText(file);
    } else {
      this.setState({
        successful: false,
        message: "Please, choose a file first!",
      });
    }
  }

  handleFileUpload(e) {
    e.preventDefault();

    this.setState({
      uploadSuccessful: false,
      uploadMessage: null,
    });

    const fileData = this.state.fileData;
    //console.log(fileData);

    UploadService.uploadFile(fileData).then(
      (response) => {
        this.setState({
          uploadMessage: response.data.message,
          uploadSuccessful: true,
        });
      },
      (error) => {
        console.log(this.state.fileData);
        console.log(error.response.data.message);
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({
          uploadSuccessful: false,
          uploadMessage: resMessage,
        });
      }
    );
  }

  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <div>
            <div className="form-group">
              <label htmlFor="file">
                Select a file in <strong>HTTP Archive (HAR)</strong> format:
              </label>

              <input
                type="file"
                className="form-control-file"
                name="file"
                accept=".har"
                onChange={this.onFileChange}
              />
            </div>
            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                onClick={this.handleFileSave}
              >
                Save
              </button>
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
            {this.state.successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="export">
                    Export processed {this.state.selectedFileName} in JSON
                    format:
                  </label>
                  <a
                    href={`data:text/plain;charset=utf-8, ${encodeURIComponent(
                      JSON.stringify(this.state.fileData)
                    )}`}
                    download="processed.json"
                  >
                    <button name="export" className="btn btn-primary btn-block">
                      Export
                    </button>
                  </a>
                </div>
                <div className="form-group">
                  <label htmlFor="upload">
                    Upload processed {this.state.selectedFileName} to our
                    website:
                  </label>
                  <button
                    name="upload"
                    className="btn btn-primary btn-block"
                    onClick={this.handleFileUpload}
                  >
                    Upload
                  </button>
                </div>
                {this.state.uploadMessage && (
                  <div className="form-group">
                    <div
                      className={
                        this.state.uploadSuccessful === true
                          ? "alert alert-success"
                          : "alert alert-danger"
                      }
                      role="alert"
                    >
                      {this.state.uploadMessage}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
