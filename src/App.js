import React, { Component } from 'react';
import './index.css';
import axios from 'axios';
import ListVenues from './ListVenues';
import Header from './Header';


class App extends Component {
  state = {
    venues:[],
    markers:[],
  }

  componentDidMount(){
    this.getVenues();
  }

  //render the map on the browser
  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDI7JDsxk-XlStcVLlhCC0RIG3cThjrI7o&callback=initMap");
    window.initMap = this.initMap;
  }

  //Fetch venues from foursquare
  getVenues = () =>{
    const endpoint = 'https://api.foursquare.com/v2/venues/explore?';
    const params = {
      client_id:'PB04VOKESERJZ22UB0UDIKNGWCZERL5MEKI0VTPSDYCYJ4AS',
      client_secret:'RKJ2MX3YB5DO2IMNV12NULQSDCKHJBEKZY5CBF11A1SDVREL',
      ll:'-23.6660021,-46.5398341',
      query:'bares',
      v:'20180323',
      limit:20
    };
  
    axios.get(endpoint + new URLSearchParams(params))
      .then(response =>{
        this.setState({
          venues: response.data.response.groups[0].items,
        },this.loadMap())
      })
      .catch(error =>{
        console.log('ERROR' + error);
        window.alert('Desculpe, não foi possível acessar os dados do foursquare')
      });
  };
  
  // Initialize map with the google maps api
  initMap=() => {
    // array with custom styles of the map
    var styles = [
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#444444"}]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{"color": "#f2f2f2"}]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{"visibility": "off"}]
      },
      {
        "featureType": "poi.business",
        "elementType": "geometry.fill",
        "stylers": [{"visibility": "on"}]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
          {"saturation": -100},
          {"lightness": 45}
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [{"visibility": "simplified"}]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [{"visibility": "off"}]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [{"visibility": "off"}]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
              {"color": "#b4d4e1"},
              {"visibility": "on"}
          ]
      }
  ]
  
    const map = new window.google.maps.Map(document.getElementById('map'),{
      center:{lat:-23.6660021, lng: -46.5398341},
      zoom:15,
      mapTypeControl:false,
      styles
    });
    const infoWindow = new window.google.maps.InfoWindow();
    this.infoWindow = infoWindow

    // Put a marker in the map in each place fetched on foursquare
    // eslint-disable-next-line
    this.state.venues.map(v =>{
      const nameVenue = v.venue.name
      const positionVenue = {lat:v.venue.location.lat,lng:v.venue.location.lng}
      const addressVenue = v.venue.location.address

      const info = `<h1>${nameVenue}</h1><h4>${addressVenue}</h4>
                    <p> Informações obtidas no Foursquare</p>`

      //Custom the marker 
      function makeMarkerIcon(markerColor) {
        var markerImage = new window.google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new window.google.maps.Size(21, 34),
          new window.google.maps.Point(0, 0),
          new window.google.maps.Point(10, 34),
          new window.google.maps.Size(21,34));
        return markerImage;
        
      }

      const defaultIcon = makeMarkerIcon('8C7584')
      const highIcon = makeMarkerIcon('C9B1BD')

      const marker = new window.google.maps.Marker({
        position:positionVenue,
        map,
        animation: window.google.maps.Animation.DROP,
        title: nameVenue,
        icon:defaultIcon
      })

      this.state.markers.push(marker)

      //each marker has an infowindow that open when the marker is clicked
      function openMarkers(){
        infoWindow.setContent(info);
        infoWindow.open(map,marker)
      }

      marker.addListener('click', function(){
        openMarkers()
      })

      //each marker change the color when mouse over 
      marker.addListener('mouseover', function() {
        this.setIcon(highIcon);
        this.setAnimation(window.google.maps.Animation.BOUNCE)
      })

      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
        this.setAnimation(null)
      })
    })
  }

  render(){
    return(
      <main id = "App">
          <Header/>
          <ListVenues
            pageWrapId={"page-wrap"} outerContainerId={"App"} 
            venues = {this.state.venues}
            markers = {this.state.markers}
            notVisibleMarkers = {this.state.markers}
          />
        <div id = 'page-wrap'>
          <div id='map'></div>
        </div>
      </main>
    )
  }
}

function loadScript(url){
  const index  = window.document.getElementsByTagName("script")[0]
  const script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  script.onerror = function(){
    alert('Não foi possível carregar os dados do google maps')
  }
  index.parentNode.insertBefore(script, index)
};

export default App;