/* OGD Wien Beispiel */

let stephansdom = {
    lat: 48.208943,
    lng: 16.373118,
    title: "Stephansdom"
};

let startLayer = L.tileLayer.provider("BasemapAT.grau");

let map = L.map("map", {
    center: [stephansdom.lat, stephansdom.lng],
    zoom: 12,
    layers: [
        startLayer
    ]

})

let layerControl = L.control.layers({
    "Basemap Standard": startLayer,
    "Basemap Grau": L.tileLayer.provider("BasemapAT.grau"),
    "Basemap Overlay": L.tileLayer.provider("BasemapAT.overlay"),
    "Basemap Terrain": L.tileLayer.provider("BasemapAT.terrain"),
    "Basemap Surface": L.tileLayer.provider("BasemapAT.surface"),
    "Basemap High DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "Basemap Ortofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "Basemap mit Beschriftung und Orthopfoto": L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"),
        L.tileLayer.provider("BasemapAT.overlay")
    ])

}).addTo(map);

layerControl.expand()

/*let sightLayer = L.featureGroup();
layerControl.addOverlay(sightLayer, "Sehenswürdigkeiten");

let mrk = L.marker([stephansdom.lat, stephansdom.lng]).addTo(sightLayer);

sightLayer.addTo(map);*/

// Maßstab hinzufügen
L.control.scale({
    imperial: false
}).addTo(map);

L.control.fullscreen().addTo(map);

let miniMap = new L.Control.MiniMap(
    L.tileLayer.provider("BasemapAT")
).addTo(map);


// Sehenswürdigkeiten
async function loadSites(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);
    
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Sehenswürdigkeiten");
    overlay.addTo(map);

    L.geoJSON(geojson).addTo(overlay);

}


loadSites("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");

//Haltestellen Vienna Sightseeing

async function loadStops(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);
    
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Vienna Sightseeing Stops");
    overlay.addTo(map);

    L.geoJSON(geojson).addTo(overlay);

}


loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");

//Haltestellen Vienna Sightseeing

async function loadLines(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);
    
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Vienna Sightseeing Lines");
    overlay.addTo(map);

    L.geoJSON(geojson).addTo(overlay);

}


loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");

