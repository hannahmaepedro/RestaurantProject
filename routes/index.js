var express = require('express');
var router = express.Router();

let serverArray = [];

//define a constructor to create restaurant object
let RestaurantObject = function (pName, pCity, pState, pURL, pCuisine, pPrice) {
    this.Name = pName;
    this.City = pCity;
    this.State = pState;
    this.URL = pURL;
    this.Cuisine = pCuisine;
    this.Price = pPrice;
    this.ID = Math.random().toString(16).slice(5);
}

serverArray.push(new RestaurantObject("Cuidad", "Georgetown", "WA", "http://www.ciudadseattle.com/", "Mediteranian", "$$"));
serverArray.push(new RestaurantObject("Pomodoro", "Seattle", "WA", "https://pomodoro.net/", "Italian", "$$"));
serverArray.push(new RestaurantObject("Asadero Sinaloa", "Kent", "WA", "https://asaderoprime.com/", "Other", "$$$"));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

/* GET all REASTAURANT data. */
router.get('/getAllRestaurants', function(req, res) {
  res.status(200).json('serverArray');
});

module.exports = router;
