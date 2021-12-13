let country = {
  Current: [],
  Vancouver: [49.246292, -123.116226],
  Paris: [48.864716, 2.349014],
  Seoul: [37.5326, 127.024612],
  Newyork: [40.73061, -73.935242],
  Sydney: [-33.865143, 151.2099],
};
let zoom = 13;
let map;
let mode = "null";
let check = false;
let currentCity;

let popup;
const markers = [];

//html
const option = document.querySelectorAll(".opt_box p");
const optionVisible = document.querySelector(".country_box p");

const modeBtn = document.querySelector(".mode");

const infoInput = document.querySelector(".info");
const infoSubmit = document.querySelector(".info_submit");
const infoCancel = document.querySelector(".info_cancel");

const placeDiv = document.querySelector(".place_list");

const mobileBtn = document.querySelector(".mobile_mode");
const sideBar = document.querySelector(".side_bar");

//select city

optionVisible.addEventListener("click", function () {
  document.querySelector(".opt_box").classList.toggle("hidden");
});

option.forEach((opt) => {
  opt.addEventListener("click", function () {
    let city = opt.innerText;
    if (opt.innerText === "Current Location") {
      city = "current";
    }
    currentCity = city;
    document.querySelector(".opt_box").classList.add("hidden");
    optionVisible.innerText = opt.innerText;
    // setLocation(country[city]);
    cleanList();

    if (city === currentCity) {
      renderPlace(placetogo[city]);
    }
  });
});

//get current location
const success = (pos) => {
  let crd = pos.coords;
  country.current = [crd.latitude, crd.longitude];
  map = L.map("map", { gestureHandling: true })
    .fitWorld()
    .setView(country.current, zoom);
  // .fitWorld();
  map.locate({
    setView: true,
    maxZoom: zoom,
  });

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
  console.log(data, "working good");
  // mode === "fly" ? map.flyTo(data, zoom) : map.setView(data, 12);
};

//mode

modeBtn.addEventListener("click", function () {
  modeBtn.classList.toggle("active");
  modeBtn.classList.contains("active") ? (mode = "fly") : (mode = "null");
});

//marker

const newMarker = (position) => {
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

const renderPlace = (list) => {
  if (!list && placeDiv.childElementCount < 1) {
    const html = `<div>Service will be available soon!</div>`;
    placeDiv.insertAdjacentHTML("afterbegin", html);
    return;
  }

  if (placeDiv.childElementCount !== list.length) {
    for (let item of list) {
      let placeMarker = L.marker(item.location, { id: item.name })
        .addTo(map)
        .bindPopup(item.name);
      placeMarker._icon.style.filter = "hue-rotate(280deg)";

      markers.push(placeMarker);

      const html = `
      <div class="item">
      <div class="img_box">
      <img src=${item.img} /></div>
      <p class="theItem">${item.name}</p>
      </div>
      `;
      let name = item.name;

      placeDiv.insertAdjacentHTML("afterbegin", html);
      const itemBtn = document.querySelector(".item");

      itemBtn.addEventListener("click", function () {
        console.log("click", name);
        let arr = placetogo[currentCity];
        let [filtered] = arr.filter((select) => select.name == name);
        let location = filtered.location;
        itemLocation = filtered.location;
        let [mark] = markers.filter((mark) => mark["options"]["id"] == name);

        map.setView(location, zoom);
        mark.openPopup();
        sideBar.classList.remove("mobile");
      });
    }
  }
};

const mobileItemClick = () => {
  itemBtn.forEach(function () {
    console.log("mobile, click");
  });
};

//clean placelist
const cleanList = () => {
  while (placeDiv.firstChild) {
    placeDiv.removeChild(placeDiv.lastChild);
  }
};

//mobile
mobileBtn.addEventListener("click", function () {
  sideBar.classList.toggle("mobile");
  mobileBtn.classList.toggle("mobile");
});
