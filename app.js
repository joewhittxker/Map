// Create map

const map = L.map("map").setView(
  [52.9548, -1.1581],
  13
);


// Add OpenStreetMap tiles

L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "© OpenStreetMap contributors"
  }
).addTo(map);



let marker = null;

let circle = null;

let userMarker = null;

let accuracyCircle = null;

let selectedRadius = 300;




// Radius buttons

function setRadius(radius, button) {


  selectedRadius = radius;


  if (circle) {

    circle.setRadius(radius);

  }



  document
    .querySelectorAll(".options button")
    .forEach(btn => {

      btn.classList.remove("active");

    });



  button.classList.add("active");


}





// Search postcode

async function searchPostcode() {


  const postcode = document
    .getElementById("postcode")
    .value
    .trim();



  if (!postcode) {

    alert("Please enter a postcode");

    return;

  }



  try {


    const response = await fetch(

      `https://api.postcodes.io/postcodes/${postcode}`

    );



    const data = await response.json();



    if (data.status !== 200) {

      alert("Postcode not found");

      return;

    }



    const lat = data.result.latitude;

    const lon = data.result.longitude;



    updateMap(
      lat,
      lon,
      postcode
    );



  } catch (error) {


    alert("Unable to find postcode");


    console.log(error);


  }


}





// Update postcode map

function updateMap(lat, lon, label) {



  if (marker) {

    map.removeLayer(marker);

  }



  if (circle) {

    map.removeLayer(circle);

  }



  marker = L.marker(

    [lat, lon]

  )

  .addTo(map)

  .bindPopup(

    `<b>${label.toUpperCase()}</b>`

  )

  .openPopup();





  circle = L.circle(

    [lat, lon],

    {

      radius: selectedRadius,

      color: "#2563eb",

      fillOpacity: 0.2

    }

  ).addTo(map);





  map.setView(

    [lat, lon],

    16

  );


}





// GPS location button

function findLocation() {


  if (!navigator.geolocation) {


    alert("Location not supported");


    return;


  }



  navigator.geolocation.getCurrentPosition(


    function(position) {


      const lat =
        position.coords.latitude;


      const lon =
        position.coords.longitude;


      const accuracy =
        position.coords.accuracy;




      // Remove previous GPS display

      if (userMarker) {

        map.removeLayer(userMarker);

      }



      if (accuracyCircle) {

        map.removeLayer(accuracyCircle);

      }




      // Blue location dot

      userMarker = L.circleMarker(

        [lat, lon],

        {

          radius: 8,

          color: "#2563eb",

          fillColor: "#2563eb",

          fillOpacity: 1

        }

      ).addTo(map);





      // Accuracy circle

      accuracyCircle = L.circle(

        [lat, lon],

        {

          radius: accuracy,

          color: "#2563eb",

          fillOpacity: 0.15

        }

      ).addTo(map);





      map.setView(

        [lat, lon],

        17

      );



    },



    function() {


      alert(

        "Please allow location access"

      );


    }


  );


}