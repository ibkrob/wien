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
    layers:[
        startLayer
    ]

})

let layerControl = L.control.layers(
    {   "Basemap Standard": startLayer,
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

    let sightLayer=L.featureGroup();
    layerControl.addOverlay(sightLayer, "Sehenswürdigkeiten");

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
