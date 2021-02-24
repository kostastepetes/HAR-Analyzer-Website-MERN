import React, { Component } from "react";
import Chart from "chart.js";
import Gradient from "javascript-color-gradient";

import BasicInfoService from "../services/basic-info.service";

export default class BasicInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      basicInfo: null,
      uniqueRequestTypes: null,
      uniqueResponseStatus: null,
      avgAgeByContentType: null,
    };
  }

  componentDidMount() {
    const colorGradient = new Gradient();

    const color1 = "#3F2CAF";
    const color2 = "#e9446a";
    const color3 = "#edc988";
    const color4 = "#607D8B";

    BasicInfoService.getBasicInfo().then((res) => {
      this.setState({
        basicInfo: res.data,
      });
    });
    BasicInfoService.getEntriesByReqType().then((res) => {
      this.setState({
        uniqueRequestTypes: res.data,
      });

      colorGradient.setMidpoint(10);

      colorGradient.setGradient(color1, color2, color3, color4);

      let reqTypeData = {
        datasets: [
          {
            data: this.state.uniqueRequestTypes.map((unique) => {
              return unique.freq;
            }),
            backgroundColor: colorGradient.getArray(),
            borderWidth: 0.5,
          },
        ],

        labels: this.state.uniqueRequestTypes.map((unique) => {
          return unique.method;
        }),
      };

      let ctx1 = document.getElementById("reqTypeChart");
      new Chart(ctx1, {
        type: "doughnut",
        data: reqTypeData,
        options: {
          responsive: true,
          title: {
            display: true,
            text: "Total entries by request type (method):",
          },
        },
      });
    });
    BasicInfoService.getEntriesByResStatus().then((res) => {
      this.setState({
        uniqueResponseStatus: res.data,
      });

      colorGradient.setMidpoint(30);

      colorGradient.setGradient(color1, color2, color3, color4);

      let resStatusData = {
        datasets: [
          {
            data: this.state.uniqueResponseStatus.map((unique) => {
              return unique.freq;
            }),
            backgroundColor: colorGradient.getArray(),
            borderWidth: 0.5,
          },
        ],

        labels: this.state.uniqueResponseStatus.map((unique) => {
          return unique.status;
        }),
      };

      let ctx2 = document.getElementById("resStatusChart");
      new Chart(ctx2, {
        type: "doughnut",
        data: resStatusData,
        options: {
          responsive: true,
          title: {
            display: true,
            text: "Total entries by response status:",
          },
        },
      });
    });
    BasicInfoService.getEntryAvgAgeByContentType().then((res) => {
      this.setState({
        avgAgeByContentType: res.data,
      });

      colorGradient.setMidpoint(this.state.avgAgeByContentType.length);

      colorGradient.setGradient(color1, color2, color3, color4);

      let myData = {
        labels: this.state.avgAgeByContentType.map((item) => {
          return item.contentType;
        }),
        datasets: [
          {
            label: "Average age (days)",
            backgroundColor: colorGradient.getArray(),
            data: this.state.avgAgeByContentType.map((item) => {
              return item.averageAge * 1.1574074 * Math.pow(10, -8);
            }),
          },
        ],
      };

      let ctx3 = document.getElementById("avgAgeChart");
      new Chart(ctx3, {
        type: "bar",
        data: myData,
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: "Average Web object age by content-type:",
          },
        },
      });
    });
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>HAR Sourcerer statistics</h3>
          {this.state.basicInfo ? (
            <div>
              <p>
                <strong>Registered users: </strong>
                {this.state.basicInfo.userCount}
              </p>
              <p>
                <strong>Unique domains: </strong>
                {this.state.basicInfo.uniqueDomainNames}
              </p>
              <p>
                <strong>Unique internet service providers: </strong>
                {this.state.basicInfo.uniqueIsps}
              </p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </header>
        <div
          className="container"
          style={{
            backgroundColor: "white",
            textAlign: "center",
            borderRadius: "25px",
            padding: "20px",
          }}
        >
          <h3>Entries by request method</h3>
          <div>
            <canvas id="reqTypeChart"></canvas>
          </div>
          <hr />
          <h3>Entries by response status</h3>
          <div>
            <canvas id="resStatusChart"></canvas>
          </div>
          <hr />
          <h3>Average Web object age</h3>
          <p>
            Bar chart representing the average age of Web objects in days at the
            time of retrieval (Y-axis), by response <code>content-type</code>{" "}
            (X-axis):
          </p>
          <div>
            <canvas id="avgAgeChart"></canvas>
          </div>
        </div>
      </div>
    );
  }
}
