import React, { Component } from 'react';
import ReactMapGL, { Source, Layer} from 'react-map-gl';

const us_states_data = require('./data/us_states.geojson');
const us_outline_data = require('./data/us_outline.geojson');
const us_counties_data = require('./data/counties.geojson');
const congress_data = require('./data/congressional.geojson');

const TOKEN = process.env.REACT_APP_mapbox_token

export default class App extends Component {

  state = {
    viewport: {
      width: 1500,
      height: 650,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8,
    },
    show1: "none",
    show2: "none",
    show3: "visible",
    show4: "none",
    languageInfo: [],
  };

  handleClick(number) {
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

  handleLangs(e){
    let state = e.features[0].properties.STATE;
    let county = e.features[0].properties.COUNTY;
    let url = `https://api.census.gov/data/2013/language?get=LAN7,LANLABEL,EST&for=county:${county}&in=state:${state}&key=${process.env.REACT_APP_DATA_KEY}`
    this.getLanguageInfo(url);
  }

  getLanguageInfo(url){
    fetch(url)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        response.json().then(function(data) {
          console.log(data) ;
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
  }

  renderLanguageInfo(){
    
  }


  render() {
    return (
      <div >
        <div style={{ textAlign: "center" }}>
          <button style={{ height: '10%', width: '10%' }} onClick={() => this.handleClick(2)}>US Border</button>
          <button style={{ height: '10%', width: '10%' }} onClick={() => this.handleClick(1)}>US States</button>
          <button style={{ height: '10%', width: '10%' }} onClick={() => this.handleClick(3)}>US Counties</button>
          <button style={{ height: '10%', width: '12%' }} onClick={() => this.handleClick(4)}>Congressional Districts</button><br />
        </div>
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({ viewport })}
          mapboxApiAccessToken={TOKEN}
          onClick={(e)=>this.handleLangs(e)}
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
              type="line"
              paint={{
                "line-color": "black",
              }}
              layout={{ 'visibility': this.state.show4, "line-sort-key": 2 }}
            />
          </Source>
        </ReactMapGL>
      </div>
    );
  }
}