import React, { Component } from "react";
import L from "leaflet";
import HeatmapOverlay from "leaflet-heatmap/leaflet-heatmap.js";
import "leaflet/dist/leaflet.css";

import VisualizationService from "../services/visualization.service";

export default class Visualization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: null,
    };
  }

  componentDidMount() {
    VisualizationService.getLocations().then((res) => {
      this.setState({
        locations: res.data,
      });

      let frequencies = this.state.locations.map((loc) => {
        return loc.freq;
      });

      let myMin = Math.min(...frequencies);
      let myMax = Math.max(...frequencies);

      let testData = {
        min: myMin,
        max: myMax,
        data: this.state.locations,
      };

      let baseLayer = L.tileLayer(
        "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "...",
          maxZoom: 18,
        }
      );

      let cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        // if scaleRadius is false it will be the constant radius used in pixels
        radius: 2,
        maxOpacity: 0.8,
        // scales the radius based on map zoom
        scaleRadius: true,
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries
        //   (there will always be a red spot with useLocalExtremas true)
        useLocalExtrema: true,
        // which field name in your data represents the latitude - default "lat"
        latField: "lat",
        // which field name in your data represents the longitude - default "lng"
        lngField: "lng",
        // which field name in your data represents the data value - default "value"
        valueField: "freq",
      };

      let heatmapLayer = new HeatmapOverlay(cfg);

      new L.Map("map-canvas", {
        center: new L.LatLng(38.2471218265094, 21.734447373086965),
        zoom: 4,
        layers: [baseLayer, heatmapLayer],
      });

      heatmapLayer.setData(testData);
    });
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>Data visualization</h3>
          <p>
            A heatmap containing all the locations corresponding to the IP
            addresses that you made <strong>HTTP</strong> requests to. Only
            HTML, PHP, ASP and JSP Web objects are taken into consideration. The
            intensity of a particular location represents the number of requests
            that have been made to the corresponding IP.
          </p>
        </header>
        <div
          style={{ height: 720, width: "100%", margin: "auto" }}
          id="map-canvas"
        >
          {!this.state.locations && <p>Loading...</p>}
        </div>
      </div>
    );
  }
}
