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
    {   "BasemapAT Standard": startLayer,
        "BasemapAT Grau": L.tileLayer.provider("BasemapAT.grau"),
        "BasemapAT Overlay": L.tileLayer.provider("BasemapAT.overlay"),
        "BasemapAT Terrain": L.tileLayer.provider("BasemapAT.terrain"),
        "BasemapAT Surface": L.tileLayer.provider("BasemapAT.surface"),
        "BasemapAT High DPI": L.tileLayer.provider("BasemapAT.highdpi"),
        "BasemapAT Ortofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
        "BasemapAT Beschriftung und Orthopfoto": L.layerGroup([
            L.tileLayer.provider("BasemapAT.orthofoto"),
            L.tileLayer.provider("BasemapAT.overlay")
        ])
        
    }).addTo(map);

    layerControl.expand()

    let sightLayer=L.featureGroup();

    layerControl.addOverlay(sightLayer);

    let mrk= L.marker ([stephansdom.lat, stephansdom.lng]).addTo(sightLayer);

    sightLayer.addTo(map);

    // Maßstab hinzufügen
    L.control.scale({
        imperial:false
    }).addTo(map);

    L.control.fullscreen().addTo(map);

    let miniMap= new L.Control.MiniMap(
        L.tileLayer.provider("BasemapAT")
    ).addTo(map);
