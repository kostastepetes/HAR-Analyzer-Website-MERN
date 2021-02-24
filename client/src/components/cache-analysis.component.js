import React, { Component } from "react";
import Chart from "chart.js";
import Gradient from "javascript-color-gradient";

import CacheAnalysisService from "../services/cache-analysis.service";

export default class CacheAnalysis extends Component {
  constructor(props) {
    super(props);

    this.renderChartA = this.renderChartA.bind(this);
    this.getTtlData = this.getTtlData.bind(this);
    this.getTtlDataByIsp = this.getTtlDataByIsp.bind(this);
    this.handleSel1Change = this.handleSel1Change.bind(this);

    this.renderChartB = this.renderChartB.bind(this);
    this.getMinMaxData = this.getMinMaxData.bind(this);
    this.getMinMaxDataByIsp = this.getMinMaxDataByIsp.bind(this);
    this.handleSel2Change = this.handleSel2Change.bind(this);

    this.renderChartC = this.renderChartC.bind(this);
    this.getCacheabilityData = this.getCacheabilityData.bind(this);
    this.getCacheabilityDataByIsp = this.getCacheabilityDataByIsp.bind(this);
    this.handleSel3Change = this.handleSel3Change.bind(this);

    this.state = {
      isps: null,
      options: null,

      ttlData: null,
      ttlDataDef: null,
      ttlDataByIsp: null,
      chartA: null,

      minMaxData: null,
      minMaxDataDef: null,
      minMaxDataByIsp: null,
      chartB: null,

      cacheabilityData: null,
      cacheabilityDataDef: null,
      cacheabilityDataByIsp: null,
      chartC: null,
    };
  }

  componentDidMount() {
    CacheAnalysisService.getTTL().then((res) => {
      this.setState({
        ttlData: res.data,
        ttlDataDef: this.getTtlData(res.data.a),
        ttlDataByIsp: null,
      });

      this.setState({ chartA: this.renderChartA(this.state.ttlDataDef) });

      this.setState({
        isps: [...new Set(this.state.ttlData.aByIsp.map((item) => item.isp))],
      });
      let options = [{ text: "all", value: "all" }];
      let restOptions = this.state.isps.map((isp) => {
        return { text: isp, value: isp };
      });

      let finalOptions = options.concat(restOptions);

      let optionsSel1 = document.getElementById("sel1").options;
      finalOptions.forEach((option) =>
        optionsSel1.add(new Option(option.text, option.value, option.selected))
      );
    });

    CacheAnalysisService.getMinMaxDirectivePercentages().then((res) => {
      this.setState({
        minMaxData: res.data,
        minMaxDataDef: this.getMinMaxData(res.data.b),
        minMaxDataByIsp: null,
      });

      this.setState({ chartB: this.renderChartB(this.state.minMaxDataDef) });

      this.setState({
        isps: [
          ...new Set(this.state.minMaxData.bByIsp.map((item) => item.isp)),
        ],
      });
      let options = [{ text: "all", value: "all" }];
      let restOptions = this.state.isps.map((isp) => {
        return { text: isp, value: isp };
      });

      let finalOptions = options.concat(restOptions);

      let optionsSel1 = document.getElementById("sel2").options;
      finalOptions.forEach((option) =>
        optionsSel1.add(new Option(option.text, option.value, option.selected))
      );
    });

    CacheAnalysisService.getCacheabilityDirectivePercentages().then((res) => {
      this.setState({
        cacheabilityData: res.data,
        cacheabilityDataDef: this.getCacheabilityData(res.data.c),
        cacheabilityDataByIsp: null,
      });

      this.setState({
        chartC: this.renderChartC(this.state.cacheabilityDataDef),
      });

      this.setState({
        isps: [
          ...new Set(
            this.state.cacheabilityData.cByIsp.map((item) => item.isp)
          ),
        ],
      });
      let options = [{ text: "all", value: "all" }];
      let restOptions = this.state.isps.map((isp) => {
        return { text: isp, value: isp };
      });

      let finalOptions = options.concat(restOptions);

      let optionsSel3 = document.getElementById("sel3").options;
      finalOptions.forEach((option) =>
        optionsSel3.add(new Option(option.text, option.value, option.selected))
      );
    });
  }

