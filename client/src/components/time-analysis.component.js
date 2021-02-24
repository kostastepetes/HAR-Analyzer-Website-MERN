import React, { Component } from "react";
import Chart from "chart.js";
import Gradient from "javascript-color-gradient";

import TimeAnalysisService from "../services/time-analysis.service";

export default class TimeAnalysis extends Component {
  constructor(props) {
    super(props);
    this.handleSelectChange = this.handleSelectChange.bind(this);

    this.renderBar = this.renderBar.bind(this);
    this.getDefaultBarData = this.getDefaultBarData.bind(this);
    this.getTypeBarData = this.getTypeBarData.bind(this);
    this.getDayBarData = this.getDayBarData.bind(this);
    this.getMethodBarData = this.getMethodBarData.bind(this);
    this.getIspBarData = this.getIspBarData.bind(this);

    this.state = {
      timeAnalysisData: null,

      defaultData: null,
      typeData: null,
      dayData: null,
      methodData: null,
      ispData: null,
      chart: null,
    };
  }

  componentDidMount() {
    TimeAnalysisService.getTimeAnalysis().then((res) => {
      this.setState({
        timeAnalysisData: res.data,
        defaultData: this.getDefaultBarData(res.data),
        typeData: this.getTypeBarData(res.data),
        dayData: this.getDayBarData(res.data),
        methodData: this.getMethodBarData(res.data),
        ispData: this.getIspBarData(res.data),
      });

      this.setState({ chart: this.renderBar(this.state.defaultData) });
    });
  }

  getDefaultBarData(data) {
    return {
      datasets: [
        {
          label: "all",
          data: data.default.timings,
          backgroundColor: "#ff914d",
        },
      ],
      labels: [
        "00:00-00:59",
        "01:00-01:59",
        "02:00-02:59",
        "03:00-03:59",
        "04:00-04:59",
        "05:00-05:59",
        "06:00-06:59",
        "07:00-07:59",
        "08:00-08:59",
        "09:00-09:59",
        "10:00-10:59",
        "11:00-11:59",
        "12:00-12:59",
        "13:00-13:59",
        "14:00-14:59",
        "15:00-15:59",
        "16:00-16:59",
        "17:00-17:59",
        "18:00-18:59",
        "19:00-19:59",
        "20:00-20:59",
        "21:00-21:59",
        "22:00-22:59",
        "23:00-23:59",
      ],
    };
  }

  getTypeBarData(data) {
    const colorGradient = new Gradient();
    const color1 = "#3F2CAF";
    const color2 = "#e9446a";
    const color3 = "#edc988";
    const color4 = "#607D8B";

    colorGradient.setMidpoint(data.byType.length);

    colorGradient.setGradient(color1, color2, color3, color4);

    let myDataset = [];
    let i = 0;
    data.byType.forEach((element) => {
      let temp = {
        label: element.contentType,
        data: element.timings,
        backgroundColor: colorGradient.getArray()[i],
        stack: `Stack ${i}`,
      };
      myDataset.push(temp);
      i++;
    });

    return {
      datasets: myDataset,
      labels: [
        "00:00-00:59",
        "01:00-01:59",
        "02:00-02:59",
        "03:00-03:59",
        "04:00-04:59",
        "05:00-05:59",
        "06:00-06:59",
        "07:00-07:59",
        "08:00-08:59",
        "09:00-09:59",
        "10:00-10:59",
        "11:00-11:59",
        "12:00-12:59",
        "13:00-13:59",
        "14:00-14:59",
        "15:00-15:59",
        "16:00-16:59",
        "17:00-17:59",
        "18:00-18:59",
        "19:00-19:59",
        "20:00-20:59",
        "21:00-21:59",
        "22:00-22:59",
        "23:00-23:59",
      ],
    };
  }

  getDayBarData(data) {
    const colorGradient = new Gradient();
    const color1 = "#3F2CAF";
    const color2 = "#e9446a";
    const color3 = "#edc988";
    const color4 = "#607D8B";

    colorGradient.setMidpoint(data.byDay.length);

    colorGradient.setGradient(color1, color2, color3, color4);

    let myDataset = [];
    let i = 0;
    data.byDay.forEach((element) => {
      let temp = {
        label: element.day,
        data: element.timings,
        backgroundColor: colorGradient.getArray()[i],
        stack: `Stack ${i}`,
      };
      myDataset.push(temp);
      i++;
    });

    return {
      datasets: myDataset,
      labels: [
        "00:00-00:59",
        "01:00-01:59",
        "02:00-02:59",
        "03:00-03:59",
        "04:00-04:59",
        "05:00-05:59",
        "06:00-06:59",
        "07:00-07:59",
        "08:00-08:59",
        "09:00-09:59",
        "10:00-10:59",
        "11:00-11:59",
        "12:00-12:59",
        "13:00-13:59",
        "14:00-14:59",
        "15:00-15:59",
        "16:00-16:59",
        "17:00-17:59",
        "18:00-18:59",
        "19:00-19:59",
        "20:00-20:59",
        "21:00-21:59",
        "22:00-22:59",
        "23:00-23:59",
      ],
    };
  }

