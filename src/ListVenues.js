import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp';
import {slide as Menu} from 'react-burger-menu';


class ListVenues extends Component{
  state = {
    query:''
  }
  // Click event on marker 
  onMarker = venuesName => {
    const {markers} = this.props;
    // eslint-disable-next-line
    markers.map(m =>{
      if(m.title === venuesName){
        window.google.maps.event.trigger(m,'click');
      }
    })
  }

  onQuery = query => {
    this.setState({query:query.trim()});
  }

  clearQuery = () =>{
    this.setState({query:''});
  }

  render(){
    const {venues,markers} = this.props
    const {query} = this.state

    markers.map(m=> m.setVisible(true))
    let showingVenues
    let notVisibleMarkers

    // filter the locations when a query is typed
    if(query){
      const match = new RegExp(escapeRegExp(query),'i');
      showingVenues = venues.filter(v =>
        match.test(v.venue.name)
        );
      notVisibleMarkers = markers.filter(m => 
        showingVenues.every(v =>
          v.venue.name !== m.title)
      );
      notVisibleMarkers.forEach(m => m.setVisible(false));
    } else {
      showingVenues = venues;
      markers.forEach(m => m.setVisible(true));
    }
    
    return(
      <Menu  noOverlay 
      className = 'bm-menu-wrap'
      >

          <input
          type = 'text'
          className = 'venues-filter'
          placeholder = 'Buscar...'
          value = {query}
          onChange = {(event) => this.onQuery(event.target.value)}>
          </input>

 
        <ol>
         { showingVenues.map((v)=>(
            <li
            className = 'venue-list-item'
            onClick = {()=>{
              this.onMarker(v.venue.name)
            }}
            key = {v.venue.name}>
              {v.venue.name}
            </li>
          ))}
        </ol>

      </Menu>
    )
  }
}



export default ListVenues