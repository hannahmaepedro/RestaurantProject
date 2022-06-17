// creating data to store the object
let restaurantArray = [];

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

// restaurantArray.push(new RestaurantObject("Cuidad", "Georgetown", "WA", "http://www.ciudadseattle.com/", "Mediteranian", "$$"));
// restaurantArray.push(new RestaurantObject("Pomodoro", "Seattle", "WA", "https://pomodoro.net/", "Italian", "$$"));
// restaurantArray.push(new RestaurantObject("Asadero Sinaloa", "Kent", "WA", "https://asaderoprime.com/", "Other", "$$$"));

let selectedCuisine = "not selected";
let selectedPrice = "not selected";

document.addEventListener("DOMContentLoaded", function () {
    //createList();

    //add button events 
    //Add Restaurant info
    document.getElementById("buttonAdd").addEventListener("click", function () {
        restaurantArray.push(new RestaurantObject(document.getElementById("name").value),
        document.getElementById("city").value, 
        document.getElementById("state".value),
        document.getElementById("URL").value),
        selectedCuisine;
        selectedPrice;
        document.location.href= "index.html#ListAll";
    });

    //clear button
    document.getElementById("buttonClear").addEventListener("click", function () {
        document.getElementById("name").value = "";
        document.getElementById("city").value = "";
        document.getElementById("state").value = "";
        document.getElementById("URL").value = "";
    }); 

// ////code using jQuery
//     $(document).bind("change", "#select-cuisine", function (event, ui) {
//         selectedCuisine = $('#select-cuisine').val();
//     });

//     $(document).bind("change", "#select-priceRange", function (event, ui) {
//         selectedPrice = $('#select-priceRange').val();
//     });

////code that does the same thing but not using jQuery
    document.getElementById("select-cuisine").addEventListener("change", function () {
        selectedCuisine = $("#select-cuisine").val();
    });

    document.getElementById("select-priceRange").addEventListener("change", function () {
        selectedPrice = $("#select-priceRange").val();
    });

///sort by name
    document.getElementById("buttonSortName").addEventListener("click", function () {
        restaurantArray.sort(dynamicSort("Name"));
        createList();
        document.location.href = "index.html#ListAll";
    });

////sort by price range
    document.getElementById("buttonSortPriceRange").addEventListener("click", function () {
        restaurantArray.sort(dynamicSort("Price"));
        createList();
        document.location.href = "index.html#ListAll";
    });



    //////end of events button


    // PAGE BEFORE SHOW   *************************************************************************
    $(document).on("pagebeforeshow", "#ListAll", function (event) {   // have to use jQuery 
     //   createList();
    });



    // need one for our details page to fill in the info based on the passed in ID
    $(document).on("pagebeforeshow", "#details", function (event) {   
        let restaurantID = localStorage.getItem("parm");  // get the unique key back from the dictionary
        let localID = GetArrayPointer (restaurantID); // map to which array it is
        //document.getElementById("someID").innerHTML = restaurantID;

        restaurantArray = JSON.parse(localStorage.getItem("restaurantArray"));  
   
        document.getElementById("oneName").innerHTML = "Restaurant Name: " + restaurantArray[localID].Name;
        document.getElementById("oneCity").innerHTML = "City: " + restaurantArray[localID].City;
        document.getElementById("oneState").innerHTML = "State: " + restaurantArray[localID].State;
        document.getElementById("oneURL").innerHTML = "Website: " + restaurantArray[localID].URL;
        document.getElementById("oneCuisine").innerHTML = "Cuisine: " + restaurantArray[localID].Cuisine;
        document.getElementById("onePrice").innerHTML = "Price: " + restaurantArray[localID].Price;

        // clear prior data

    // //// button for the website on DETAILS PAGE
    // document.getElementById("URL").addEventListener("click", function () {
    //     window.open(document.getElementById("oneURL").innerHTML);
    // });

        document.getElementById("URLform").action = restaurantArray[localID].URL;
    });
 
// END OF PAGE BEFORE SHOW CODE *************************************************************************

});  
// end of wait until document has loaded event  *************************************************************************


function createList() {
    //clear prior data entered
    let mustVisitList = document.getElementById("mustVisitList");
    //theList.innerHTML = "";
    //removing old data to not get duplicates
    while (mustVisitList.firstChild) {
        mustVisitList.removeChild(mustVisitList.firstChild)
    };

    $.get("/getAllRestaurants", function(data, status){  // AJAX get
        restaurantArray = data;
    })

    let myUl = document.createElement("ul");
    restaurantArray.forEach(function (oneRestaurant,) {
        let myLi = document.createElement("li");
        myLi.classList.add("oneRestaurant");

        // use the html5 "data-parm" to store the ID of this particular restaurant object 
        myLi.setAttribute("data-parm", oneRestaurant.ID);
        myLi.innerHTML = oneRestaurant.Name + " " + oneRestaurant.Cuisine + " " + oneRestaurant.Price + " ";
        myUl.appendChild(myLi);
    });
    mustVisitList.appendChild(myUl)

    // now we have the HTML done to display out list, 
    // next we make them active buttons
    // set up an event for each new li item
    // let liArray = document.getElementsByClassName("oneRestaurant");
    // Array.from(liArray).forEach(function (element){
    //     element.addEventListener("click", function() {
    //     let parm = this.getAttribute("data-parm");
    //     localStorage.setItem("parm", parm);
    // //convert array to "string"
    //     let stringRestaurantArray = JSON.stringify(restaurantArray);
    //     localStorage.setItem("restaurantArray", stringRestaurantArray);

    // //will jump to page that will use on item
    //     document.location.href = "index.html#details";
    //     });
    // });

    // ////create an array of elements from thee "List", array supports forEach, HTMLCollection doesnt
    
    let liList = document.getElementsByClassName("oneRestaurant");
    let newRestaurantArray = Array.from(liList);

    //add event method for each "li"
    newRestaurantArray.forEach(function (element) {
        element.addEventListener("click", function() {
            let parm = this.getAttribute("data-parm");
            localStorage.setItem("parm", parm);
            
            //convert array to "string"
            let stringRestaurantArray = JSON.stringify(restaurantArray);
            localStorage.setItem("restaurantArray", stringRestaurantArray);

            //will jump to page that will use on item
            document.location.href = "index.html#details";
        });
    });
};


// cycles thru the array to find the array element with a matching ID
function GetArrayPointer(localID) {
    console.log(restaurantArray);
    console.log(localID);
    for (let i = 0; i < restaurantArray.length; i++) {
        if (localID === restaurantArray[i].ID) {
            return i;
        }
    }
}

function dynamicSort(property) {
    return function (a,b) {
        return a[property].localeCompare(b[property]);
        }
};
