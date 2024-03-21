//Inicializar Mapa
var map = L.map("map").setView([-7.61564, 15.059012], 19);

//-- Definir os mapas
let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  useCache: true,
  crossOrigin: true,
});

let googleSat = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    useCache: true,
    crossOrigin: true,
  }
);

let googleTraffic = L.tileLayer(
  "https://{s}.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    minZoom: 2,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    useCache: true,
    crossOrigin: true,
  }
);
//-- Difinir os Mapas

// Definir as camadas
let baseLayers = {
  "Ver como Satálite": googleSat,
  "Ver como Open Street": osm,
  "Ver como Tráfego": googleTraffic,
};

// Apresentar o mapa
googleSat.addTo(map);

// Adicionar controle de camadas ao mapa
L.control.layers(baseLayers).addTo(map);

// Leaflet Draw
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
    poly: {
      allowIntersection: false,
    },
  },
  draw: {
    circle: false,
    circlemarker: false,
    polygon: {
      allowIntersection: false,
      showArea: true,
    },
  },
});
map.addControl(drawControl);

//var featureGroup = L.featureGroup().addTo(map);

map.on("draw:created", function (e) {
  var type = e.layerType;
  var layer = e.layer;
  drawnItems.addLayer(layer);
});

// Map Title
var title = new L.Control({ position: "bottomleft" });
title.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info");
  this.update();
  return this._div;
};

title.update = function (lat = 0, lng = 0) {
  const latlng = decimalToDegreesMinutes(lat, lng);
  this._div.innerHTML = `Latitude: ${latlng.latitude}<br>Longitude: ${latlng.longitude}`;
};

title.addTo(map);

map.on("click", function (e) {
  var lat = e.latlng.lat;
  var lng = e.latlng.lng;
  title.update(lat, lng);
});

function decimalToDegreesMinutes(lat, lon) {
  // Convert latitude to degrees and minutes
  const latDeg = Math.floor(lat);
  const latMin = (lat - latDeg) * 60;

  // Convert longitude to degrees and minutes
  const lonDeg = Math.floor(lon);
  const lonMin = (lon - lonDeg) * 60;

  // Format the result
  const latStr = `${Math.abs(latDeg)}°${latMin.toFixed(4)}' ${
    latDeg >= 0 ? "N" : "S"
  }`;
  const lonStr = `${Math.abs(lonDeg)}°${lonMin.toFixed(4)}' ${
    lonDeg >= 0 ? "E" : "O"
  }`;

  return { latitude: latStr, longitude: lonStr };
}
