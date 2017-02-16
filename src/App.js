import React, { Component } from 'react';
import logo from './logo.svg';
import {Accordion, Panel, Row, Col, Grid} from 'react-bootstrap';
import BootstrapSlider from 'bootstrap-slider';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import _ from 'lodash';
import $ from 'jquery';
import './App.css';

// import {Tiles} from '../public/data/tiles'
import {Style} from '../public/data/style'

let defaultSettings = {
  curStyle: Style,
  zoom: 12,
  center: [-90.199402, 38.627001],
  maxBounds: [[-95.7741, 35.9957],[-89.0988, 40.6136]],
  value: 100,
  opacity:1
  // sliderStep: 0,
  // sliderMin: 0,
  // sliderMax: 100
}

// let map;

class App extends Component {
  constructor() {
    super();
    this.state = _.clone(defaultSettings);
  }

  updateBbox(box) {
    var llb = new mapboxgl.LngLatBounds(box[0],box[1]);
    let center = llb.getCenter()

    this.setState({
      bounds: box,
      center: center.toArray()
    })
  }

  updateZoom(zoom) {
    this.setState({
      zoom: zoom
    })
  }

  updateOpacity(value) {
    this.setState({opacity: parseInt(value, 10) / 100});
    // this.setPaintProperty('wms-test-layer', 'raster-opacity', parseInt(value, 10) / 100);
    //opacitySliderValue.textContent = e.target.value + '%';
  }

//Slider Controls
  // getInitialState() {
  //   return {
  //     value: 100,
  //     max : 100,
  //     min: 0
  //   };
  // }

  // increment(event) {
  //   var value = this.state.value;
  //   if(value >= this.state.max) {
  //     value = this.state.max - 1;
  //   }
  //   this.setState({
  //     value: value + 1
  //   });
  // }

  didChange(event) {
    let value = event.value || event;
    this.updateOpacity(event);
    this.setState({
      value: value
    })
  }

  render() {
    return (
      <Grid fluid={true}>
        <div className="App">
          <Row>
            <Col xs={6} md={6} >
              <p style={{textAlign:"left"}}>
                Projection Controller
              </p>
            </Col>
            <Col xs={6} md={6} >
              <Slider min={0} max={this.state.max} step={1} value={this.state.value} toolTip={true} onSlide={this.didChange.bind(this)} />
            </Col>
          </Row>

          <Row>
            <div style={{position:"relative", left: "10%", top:"30px", overflowY:"scroll"}}>
              <Map opacity={this.state.opacity} zoom={this.state.zoom} maxBounds={this.state.maxBounds} center={this.state.center} curStyle={this.state.curStyle} updateBbox={this.updateBbox.bind(this)} updateZoom={this.updateZoom.bind(this)} updateOpacity={this.updateOpacity.bind(this)} />
            </div>
          </Row>
        </div>
      </Grid>
    );
  }
}

class Map extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1IjoidmVldiIsImEiOiIzdzVEVDdrIn0.z3N2X1Fk7rx4wXesVf0-rQ'
    //mapboxgl.accessToken = 'pk.eyJ1IjoiamZyaWVkaG9mZiIsImEiOiJjaW1nbjg4aWowMDJodTJrbzhoazBpb3owIn0._HrRJuc1VANdVpsFwEhBew';

    let map = new mapboxgl.Map({
      container: 'map',
      style: this.props.curStyle,
      zoom: this.props.zoom,
      center: this.props.center,
      maxBounds: this.props.maxBounds
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', (e) => {
      let bounds = map.getBounds();

      map.addLayer({
        'id': 'wms-test-layer',
        'type': 'raster',
        'source': {
            'type': 'raster',
            'tiles': [
                'http://mapwarper.net/maps/tile/18646/{z}/{x}/{y}.png'
            ],
            'tileSize': 256
        },
        'paint': {}
      });

      console.log(map.getLayer("wms-test-layer"))


      // opacitySlider.addEventListener('input', function(e) {
      //   // Adjust the layers opacity. layer here is arbitrary - this could
      //   // be another layer name found in your style or a custom layer
      //   // added on the fly using `addSource`.
      //   map.setPaintProperty('wms-test-layer', 'raster-opacity', parseInt(e.target.value, 10) / 100);

      //   // Value indicator
      //   opacitySliderValue.textContent = e.target.value + '%';
      // });
    });

    map.on('moveend', (e) => {
      let bounds = map.getBounds();
    });

    map.on('zoomend', (e) => {
      this.props.updateZoom(map.getZoom());
    });

    this.setState({
      map: map
    });
  }

  componentWillReceiveProps(nextProps) {
    this.state.map.setStyle(nextProps.curStyle)
    console.log(this.state.map.getLayer('wms-test-layer'))
    if (this.state.map.getLayer('wms-test-layer')) {

      this.state.map.setPaintProperty('wms-test-layer', 'raster-opacity', nextProps.opacity);  
    }
  }

  componentWillUnmount() {

  }

  render() {
    console.log(this.state)

    return (
      <div>
        <div id="map">

        </div>
      </div>
    )
  }
}

class Slider extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUpdate(nextProps, nextState) {
    nextState.slider.setValue(nextProps.value);
  }

  componentDidMount() {
    let toolTip = this.props.toolTip ? 'show' : 'hide';
    let slider = new BootstrapSlider(this.refs.slider, {
      id: this.props.id,
      min: this.props.min,
      max: this.props.max,
      step: this.props.step,
      value: this.props.value,
      tooltip: toolTip
    });
    
    slider.on('slide', function(event) {
      this.props.onSlide(event);
      this.state.slider.setValue(event);
    }.bind(this));

    slider.on('slideStop', function(event) {
      this.props.onSlide(event);
      this.state.slider.setValue(event);
    }.bind(this));

    this.setState({
      slider: slider
    });
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div ref='slider' />
    )
  }
}

Slider.propTypes = {
  id: React.PropTypes.string,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  step: React.PropTypes.number,
  value: React.PropTypes.number.isRequired,
  toolTip: React.PropTypes.bool,
  onSlide: React.PropTypes.func
};

Slider.defaultProps = {
  min: 0,
  max: 100,
  step: 1,
  value: 50,
  toolTip: false,
  onSlide: function() {}
};


export default App;
