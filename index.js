let country = {
  current: [],
  vancouver: [49.246292, -123.116226],
  paris: [48.864716, 2.349014],
  seoul: [37.5326, 127.024612],
  newyork: [40.73061, -73.935242],
  sydney: [-33.865143, 151.2099],
};
let map;
let mode = "fly";
const input = document.getElementById("input");
input.addEventListener("change", function (e) {
  let city = e.target.value;
  //   console.log(country[city]);
  setLocation(country[city]);
});

//get current location

const success = (pos) => {
  let crd = pos.coords;
  country.current = [crd.latitude, crd.longitude];
  map = L.map("map").setView(country.current, 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker(country.current).addTo(map).bindPopup("you are here!").openPopup();
};

const error = (err) => {
  console.log(err);
};

navigator.geolocation.getCurrentPosition(success, error);

console.log(map);

// const mapCnt = document.getElementById("map");
// const cnt = document.querySelector(".cnt");
const setLocation = (data) => {
  console.log(data);
  mode === "fly" ? map.flyTo(data) : map.panInside(data);
};

const controls = document.querySelectorAll(".control_box button");
controls.forEach((btn) => {
  btn.addEventListener("click", function () {
    mode = btn.attributes.data.value;
    btn.classList.add("active");
    console.log(btn);
  });
});
