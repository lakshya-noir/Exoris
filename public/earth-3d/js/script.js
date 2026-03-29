// 1. Satellite Data
// Expanded with more significant satellites from different categories.
const satelliteData = [
    {
        name: 'International Space Station (ISS)',
        lat: 51.6, lng: -0.1, alt: 0.05,
        description: 'The ISS is the largest modular space station in low Earth orbit. It serves as a microgravity and space environment research laboratory where crew members conduct experiments in biology, physics, astronomy, and meteorology.'
    },
    {
        name: 'Hubble Space Telescope (HST)',
        lat: 28.5, lng: -80.6, alt: 0.08,
        description: 'The Hubble is one of the largest and most versatile space telescopes. It has provided a deep view into space and time, capturing stunning images that have led to groundbreaking discoveries in astrophysics.'
    },
    {
        name: 'Tiangong Space Station',
        lat: 41.0, lng: 100.0, alt: 0.06,
        description: 'Meaning "Heavenly Palace," Tiangong is China\'s multi-module space station in low Earth orbit. It is designed for long-term astronaut stays and supports a wide range of scientific experiments.'
    },
    {
        name: 'James Webb Space Telescope (JWST)',
        lat: -10.0, lng: -65.0, alt: 25.0, // Not in Earth orbit, but visualized at a very high altitude for effect.
        description: 'Successor to the Hubble, the JWST observes the universe in infrared. It is positioned at the L2 Lagrange point, 1.5 million km from Earth, to see the first galaxies and atmospheres of exoplanets.'
    },
    {
        name: 'Galileo Satellite',
        lat: 0, lng: 25.0, alt: 3.6, // In Medium Earth Orbit
        description: 'Galileo is Europe\'s Global Navigation Satellite System (GNSS), providing highly accurate global positioning. It is a civilian-controlled system, offering an independent alternative to GPS.'
    },
    {
        name: 'GOES-18',
        lat: 0, lng: -137.2, alt: 5.6, // In Geostationary Orbit, very high altitude
        description: 'A Geostationary Environmental Satellite that watches over the U.S. West Coast and the Pacific Ocean. From its fixed position, it provides continuous weather imagery and atmospheric data.'
    },
    {
        name: 'Landsat 9',
        lat: 75.0, lng: -122.0, alt: 0.11,
        description: 'The latest in the Landsat program, which has provided the longest continuous space-based record of Earth\'s land surface. Its data is critical for monitoring agriculture, deforestation, and natural disasters.'
    },
    {
        name: 'Starlink-1001',
        lat: -30.0, lng: 15.0, alt: 0.075,
        description: 'A satellite in SpaceX\'s Starlink constellation, which aims to provide global satellite Internet access. Thousands of these small satellites work together to deliver high-speed internet to underserved areas.'
    },
    {
        name: 'GPS IIR-M1',
        lat: 45.0, lng: 90.0, alt: 3.18, // In Medium Earth Orbit
        description: 'A satellite from the Global Positioning System (GPS), a satellite-based radionavigation system. GPS provides geolocation and time information to a receiver anywhere on or near the Earth.'
    },
    {
        name: 'Terra (EOS AM-1)',
        lat: -10.0, lng: -120.0, alt: 0.1,
        description: 'Terra is a multi-national NASA scientific research satellite. It carries five remote sensors to monitor the state of Earth\'s environment and ongoing climate changes.'
    }
];

// 2. DOM Elements for the Info Box
const infoBox = document.getElementById('satellite-info');
const satName = document.getElementById('sat-name');
const satDesc = document.getElementById('sat-desc');
const closeButton = document.getElementById('close-button');

// Close the info box when the button is clicked
closeButton.addEventListener('click', () => {
    infoBox.style.display = 'none';
});

// 3. Initialize the Globe ✨
const myGlobe = Globe()
    (document.getElementById('globeViz'))
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
    .atmosphereColor('lightblue')
    .atmosphereAltitude(0.25)
    
    // 4. Add Satellite "Labels"
    .labelsData(satelliteData)
    .labelLat(d => d.lat)
    .labelLng(d => d.lng)
    .labelText(d => d.name)
    .labelSize(0.6)
    .labelDotRadius(0.5)
    .labelColor(() => 'rgba(0, 255, 255, 0.9)')
    .labelAltitude('alt')
    .labelResolution(2)
    
    // 5. Add Click Interaction
    .onLabelClick((label, event) => {
        satName.textContent = label.name;
        satDesc.textContent = label.description;
        infoBox.style.display = 'block';
    });

// 6. Configure Globe Controls (Auto-rotate, zoom)
myGlobe.controls().autoRotate = true;
myGlobe.controls().autoRotateSpeed = 0.2;
myGlobe.controls().enableZoom = true;