const Request = require('./services/request.js');
const BucketList = require('./models/bucketList.js')
const AllCountriesView = require('./views/allCountriesView.js')
const BucketCountriesView = require('./views/bucketCountriesView.js')
const Country = require('./models/country.js')
const MapWrapper = require('./views/mapWrapper.js')

const countryRequest = new Request('https://restcountries.eu/rest/v2/all');
const bucketListRequest = new Request("http://localhost:3000/api/countries");
const allCountriesView = new AllCountriesView();
const bucketCountriesView = new BucketCountriesView();
const bucketList = new BucketList();

const appStart = function(){

  countryRequest.get(getAllCountriesComplete);

  bucketListRequest.get(getAllBucketListCountries);

  drawMap();


}

const drawMap = function(){
  const mapDiv = document.getElementById('main-map')
  const zoomLevel = 15;
    const glasgow = [55.86515, -4.25763];
  const mainMap = new MapWrapper(mapDiv, glasgow, zoomLevel);
  };


const getAllCountriesComplete = function(allCountries){
  allCountries.forEach(function(country){
    allCountriesView.addCountry(country);

  });

  const addCountryButton = document.querySelector("#add-country-button")
  allCountriesView.makebuttonVisible(addCountryButton);
  addCountryButton.addEventListener("click", handleAddCountry);
}




const createRequestComplete = function(country){
  bucketCountriesView.showSelectedCountry(country);
  const deleteCountryButton = document.querySelector("#delete-country-button")
    allCountriesView.makebuttonVisible(deleteCountryButton);
    deleteCountryButton.addEventListener("click", handleRemoveCountry)
}

const handleAddCountry = function() {
  const option = document.querySelector("#countries-list")
  const newCountryName = option.value;

  const countryToAdd = new Country(newCountryName)
  bucketList.add(countryToAdd)
  bucketListRequest.post(countryToAdd, createRequestComplete);

}

const handleRemoveCountry = function() {
  const option = document.querySelector("#countries-list")
  const removeCountryName = option.value;
  // const countryToRemove = new Country(removeCountryName)
  bucketListRequest.delete(deleteRequestComplete)
  // bucketList.remove(removeCountryName)

}
const deleteRequestComplete = function() {
  bucketCountriesView.clear();
}


const getAllBucketListCountries = function(bucketList) {

  bucketList.forEach(function(country) {
    bucketCountriesView.showSelectedCountry(country);
  })

  if(bucketList.length > 0){
  const deleteCountryButton = document.querySelector("#delete-country-button")
    allCountriesView.makebuttonVisible(deleteCountryButton);
    deleteCountryButton.addEventListener("click", handleRemoveCountry)
  }
}










window.addEventListener('load', appStart);
