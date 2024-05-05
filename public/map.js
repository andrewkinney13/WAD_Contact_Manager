const map = L.map('map').setView([41, -74], 13); 
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', 
    { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);

const createMarkers = async => {

    const table = document.getElementById("contactsTable");
    const rows = table.getElementsByTagName("tr")
    const markers = []
    for (var i = 0; i < rows.length; i++) {
        
        // Obtain row data
        const label = rows[i].cells[0].innerText;
        const address = rows[i].cells[3].innerText;
        const lat = rows[i].cells[5].innerText;
        const lng = rows[i].cells[6].innerText;

        // Create the marker
        const marker = L.marker([lat, lng]).addTo(map).bindPopup(`<b>${label}</b><br/>${address}`);
        markers.push(marker)

        // Add onclick func
        rows[i].onclick = on_row_click;
    }
}

const on_row_click = (e) => {

    // Obtain TR element
    let row = e.target; 
    if (e.target.tagName.toUpperCase() === 'TD') { 
        row = e.target.parentNode; 
    }

    // Access element data
    const lat = row.cells[5].innerText;
    const lng = row.cells[6].innerText;
    
    // Fly there!
    map.flyTo(new L.LatLng(lat, lng));
}

