/* OGD Wien Beispiel */

let stephansdom = {
    lat: 48.208493,
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
    L.tileLayer.provider("BasemapAT"), {
        toggleDisplay: true
    }
).addTo(map);


// Sehenswürdigkeiten aus OGD laden
async function loadSites(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);

    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Sehenswürdigkeiten");
    overlay.addTo(map);

    L.geoJSON(geojson, {
        pointToLayer: function (geoJsonPoint,latlng) {
            
            let popup = `
            <img src="${geoJsonPoint.properties.THUMBNAIL}"
            alt=""><br>
            <strong>${geoJsonPoint.properties.NAME}</strong>
            <hr>
            Adresse: ${geoJsonPoint.properties.ADRESSE}<br>
            <a href="${geoJsonPoint.properties.WEITERE_INF}
            ">Weblink</a>
            `;
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: "icons/photo.png",
                    iconAnchor: [16,37],
                    popupAnchor: [0,-37]
                })

            }).bindPopup(popup);
        }

    }).addTo(overlay)
}

loadSites("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");

//Haltestellen Vienna Sightseeing

async function loadStops(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);


    // Add to overlay
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Vienna Haltestellen");
    overlay.addTo(map);

    L.geoJSON(geojson,{
        pointToLayer: function (geoJsonPoint, latlng) {
            //console.log(geoJsonPoint);
            let popup = `
            <strong>${geoJsonPoint.properties.LINE_NAME}</strong><hr>
            Station ${geoJsonPoint.properties.STAT_NAME}<br>
            `;
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `icons/bus_${geoJsonPoint.properties.LINE_ID}.png`,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })

            }).bindPopup(popup);
        }

    }).addTo(overlay);
}

loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");


// Hotels und Unterkünfte mit Icons als Overlay visualiseren

async function loadHotels(url) {
    let response = await fetch(url);
    let geojson = await response.json(); 
    console.log(geojson);

    //Hotels nach Name
    geojson.features.sort(function(a,b){
        return a.properties.BETRIEB.toLowerCase() > b.properties.BETRIEB.toLowerCase()
    })

    let overlay = L.markerClusterGroup({
        disableClusteringAtZoom:17
    });
    
    layerControl.addOverlay(overlay,"Hotels und Unterkünfte");
    overlay.addTo(map)
    L.geoJSON(geojson, {
        pointToLayer: function(geoJsonPoint,latlng){
            let searchList=document.querySelector("#searchList");
            searchList.innerHTML += `<option value="geoJsonPoint.properties.BETRIEB}"></option>`;
            console.log(document.querySelector(`#searchList`));
            console.log(`<option value="geoJsonPoint.properties.BETRIEB}"></option>`);
            
            console.log(document.querySelector("#searchList"));

            let popup = `
                
                <strong>${geoJsonPoint.properties.BETRIEB}</strong>
                <hr>
                Betriebsart: ${geoJsonPoint.properties.BETRIEBSART_TXT}<br>
                Betriebskategorie: ${geoJsonPoint.properties.KATEGORIE_TXT}<br>
                Telefonuummer. ${geoJsonPoint.properties.KONTAKT_TEL}<br>
                Betriebsdresse: ${geoJsonPoint.properties.ADRESSE}<br>
                <a href="${geoJsonPoint.properties.WEBLINK1}
                ">Weblink</a><br>
                <a href="mailto:${geoJsonPoint.properties.KONTAKT_EMAIL}
                ">E-Mail</a>
            `;
            // if, else if, else Abfrage des Attributs BETRIEBSART
            if (geoJsonPoint.properties.BETRIEBSART == "H") {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: "icons/hotel_0star.png",
                        iconAnchor: [16,37],
                        popupAnchor: [0,-37]
                    })
                }).bindPopup(popup);
            } else if (geoJsonPoint.properties.BETRIEBSART == "P") {
                return L.marker(latlng, {
                    icon: L.icon({ 
                        iconUrl: "icons/lodging_0star.png",
                        iconAnchor: [16,37],
                        popupAnchor: [0,-37]
                    })
                }).bindPopup(popup);
            } else {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: "icons/apartment-2.png",
                        iconAnchor: [16,37],
                        popupAnchor: [0,-37]
                    })
                }).bindPopup(popup);
            }
             
        }

    }).addTo(overlay);
    let form= documentquerySelector("#searchForm");
    console.log(form.hotel);
    form.suchen.onclick =function() {
        console.log(form.hotel.value);
        hotelsLayer.eachLayer(function(marker){
            console.log(marker),
            console.log(marker.getLatLng())
            console.log(marker.getPopup())
            console.log(marker.feature.properties.BETRIEB)

            if (form.hotel.value == marker.feature.properties.BETRIEB)
            {
                //console.log(marker.getLatLng())
                //console.log(marker.getPopup());
                //marker.openPopup();
                console.log(marker.getLatLng(),17);
                console.log(marker.feature.properties.BETRIEB);
            }
        })
    }

}

loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")


async function loadLines(url) {
    let response = await fetch(url);
    let geojson = await response.json(); 
    console.log(geojson);
    
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay,"Liniennetz Vienna Sightseeing");
    overlay.addTo(map);
    L.geoJSON(geojson,{
        style: function(feature) {
            //console.log(feature)

            let colors =
            {
                "Red Line" : "#FF4136",
                "Yellow Line": "#FFDC00",
                "Blue Line": "#0074D9",
                "Grey Line": "#AAAAAA",
                "Orange Line": "#FF851B",

            };
            return{
                color: `${colors[feature.properties.LINE_NAME]}`,
                weight: 4,
                dashArray: [10, 6]

            }
        }



    }).bindPopup(function (layer) {
        return `
        <h4>${layer.feature.properties.LINE_NAME} </h4>
        <h4>${layer.feature.properties.LINE_NAME} </h4>
        <br>
        nach: ${layer.feature.properties.TO_NAME} 
        `;

    }).addTo(overlay);
}


loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");


async function loadZones(url) {
    let response = await fetch(url);
    let geojson = await response.json(); 
    console.log(geojson);

    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay,"Fußgängerzonen Wien");
    overlay.addTo(map)

    L.geoJSON(geojson,{
        style: function (feature){
        return{
            color: "#F012BE",
            weight: 1,
            opacity: 0.1,
            fillOpacity:0.1,
        }
        }


    }).bindPopup(function (layer) {
            return `
            <p>Fußgängerzone ${layer.feature.properties.ADRESSE} </h4>
            <p>${layer.feature.properties.ZEITRAUM} </p>
            <br>
            <p>${layer.feature.properties.AUSN_TEXT} </p>
            `;
    
        
        }).addTo(overlay)
        
    }



/*Markers Cluster
let overlay = L.markerClusterGroup();
markers.addLayer(L.marker(getRandomLatLng(map)));
    
        //... Add more layers ...
map.addLayer(markers);
*/

loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");

    

//Linien Vienna Sightseeing

/*async function loadLines(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);
    
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Vienna Sightseeing Lines");
    overlay.addTo(map);

    L.geoJSON(geojson).addTo(overlay);

}


loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");

//Fußgängerzone Vienna 

/*async function loadZone(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);
    
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Vienna Fußgängerzone");
    overlay.addTo(map);

    L.geoJSON(geojson).addTo(overlay);

}


loadZone("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");

//Hotels und Unterkünfte Vienna 

/*async function loadHotels(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);
    
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Vienna Hotels und Unterkünfte");
    overlay.addTo(map);

    L.geoJSON(geojson).addTo(overlay);

}


loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json");
*/