  getTtlData(data) {
    const colorGradient = new Gradient();

    const color1 = "#3F2CAF";
    const color2 = "#e9446a";
    const color3 = "#edc988";
    const color4 = "#607D8B";

    colorGradient.setMidpoint(data.data.length);

    colorGradient.setGradient(color1, color2, color3, color4);

    let myDataset = [];
    let i = 0;
    data.data.forEach((element) => {
      let temp = {
        label: element.contentType,
        data: element.buckets,
        backgroundColor: colorGradient.getArray()[i],
        stack: `Stack ${i}`,
      };
      myDataset.push(temp);
      i++;
    });

    let step = data.step;
    let myLabels = [];
    if (step > 0) {
      myLabels = [
        step,
        2 * step,
        3 * step,
        4 * step,
        5 * step,
        6 * step,
        7 * step,
        8 * step,
        9 * step,
        10 * step,
      ].map(String);
    } else {
      myLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    }

    return {
      datasets: myDataset,
      labels: myLabels,
    };
  }

  getTtlDataByIsp(data, isp) {
    let dataByIsp = data.filter((item) => item.isp === isp)[0];
    const colorGradient = new Gradient();
    const color1 = "#3F2CAF";
    const color2 = "#e9446a";
    const color3 = "#edc988";
    const color4 = "#607D8B";

    colorGradient.setMidpoint(dataByIsp.data.length);

    colorGradient.setGradient(color1, color2, color3, color4);

    let myDataset = [];
    let i = 0;
    dataByIsp.data.forEach((element) => {
      let temp = {
        label: element.contentType,
        data: element.buckets,
        backgroundColor: colorGradient.getArray()[i],
        stack: `Stack ${i}`,
      };
      myDataset.push(temp);
      i++;
    });

    let step = dataByIsp.step;
    let myLabels = [];
    if (step > 0) {
      myLabels = [
        step,
        2 * step,
        3 * step,
        4 * step,
        5 * step,
        6 * step,
        7 * step,
        8 * step,
        9 * step,
        10 * step,
      ].map(String);
    } else {
      myLabels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    }

    return {
      datasets: myDataset,
      labels: myLabels,
    };
  }

