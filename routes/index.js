var express = require('express');
var router = express.Router();

// server
let serverArray = [];

//define a constructor to create restaurant object
let RestaurantObject = function (pName, pCity, pState, pURL, pCuisine, pPrice) {
  this.ID = Math.random().toString(16).slice(5);
  this.Name = pName;
  this.City = pCity;
  this.State = pState;
  this.URL = pURL;
  this.Cuisine = pCuisine;
  this.Price = pPrice;
}

serverArray.push(new RestaurantObject("Cuidad", "Georgetown", "WA", "http://www.ciudadseattle.com/", "Mediteranian", "$$"));
serverArray.push(new RestaurantObject("Pomodoro", "Seattle", "WA", "https://pomodoro.net/", "Italian", "$$"));
serverArray.push(new RestaurantObject("Asadero Sinaloa", "Kent", "WA", "https://asaderoprime.com/", "Other", "$$$"));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

/* GET ALL restaurant data. */
router.get('/getAllRestaurants', function(req, res) {
  res.status(200).json(serverArray);
});

/*  ADD one new restaurant */
router.post('/AddRestaurant', function(req, res) {
  const newRestaurant = req.body;
  newRestaurant.ID = lastID++;
  serverArray.push(newRestaurant);
  res.status(200).json(newRestaurant);
});

/* add route for DELETE restaurant */
router.delete('/DeleteRestaurant/:ID', (req, res) => {
  const delID = req.params.ID;
  let found = false;
  let pointer = GetArrayPointer(delID);
  if (pointer == -1) {
    console.log("not found");
    return res.status(500).json ({
      status: "error -no such ID"
    });
  }
  else {
    serverArray.splice(pointer, 1); // remove one element at index
    res.send('Restaurant with ID: ' + delID + 'deleted!');
  }
});

// cycles thru the array to find the array element with a matching ID
function GetArrayPointer(localID) {
  console.log(serverArray);
  console.log(localID);
  for (let i = 0; i < serverArray.length; i++) {
      if (localID === serverArray[i].ID) {
          return i;
      }
  }
  return -1; // flag to say did not find a movie
}

module.exports = router;
