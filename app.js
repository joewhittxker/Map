// Create map
const map = L.map("map").setView([52.9548, -1.1581], 13);


// Map tiles
L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "© OpenStreetMap contributors"
  }
).addTo(map);


let marker = null;
let circle = null;


// Search postcode
async function searchPostcode() {

  const postcode =
    document.getElementById("postcode")
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


    updateMap(lat, lon, postcode);


  } catch (error) {

    alert("Unable to find postcode");

    console.log(error);

  }

}



// Update map
function updateMap(lat, lon, label) {


  if (marker) {
    map.removeLayer(marker);
  }


  if (circle) {
    map.removeLayer(circle);
  }


  const radius =
    Number(
      document.getElementById("radius").value
    );


  marker = L.marker([lat, lon])
    .addTo(map)
    .bindPopup(
      `<b>${label.toUpperCase()}</b>`
    )
    .openPopup();



  circle = L.circle(
    [lat, lon],
    {
      radius: radius,
      color: "#2563eb",
      fillOpacity: 0.2
    }
  ).addTo(map);



  map.setView(
    [lat, lon],
    16
  );

}



// Current location
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



      updateMap(
        lat,
        lon,
        "Your Location"
      );


    },


    function() {

      alert(
        "Please allow location access"
      );

    }

  );

}