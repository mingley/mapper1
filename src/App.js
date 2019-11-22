import React, { Component } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';

const us_states_data = require('./data/us_states.geojson');
const us_outline_data = require('./data/us_outline.geojson');
const us_counties_data = require('./data/counties.geojson');
const congress_data = require('./data/congressional.geojson');

const TOKEN = process.env.REACT_APP_mapbox_token

export default class App extends Component {

  state = {
    viewport: {
      width: 1500,
      height: 450,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8,
    },
    show1: "none",
    show2: "none",
    show3: "visible",
    show4: "none",
    languageInfo: [1, 2, 3, 4, 5, 6, 7],
  };

  toggleLayers(number) {
    switch (number) {
      case 1:
        if (this.state.show1 === "visible") {
          this.setState({
            show1: "none"
          })
        } else {
          this.setState({
            show1: "visible"
          });
        };
        break;
      case 2:
        if (this.state.show2 === "visible") {
          this.setState({
            show2: "none"
          })
        } else {
          this.setState({
            show2: "visible"
          });
        }
        break;
      case 3:
        if (this.state.show3 === "visible") {
          this.setState({
            show3: "none"
          })
        } else {
          this.setState({
            show3: "visible"
          });
        };
        break;
      case 4:
        if (this.state.show4 === "visible") {
          this.setState({
            show4: "none"
          })
        } else {
          this.setState({
            show4: "visible"
          });
        };
        break;
      default:
        console.log("What are you trying to do?")
    }
  }

  handleLangs(e) {
    let state = e.features[0].properties.STATE;
    let county = e.features[0].properties.COUNTY;
    let url = `https://api.census.gov/data/2013/language?get=LAN7,LANLABEL,EST&for=county:${county}&in=state:${state}&key=${process.env.REACT_APP_DATA_KEY}`
    this.getLanguageInfo(url)
  }

  async getLanguageInfo(url) {
    try {
      let data = await fetch(url)
      let parsedData = await data.json()
      console.log(parsedData)
      this.setState({
        languageInfo: parsedData.map((post, i) => (
          <li key={i} className="list-group-item">{post.join(' ')}</li>
        ))
      });
    } catch (err) {
      console.error(err);
    }
  }


  render() {
    return (
      <div >
        <div>
          <ul className="list-group list-group-flush">
            {this.state.languageInfo}
          </ul>
        </div>
        <div style={{ textAlign: "center" }}>
          <button style={{ height: '10%', width: '10%' }} onClick={() => this.toggleLayers(2)}>US Border</button>
          <button style={{ height: '10%', width: '10%' }} onClick={() => this.toggleLayers(1)}>US States</button>
          <button style={{ height: '10%', width: '10%' }} onClick={() => this.toggleLayers(3)}>US Counties</button>
          <button style={{ height: '10%', width: '12%' }} onClick={() => this.toggleLayers(4)}>Congressional Districts</button><br />
        </div>
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({ viewport })}
          mapboxApiAccessToken={TOKEN}
          onClick={(e) => this.handleLangs(e)}
        >
          <h2>MapApp for 39DN</h2>
          <Source type="geojson" data={us_states_data}>
            <Layer
              id='states'
              type='line'
              paint={{
                "line-color": "blue",
              }}
              layout={{ 'visibility': this.state.show1, "line-sort-key": 1, }}
            />
          </Source>
          <Source type="geojson" data={us_outline_data}>
            <Layer
              id="outline"
              type="line"
              paint={{
                "line-color": "purple",
              }}
              layout={{ 'visibility': this.state.show2, "line-sort-key": 0, }}
            />
          </Source>
          <Source type="geojson" data={us_counties_data}>
            <Layer
              id="counties"
              type='fill'
              paint={{
                "fill-color": "#CEA5A5",
                "fill-opacity": 0.1,
                "fill-outline-color": "red",
              }}
              layout={{ 'visibility': this.state.show3, }}
            />
          </Source>
          <Source type="geojson" data={congress_data}>
            <Layer
              id="congressional"
              type="fill"
              paint={{
                "fill-color": "black",
                "fill-opacity": 0.2,
              }}
              layout={{ 'visibility': this.state.show4 }}
            />
          </Source>
        </ReactMapGL>
      </div>
    );
  }
}