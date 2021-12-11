let country = {
  current: [],
  vancouver: [49.246292, -123.116226],
  paris: [48.864716, 2.349014],
  seoul: [37.5326, 127.024612],
  newyork: [40.73061, -73.935242],
  sydney: [-33.865143, 151.2099],
};
let zoom = 13;
let map;
let mode = "null";
let check = false;
const input = document.getElementById("country_input");

input.addEventListener("change", function (e) {
  let city = e.target.value;
  //   console.log(country[city]);
  setLocation(country[city]);
});

//get current location
const success = (pos) => {
  let crd = pos.coords;
  country.current = [crd.latitude, crd.longitude];
  map = L.map("map").setView(country.current, zoom);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const markerNow = L.marker(country.current)
    .addTo(map)
    .bindPopup("you are here!")
    .openPopup();
  markerNow._icon.style.filter = "hue-rotate(45deg)";
  map.addEventListener("click", function (e) {
    !check ? newMarker(e.latlng) : "";
  });
};

const error = (err) => {
  console.log(err);
};

navigator.geolocation.getCurrentPosition(success, error);

const setLocation = (data) => {
  mode === "fly" ? map.flyTo(data, zoom) : map.setView(data, zoom);
};

const modeBtn = document.querySelector(".mode");

modeBtn.addEventListener("click", function () {
  modeBtn.classList.toggle("active");
  modeBtn.classList.contains("active") ? (mode = "fly") : (mode = "null");
});

const infoInput = document.querySelector(".info");
const infoSubmit = document.querySelector(".info_submit");
const infoCancel = document.querySelector(".info_cancel");

const newMarker = (position) => {
  infoInput.classList.remove("hidden");
  let newMarker = L.marker(position, { draggable: true }).addTo(map);
  check = true;

  infoCancel.addEventListener("click", function () {
    infoInput.classList.add("hidden");
    newMarker.remove();
    newMarker = "";

    setTimeout(() => {
      check = false;
    }, 1000);
  });

  infoSubmit.addEventListener("click", function () {
    let val = document.getElementById("submit_txt");
    infoInput.classList.add("hidden");
    newMarker.remove();
    newMarker = "";

    const popup = L.marker(position)
      .addTo(map)
      .bindPopup(val.value)
      .openPopup();

    setTimeout(() => {
      popup.openPopup();
      check = false;
      val.value = "";
    }, 500);
  });
};
