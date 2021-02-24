import React, { Component } from "react";

import AdminVisualizationService from "../services/admin-visualization.service";

import { StaticMap } from "react-map-gl";
import { DeckGL } from "deck.gl";
import FlowMapLayer from "@flowmap.gl/core";

export default class AdminVisualization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visualizationData: null,
    };
  }

  componentDidMount() {
    AdminVisualizationService.getAdminVisualizationData().then((res) => {
      this.setState({ visualizationData: res.data });
    });
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>Data visualization</h3>
          <p>
            A map containing markers for locations corresponding to IP
            addresses. If an <strong>HTTP</strong> request was made to marker B
            from marker A, markers A and B will be connected by a line. Line
            thickness represents the number of requests that have been made to
            marker B from marker A.
          </p>
        </header>
        {this.state.visualizationData ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 720,
            }}
          >
            <DeckGL
              controller={true}
              initialViewState={{ longitude: 0, latitude: 0, zoom: 1 }}
              layers={[
                new FlowMapLayer({
                  id: "my-flowmap-layer",
                  locations: this.state.visualizationData.locations,
                  flows: this.state.visualizationData.flows,
                  getFlowMagnitude: (flow) => flow.count || 0,
                  getFlowOriginId: (flow) => flow.origin,
                  getFlowDestId: (flow) => flow.dest,
                  getLocationId: (loc) => loc.id,
                  getLocationCentroid: (location) => [
                    location.lon,
                    location.lat,
                  ],
                }),
              ]}
            >
              <StaticMap
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOXACCESSTOKEN}
              />
            </DeckGL>
          </div>
        ) : (
          <p style={{ color: "white" }}>Loading...</p>
        )}
      </div>
    );
  }
}
