
var _ = require('underscore');


var RefugeeHighlightMixin = {

  storedDestinationCountries: [],
  storedOriginCountries: [],
  highlightStamp: 0,


  getInitialState: function() {
  	return {
  		hoveredCountry: null,
  		clickedCountry: null
  	}
  },


  handleMapClick: function() {
  	this.setState({clickedCountry: this.state.hoveredCountry});
  },


  setHoveredCountry: function(country) {
    this.setState({hoveredCountry: country});
    this.updateHighlight(country);
  },


  getHighlightedCountry: function() {
  	if (this.state.clickedCountry != null) {
  		return this.state.clickedCountry;
  	}
  	return this.state.hoveredCountry;
  },


  getDestinationCountries: function(country) {
    return this.props.refugeeCountsModel
      .getDestinationCountriesByStamp(country, this.getStamp());
  },


  getOriginCountries: function(country) {
    return this.props.refugeeCountsModel
      .getOriginCountriesByStamp(country, this.getStamp());
  },


  updateHighlight: function(country) {
    var dc = this.getDestinationCountries(country);
    var oc = this.getOriginCountries(country);

    // In some cases there are people
    // seeking asylum in both directions
    // for a country pair.
    //
    // In such a situtation we decide on which
    // which side to display based on whether 
    // [country] is mainly a sender or receiver 
    //
    if (oc.length > dc.length) {
      dc =_.difference(dc, oc);
    } else {
      oc = _.difference(oc, dc);
    }

    window._ = require('underscore');
    window.jdas = this;

    this.country = country;
    if (dc.length != this.storedDestinationCountries.length
      || oc.length != this.storedOriginCountries.length) {
      this.storedDestinationCountries = dc;
      this.storedOriginCountries = oc;
      this.setState({});
    }
  },


  getHighlightLayerParams: function() {
    return {
      country: this.getHighlightedCountry(),
      originCountries: this.storedOriginCountries,
      destinationCountries: this.storedDestinationCountries
    }
  },

}


module.exports = RefugeeHighlightMixin;