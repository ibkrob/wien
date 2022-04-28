/* OGD Wien Beispiel */

let stephansdom = {
lat: 48.208943,
lng: 16.373118,
title: "Stephansdom"
};

let startLayer = L.tileLayer.provider("BasemapAT.basemap");

let map = L.map("map", {
    center: [stephansdom.lat, stephansdom.lng],
    zoom: 12,
    layers:[
        startLayer
    ]

})

let layerControl = L.control.layers(
    {
        "BasemapAT.basemap": startLayer,
    }).addTo(map)