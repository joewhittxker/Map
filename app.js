const map = L.map("map").setView(
  [52.9548, -1.1581],
  13
);


// Map layers

const streetLayer = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "© OpenStreetMap contributors"
  }
);


const satelliteLayer = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "Tiles © Esri"
  }
);


streetLayer.addTo(map);



let satelliteOn = false;

let marker = null;

let circle = null;

let userMarker = null;

let selectedRadius = 300;




// Satellite switch

function toggleMapType() {

  if (satelliteOn) {

    map.removeLayer(satelliteLayer);

    streetLayer.addTo(map);

    satelliteOn = false;

  } else {

    map.removeLayer(streetLayer);

    satelliteLayer.addTo(map);

    satelliteOn = true;

  }

}





// Radius buttons

function setRadius(radius, button) {


  selectedRadius = radius;


  if (circle) {

    circle.setRadius(radius);

  }


  document
    .querySelectorAll(".options button")
    .forEach(btn => btn.classList.remove("active"));


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



    updateMap(
      data.result.latitude,
      data.result.longitude,
      postcode
    );



  } catch(error) {

    alert("Search failed");

  }

}





// Create postcode radius

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
      color:"#2563eb",
      fillOpacity:0.2
    }
  )
  .addTo(map);



  map.setView(
    [lat, lon],
    16
  );

}





// My location

function findLocation() {


  if (!navigator.geolocation) {

    alert("Location not supported");

    return;

  }



  navigator.geolocation.getCurrentPosition(


    function(position) {


      const lat = position.coords.latitude;

      const lon = position.coords.longitude;




      if (userMarker) {

        map.removeLayer(userMarker);

      }



      if (circle) {

        map.removeLayer(circle);

      }




      // Small blue location dot only

      userMarker = L.circleMarker(
        [lat, lon],
        {
          radius:8,
          color:"#2563eb",
          fillColor:"#2563eb",
          fillOpacity:1
        }
      )
      .addTo(map);





      // Your chosen radius circle

      circle = L.circle(
        [lat, lon],
        {
          radius:selectedRadius,
          color:"#2563eb",
          fillOpacity:0.2
        }
      )
      .addTo(map);





      map.setView(
        [lat, lon],
        17
      );



    },


    function(){

      alert("Please allow location access");

    }


  );

}