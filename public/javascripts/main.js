// creating data to store the object
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

// restaurantArray.push(new RestaurantObject("Cuidad", "Georgetown", "WA", "http://www.ciudadseattle.com/", "Mediteranian", "$$"));
// restaurantArray.push(new RestaurantObject("Pomodoro", "Seattle", "WA", "https://pomodoro.net/", "Italian", "$$"));
// restaurantArray.push(new RestaurantObject("Asadero Sinaloa", "Kent", "WA", "https://asaderoprime.com/", "Other", "$$$"));

let selectedCuisine = "not selected";
let selectedPrice = "not selected";

document.addEventListener("DOMContentLoaded", function () {

    // createList();

    //add button events 
    //Add Restaurant info
    document.getElementById("buttonAdd").addEventListener("click", function () {
        let newRestaurant = (new RestaurantObject(document.getElementById("name").value,
        document.getElementById("city").value, 
        document.getElementById("state".value,
        document.getElementById("URL").value,
        selectedCuisine,
        selectedPrice)));

    
    ///// POST =========    
        $.ajax({
            url : "/AddRestaurant",
            type: "POST",
            data: JSON.stringify(newRestaurant),
            contentType : "application/json; charset=utf-8",
            dataType    : "json",
            success : function(result) {
                console.log(result);
                document.location.href = "index.html/#ListAll";
            }
        });

        // document.location.href = "index.html/#ListAll";
    });

    //clear button
    document.getElementById("buttonClear").addEventListener("click", function () {
        document.getElementById("name").value = "";
        document.getElementById("city").value = "";
        document.getElementById("state").value = "";
        document.getElementById("URL").value = "";
    }); 

    $(document).bind("change", "#select-cuisine", function (event, ui) {
        selectedCuisine = $('#select-cuisine').val();
    });
   
    $(document).bind("change", "#select-priceRange", function (event, ui) {
        selectedPrice = $('#select-priceRange').val();
    });

    document.getElementById("buttonSortName").addEventListener("click", function () {
        serverArray.sort(dynamicSort("Name"));
        createList();
        document.location.href = "index.html#ListAll";
    });

    document.getElementById("buttonSortPriceRange").addEventListener("click", function () {
        serverArray.sort(dynamicSort("Price"));
        createList();
        document.location.href = "index.html#ListAll";
    });

    // button on details page to view the youtube video
    document.getElementById("website").addEventListener("click", function () {
        window.open(document.getElementById("oneURL").innerHTML);
    });
// end of add button events ************************************************************************

  
  
    // PAGE BEFORE SHOW   *************************************************************************
    $(document).on("pagebeforeshow", "#ListAll", function (event) {   // have to use jQuery 
        createList();
    });



    // need one for our details page to fill in the info based on the passed in ID
    $(document).on("pagebeforeshow", "#details", function (event) {   
        let restaurantID = localStorage.getItem("parm");  // get the unique key back from the dictionary
        let localID = GetArrayPointer (restaurantID); // map to which array it is
        //document.getElementById("someID").innerHTML = restaurantID;

        // next step to avoid bug in jQuery Mobile,  force the movie array to be current
        serverArray = JSON.parse(localStorage.getItem("restaurantArray"));  

      // no longer using pointer -1 now that we have real keys
      document.getElementById("oneName").innerHTML = "Restaurant Name: " + serverArray[localID].Name;
      document.getElementById("oneCity").innerHTML = "City: " + serverArray[localID].City;
      document.getElementById("oneState").innerHTML = "State: " + serverArray[localID].State;
      document.getElementById("oneURL").innerHTML = "Website: " + serverArray[localID].URL;
      document.getElementById("oneCuisine").innerHTML = "Cuisine: " + serverArray[localID].Cuisine
      document.getElementById("onePrice").innerHTML = "Price: " + serverArray[localID].Price;
      document.getElementById("oneURL").innerHTML = serverArray[localID].URL;
    });
 
// end of page before show code *************************************************************************

});  
// end of wait until document has loaded event  *************************************************************************



// Functions 
function createList() {
    // clear prior data
    // let mustVisitList = document.getElementById("mustVisitList");
    // while (mustVisitList.firstChild) {    // remove any old data so don't get duplicates
    //     mustVisitList.removeChild(mustVisitList.firstChild);
    // };
    let anotherUl = document.getElementById("myUl");
    anotherUl.innerHTML = "";

    // refresh serverArray from the server's serverArray
    $.get("/getAllRestaurants", function(data, status){    //AJAX get
        console.log(status);
        serverArray = data;                 // copy returned to server json data 
    // });

        let ul = document.createElement('ul');
        serverArray.forEach(function (element,) {   // use handy array forEach method
            let li = document.createElement('li');
            // adding a class name to each one as a way of creating a collection
            li.classList.add('oneRestaurant'); 
            // use the html5 "data-parm" to encode the ID of this particular data object
            // that we are building an li from
            li.setAttribute("data-parm", element.ID);
            li.innerHTML = element.ID + "  || " + element.Name + "  ||  " + element.Price;
            ul.appendChild(li);
        });
        mustVisitList.appendChild(ul)

        // now we have the HTML done to display out list, 
        // next we make them active buttons
        // set up an event for each new li item, 
        let liArray = document.getElementsByClassName("oneRestaurant");
        Array.from(liArray).forEach(function (element) {
            element.addEventListener('click', function () {
            // get that data-parm we added for THIS particular li as we loop thru them
            let parm = this.getAttribute("data-parm");  // passing in the record.Id
            // get our hidden <p> and save THIS ID value in the localStorage "dictionairy"
            localStorage.setItem('parm', parm);
            // but also, to get around a "bug" in jQuery Mobile, take a snapshot of the
            // current movie array and save it to localStorage as well.
            let stringRestaurantArray = JSON.stringify(serverArray); // convert array to "string"
            localStorage.setItem('restaurantArray', stringRestaurantArray);
            // now jump to our page that will use that one item
            document.location.href = "index.html#details";
            });
        });

});

};

// end of the get call "call back" function

// remove a restaurant from array
function deleteRestaurant(which) {
    console.log(which);
// tell the server to remove it from the server
    $.ajax ( {
        type: "DELETE",
        url: "/DeleteRestaurant/" + which,
        success: function(result) {
            console.log(result);
            document.location.href = "index.html#ListAll";
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(textStatus);
            alert("Server failed to delete");
        }
    })
}

//let arrayPointer = GetArrayPointer(which);
//restaurantArray.splice(arrayPointer, 1) //remove one element at index

// cycles thru the array to find the array element with a matching ID
function GetArrayPointer(localID) {
    console.log(serverArray);
    console.log(localID);
    for (let i = 0; i < serverArray.length; i++) {
        if (localID === serverArray[i].ID) {
            return i;
        }
    }
}

/**
 *  https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript
* Function to sort alphabetically an array of objects by some specific key.
* 
* @param {String} property Key of the object to sort.
*/

function dynamicSort(property) {
    return function (a,b) {
        return a[property].localeCompare(b[property]);
        }
};