  getMethodBarData(data) {
    const colorGradient = new Gradient();
    const color1 = "#3F2CAF";
    const color2 = "#e9446a";
    const color3 = "#edc988";
    const color4 = "#607D8B";

    colorGradient.setMidpoint(data.byMethod.length);

    colorGradient.setGradient(color1, color2, color3, color4);

    let myDataset = [];
    let i = 0;
    data.byMethod.forEach((element) => {
      let temp = {
        label: element.method,
        data: element.timings,
        backgroundColor: colorGradient.getArray()[i],
        stack: `Stack ${i}`,
      };
      myDataset.push(temp);
      i++;
    });

    return {
      datasets: myDataset,
      labels: [
        "00:00-00:59",
        "01:00-01:59",
        "02:00-02:59",
        "03:00-03:59",
        "04:00-04:59",
        "05:00-05:59",
        "06:00-06:59",
        "07:00-07:59",
        "08:00-08:59",
        "09:00-09:59",
        "10:00-10:59",
        "11:00-11:59",
        "12:00-12:59",
        "13:00-13:59",
        "14:00-14:59",
        "15:00-15:59",
        "16:00-16:59",
        "17:00-17:59",
        "18:00-18:59",
        "19:00-19:59",
        "20:00-20:59",
        "21:00-21:59",
        "22:00-22:59",
        "23:00-23:59",
      ],
    };
  }

  getIspBarData(data) {
    const colorGradient = new Gradient();
    const color1 = "#3F2CAF";
    const color2 = "#e9446a";
    const color3 = "#edc988";
    const color4 = "#607D8B";

    colorGradient.setMidpoint(data.byIsp.length);

    colorGradient.setGradient(color1, color2, color3, color4);

    let myDataset = [];
    let i = 0;
    data.byIsp.forEach((element) => {
      let temp = {
        label: element.isp,
        data: element.timings,
        backgroundColor: colorGradient.getArray()[i],
        stack: `Stack ${i}`,
      };
      myDataset.push(temp);
      i++;
    });

    return {
      datasets: myDataset,
      labels: [
        "00:00-00:59",
        "01:00-01:59",
        "02:00-02:59",
        "03:00-03:59",
        "04:00-04:59",
        "05:00-05:59",
        "06:00-06:59",
        "07:00-07:59",
        "08:00-08:59",
        "09:00-09:59",
        "10:00-10:59",
        "11:00-11:59",
        "12:00-12:59",
        "13:00-13:59",
        "14:00-14:59",
        "15:00-15:59",
        "16:00-16:59",
        "17:00-17:59",
        "18:00-18:59",
        "19:00-19:59",
        "20:00-20:59",
        "21:00-21:59",
        "22:00-22:59",
        "23:00-23:59",
      ],
    };
  }

  renderBar(data) {
    let ctx1 = document.getElementById("myChart");
    return new Chart(ctx1, {
      type: "bar",
      data: data,
      options: {
        plugins: {
          title: {
            display: true,
            text: "Average response time (ms) by hour of day:",
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
          responsive: true,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
        },
      },
    });
  }

  handleSelectChange(e) {
    switch (e.target.value) {
      case "default":
        this.state.chart.data = this.state.defaultData;
        this.state.chart.update();
        break;
      case "type":
        this.state.chart.data = this.state.typeData;
        this.state.chart.update();
        break;
      case "day":
        this.state.chart.data = this.state.dayData;
        this.state.chart.update();
        break;
      case "method":
        this.state.chart.data = this.state.methodData;
        this.state.chart.update();
        break;
      case "isp":
        this.state.chart.data = this.state.ispData;
        this.state.chart.update();
        break;
      default:
        console.log("Impossible.");
    }
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>Response time analysis</h3>
          <p>
            A bar chart representing average response time to requests in
            miliseconds (Y-axis), by hour of the day (X-axis).
          </p>
          <p>
            The bar chart can be filtered by response <code>content-type</code>,
            day of the week, <strong>HTTP</strong> request method and{" "}
            <strong>ISP</strong> (<strong>I</strong>nternet <strong>S</strong>
            ervice <strong>P</strong>rovider).
          </p>
        </header>
        {this.state.timeAnalysisData ? (
          <div
            className="form-group"
            style={{
              backgroundColor: "white",
              textAlign: "center",
              borderRadius: "25px",
              padding: "20px",
            }}
          >
            <label htmlFor="sel1">Choose a filter:</label>
            <select
              className="form-control"
              id="sel1"
              onChange={this.handleSelectChange}
            >
              <option value="default">none</option>
              <option value="type">content-type</option>
              <option value="day">day</option>
              <option value="method">request method</option>
              <option value="isp">ISP</option>
            </select>
          </div>
        ) : (
          <p style={{ color: "white" }}>Loading...</p>
        )}
        <canvas
          id="myChart"
          style={{ backgroundColor: "white", textAlign: "center" }}
        ></canvas>
      </div>
    );
  }
}
