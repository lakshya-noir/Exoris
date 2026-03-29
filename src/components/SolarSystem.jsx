import React, { useState } from 'react';

const solarObjects = {
  sun: 'The Sun\'s core reaches temperatures of about 15 million °C, powering nuclear fusion that produces solar energy supporting life on Earth. Its magnetic field shapes the heliosphere, influencing cosmic radiation.',
  mercury: 'Mercury has a molten core generating a surprisingly strong magnetic field, despite its small size. It experiences extreme solar radiation and surface temperature swings between -173°C and 427°C.',
  venus: 'Venus spins backwards compared to other planets, causing a retrograde rotation. Its dense CO2 atmosphere creates a runaway greenhouse effect, making it hotter than Mercury despite being further from the Sun.',
  earth: 'Earth\'s unique magnetic field protects it from solar winds, preserving its atmosphere and enabling life. Plate tectonics constantly reshape its surface, contributing to a dynamic and habitable world.',
  mars: 'Mars hosts the tallest volcano in the Solar System, Olympus Mons, thrice the height of Mount Everest. It has polar ice caps of frozen CO2 and water, hinting at past liquid water flows.',
  jupiter: 'Jupiter\'s Great Red Spot is a centuries-old giant storm larger than Earth. Its strong magnetic field traps massive radiation belts, and it has at least 79 moons, including volcanically active Io.',
  saturn: 'Saturn\'s iconic rings are composed mostly of water ice and may be remnants of a destroyed moon. The planet emits more heat than it receives, driven by helium precipitation in its interior.',
  uranus: 'Uranus\' extreme 98-degree axial tilt results in 42-year-long seasonal cycles. Its icy atmosphere contains methane, giving it the distinct cyan color, and has faint rings and 27 moons.',
  neptune: 'Neptune boasts the fastest winds in the Solar System, reaching 2,100 km/h. Triton, its largest moon, has geysers believed to spew nitrogen, showing active geology despite its distance.',
};

const SolarSystem = () => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (body) => {
    setSelected(body);
  };

  return (
    <div>
      <div className="solar-system">
        {Object.keys(solarObjects).map((body) => (
          <div
            key={body}
            onClick={() => handleSelect(body)}
            className={`planet ${body}`}
            style={{
              cursor: 'pointer',
              margin: '10px',
              padding: '10px',
              borderRadius: '50%',
              display: 'inline-block',
              width: body === 'sun' ? '100px' : '50px',
              height: body === 'sun' ? '100px' : '50px',
              backgroundColor: body === 'sun' ? '#ffdd00' : '#888',
              textAlign: 'center',
              lineHeight: body === 'sun' ? '100px' : '50px',
              color: 'white',
              userSelect: 'none',
            }}
          >
            {body.charAt(0).toUpperCase() + body.slice(1)}
          </div>
        ))}
      </div>

      <div className="description-box" style={{ marginTop: '30px' }}>
        {selected ? (
          <>
            <h2>{selected.charAt(0).toUpperCase() + selected.slice(1)}</h2>
            <p>{solarObjects[selected]}</p>
            <button onClick={() => setSelected(null)}>Close</button>
          </>
        ) : (
          <p>Click on a planet or the Sun to see fascinating scientific facts.</p>
        )}
      </div>
    </div>
  );
};

export default SolarSystem;
