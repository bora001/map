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
let currentCity;

//select city
input.addEventListener("change", function (e) {
  let city = e.target.value;
  currentCity = e.target.value;
  setLocation(country[city]);
  goTour(city);
  cleanList();
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
  markerNow._icon.style.filter = "hue-rotate(150deg)";
  map.addEventListener("click", function (e) {
    !check ? newMarker(e.latlng) : "";
  });
};

const error = (err) => {
  console.log(err);
};

navigator.geolocation.getCurrentPosition(success, error);

const setLocation = (data) => {
  mode === "fly" ? map.flyTo(data, zoom) : map.setView(data, 12);
};

//mode

const modeBtn = document.querySelector(".mode");

modeBtn.addEventListener("click", function () {
  modeBtn.classList.toggle("active");
  modeBtn.classList.contains("active") ? (mode = "fly") : (mode = "null");
});

//marker
const infoInput = document.querySelector(".info");
const infoSubmit = document.querySelector(".info_submit");
const infoCancel = document.querySelector(".info_cancel");
let popup;
const newMarker = (position) => {
  console.log(position);
  infoInput.classList.remove("hidden");
  let newMarker = L.marker(position, { draggable: true }).addTo(map);
  check = true;

  infoCancel.addEventListener("click", function () {
    infoInput.classList.add("hidden");
    newMarker.remove(map);
    newMarker = "";

    setTimeout(() => {
      check = false;
    }, 1000);
  });

  infoSubmit.addEventListener("click", function () {
    let val = document.getElementById("submit_txt");
    infoInput.classList.add("hidden");
    newMarker.remove(map);
    newMarker = "";

    popup = L.marker(position).addTo(map).bindPopup(val.value).openPopup();

    setTimeout(() => {
      popup.openPopup();
      check = false;
      val.value = "";
    }, 500);
  });
};

//place to visit

const goTour = (city) => {
  const spot = document.querySelector(".spot");
  console.log(city);
  spot.addEventListener("click", function () {
    if (city === currentCity) {
      renderPlace(placetogo[city]);
    }
  });
};
const placeDiv = document.querySelector(".place_list");
const markers = [];
const renderPlace = (list) => {
  console.log(list, "list!!");
  if (placeDiv.childElementCount !== list.length) {
    for (let item of list) {
      let placeMarker = L.marker(item.location, { id: item.name })
        .addTo(map)
        .bindPopup(item.name)
        .openPopup();
      placeMarker._icon.style.filter = "hue-rotate(280deg)";

      markers.push(placeMarker);
      const html = `
  <div class="item" onClick="placeItem(this)">
  <p>${item.name}</p>
  </div>
  `;
      placeDiv.insertAdjacentHTML("afterbegin", html);
    }
  }
};

const placeItem = (item) => {
  let arr = placetogo[currentCity];
  for (let name of arr) {
    if (name.name === item.innerText) {
      map.setView(name.location, zoom);
      for (let mark of markers) {
        if (name.name == mark["options"]["id"]) {
          console.log(mark);
          mark.openPopup();
        }
      }
    }
  }
};

//clean placelist
const cleanList = () => {
  while (placeDiv.firstChild) {
    placeDiv.removeChild(placeDiv.lastChild);
  }
};

// console.log(placetogo);