  renderChartA(data) {
    let ctx1 = document.getElementById("chartA");

    return new Chart(ctx1, {
      type: "bar",
      data: data,
      options: {
        plugins: {
          title: {
            display: true,
            text: "Distribution of TTL (ms) by content-type:",
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

  getMinMaxData(data) {
    const colorGradient = new Gradient();

    const color1 = "#3F2CAF";
    const color2 = "#e9446a";
    const color3 = "#edc988";
    const color4 = "#607D8B";

    colorGradient.setMidpoint(data.length);

    colorGradient.setGradient(color1, color2, color3, color4);

    let myDataset = [];
    let i = 0;
    data.forEach((element) => {
      let temp = {
        label: element.contentType,
        data: element.percentages,
        backgroundColor: colorGradient.getArray()[i],
        stack: `Stack ${i}`,
      };
      myDataset.push(temp);
      i++;
    });

    let myLabels = ["min-fresh", "max-stale"];

    return {
      datasets: myDataset,
      labels: myLabels,
    };
  }

  getMinMaxDataByIsp(data, isp) {
    let dataByIsp = data.filter((item) => item.isp === isp)[0];

    const colorGradient = new Gradient();

    const color1 = "#3F2CAF";
    const color2 = "#e9446a";
    const color3 = "#edc988";
    const color4 = "#607D8B";

    colorGradient.setMidpoint(dataByIsp.data.length);

    colorGradient.setGradient(color1, color2, color3, color4);

    let myDataset = [];
    let i = 0;
    dataByIsp.data.forEach((element) => {
      let temp = {
        label: element.contentType,
        data: element.percentages,
        backgroundColor: colorGradient.getArray()[i],
        stack: `Stack ${i}`,
      };
      myDataset.push(temp);
      i++;
    });

    let myLabels = ["min-fresh", "max-stale"];

    return {
      datasets: myDataset,
      labels: myLabels,
    };
  }

  renderChartB(data) {
    let ctx1 = document.getElementById("chartB");

    return new Chart(ctx1, {
      type: "bar",
      data: data,
      options: {
        plugins: {
          title: {
            display: true,
            text:
              "Percentage of min-fresh and max-stale directives by content-type:",
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

  getCacheabilityData(data) {
    const colorGradient = new Gradient();

    const color1 = "#3F2CAF";
    const color2 = "#e9446a";
    const color3 = "#edc988";
    const color4 = "#607D8B";

    colorGradient.setMidpoint(data.length);

    colorGradient.setGradient(color1, color2, color3, color4);

    let myDataset = [];
    let i = 0;
    data.forEach((element) => {
      let temp = {
        label: element.contentType,
        data: element.percentages,
        backgroundColor: colorGradient.getArray()[i],
        stack: `Stack ${i}`,
      };
      myDataset.push(temp);
      i++;
    });

    let myLabels = ["public", "private", "no-cache", "no-store"];

    return {
      datasets: myDataset,
      labels: myLabels,
    };
  }

  getCacheabilityDataByIsp(data, isp) {
    let dataByIsp = data.filter((item) => item.isp === isp)[0];

    const colorGradient = new Gradient();

    const color1 = "#3F2CAF";
    const color2 = "#e9446a";
    const color3 = "#edc988";
    const color4 = "#607D8B";

    colorGradient.setMidpoint(dataByIsp.data.length);

    colorGradient.setGradient(color1, color2, color3, color4);

    let myDataset = [];
    let i = 0;
    dataByIsp.data.forEach((element) => {
      let temp = {
        label: element.contentType,
        data: element.percentages,
        backgroundColor: colorGradient.getArray()[i],
        stack: `Stack ${i}`,
      };
      myDataset.push(temp);
      i++;
    });

    let myLabels = ["public", "private", "no-cache", "no-store"];

    return {
      datasets: myDataset,
      labels: myLabels,
    };
  }

  renderChartC(data) {
    let ctx1 = document.getElementById("chartC");

    return new Chart(ctx1, {
      type: "bar",
      data: data,
      options: {
        plugins: {
          title: {
            display: true,
            text: "Percentage of cacheability directives by content-type:",
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

  handleSel1Change(e) {
    switch (e.target.value) {
      case "all":
        this.state.chartA.data = this.state.ttlDataDef;
        this.state.chartA.update();
        break;
      default:
        this.state.chartA.data = this.getTtlDataByIsp(
          this.state.ttlData.aByIsp,
          e.target.value
        );
        this.state.chartA.update();
    }
  }

  handleSel2Change(e) {
    switch (e.target.value) {
      case "all":
        this.state.chartB.data = this.state.minMaxDataDef;
        this.state.chartB.update();
        break;
      default:
        this.state.chartB.data = this.getMinMaxDataByIsp(
          this.state.minMaxData.bByIsp,
          e.target.value
        );
        this.state.chartB.update();
    }
  }

  handleSel3Change(e) {
    switch (e.target.value) {
      case "all":
        this.state.chartC.data = this.state.cacheabilityDataDef;
        this.state.chartC.update();
        break;
      default:
        this.state.chartC.data = this.getCacheabilityDataByIsp(
          this.state.cacheabilityData.cByIsp,
          e.target.value
        );
        this.state.chartC.update();
    }
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>HTTP header analysis</h3>
          <p>
            A variety of bar charts containing information regarding cache usage
            among Web objects.
          </p>
          <p>
            All bar charts can be parameterized by <strong>ISP</strong> (
            <strong>I</strong>nternet <strong>S</strong>ervice{" "}
            <strong>P</strong>rovider).
          </p>
        </header>
        <div
          style={{
            backgroundColor: "white",
            textAlign: "center",
            borderRadius: "25px",
            padding: "20px",
          }}
        >
          <h3>TTL (Time To Live)</h3>
          <p>
            Histogram representing the distribution of response TTLs by response{" "}
            <code>content-type</code>:
          </p>
          {this.state.ttlData ? (
            <div className="form-group">
              <label htmlFor="sel1">Choose an ISP:</label>
              <select
                className="from-control"
                id="sel1"
                onChange={this.handleSel1Change}
              ></select>
            </div>
          ) : (
            <p>Loading...</p>
          )}
          <canvas id="chartA"></canvas>
          <hr />
          <h3>
            <code>max-stale</code> and <code>min-fresh</code> directives
          </h3>
          <p>
            Bar chart representing the percentage of <code>max-stale</code> and{" "}
            <code>min-fresh</code> directives in requests (Y-axis), by request{" "}
            <code>content-type</code> (X-axis):
          </p>
          {this.state.minMaxData ? (
            <div className="form-group">
              <label htmlFor="sel2">Choose an ISP:</label>
              <select
                className="from-control"
                id="sel2"
                onChange={this.handleSel2Change}
              ></select>
            </div>
          ) : (
            <p>Loading...</p>
          )}
          <canvas id="chartB"></canvas>
          <hr />
          <h3>Cacheability directives</h3>
          <p>
            Bar chart representing the percentage of cacheability directives (
            <code>public</code>, <code>private</code>, <code>no-cache</code>,{" "}
            <code>no-store</code>) in responses (Y-axis), by response{" "}
            <code>content-type</code> (X-axis):
          </p>
          {this.state.cacheabilityData ? (
            <div className="form-group">
              <label htmlFor="sel3">Choose an ISP:</label>
              <select
                className="from-control"
                id="sel3"
                onChange={this.handleSel3Change}
              ></select>
            </div>
          ) : (
            <p>Loading...</p>
          )}
          <canvas id="chartC"></canvas>
        </div>
      </div>
    );
  }
}
