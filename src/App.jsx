import { useState } from "react";
import { Map } from "react-map-gl/mapbox";
import DeckGL, { IconLayer } from "deck.gl";
import "mapbox-gl/dist/mapbox-gl.css";

import bicycleIcon from "./assets/images/bicycle.png";
import chargingStationIcon from "./assets/images/charging-station.png";

import radServiceStationData from "./data/radServiceStation.json";
import chargingStationData from "./data/chargingstation.json";
import ControlTool from "./components/ControlTool";
import LayersDisplayInformation from "./components/LayersDisplayInformation";

const mapboxToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const DEFAULT_VIEW_STATE = {
  latitude: 49.428626412446526,
  longitude: 8.637017529934395,
  zoom: 11,
  pitch: 0,
  bearing: 0,
};

// Default Map Style
const DEFAULT_MAP_STYLE = "mapbox://styles/mapbox/standard";

function getTooltip({ object }) {
  return object && object.name ? { text: object.name } : null;
}

function App() {
  const [mapStyle, setMapStyle] = useState(DEFAULT_MAP_STYLE);
  const [viewState, setViewState] = useState(DEFAULT_VIEW_STATE);

  // Manage selected layers
  const [selectedLayers, setSelectedLayers] = useState({
    radServiceStation: true,
    chargingStation: true,
  });

  // Define layer configurations
  const LAYERS_CONFIG = {
    radServiceStation: {
      label: "Bicycle Service Stations",
      data: radServiceStationData,
      icon: bicycleIcon,
      color: [255, 0, 0],
    },
    chargingStation: {
      label: "Charging Stations",
      data: chargingStationData,
      icon: chargingStationIcon,
      color: [0, 255, 0],
    },
  };

  // Create layers dynamically based on selectedLayers
  const layers = Object.entries(selectedLayers)
    .filter(([_, isEnabled]) => isEnabled)
    .map(([layerId]) =>
      new IconLayer({
        id: layerId,
        data: LAYERS_CONFIG[layerId].data,
        pickable: true,
        getIcon: () => layerId,
        getPosition: (d) => d.coordinates,
        getSize: 40,
        iconAtlas: LAYERS_CONFIG[layerId].icon,
        iconMapping: {
          [layerId]: {
            x: 0,
            y: 0,
            width: 128,
            height: 128,
            mask: false,
            anchorY: 128,
          },
        },
        getColor: () => LAYERS_CONFIG[layerId].color,
        billboard: true,
      })
    );

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Pass state to ControlTool */}
      <ControlTool
        mapStyle={mapStyle}
        setMapStyle={setMapStyle}
        selectedLayers={selectedLayers}
        setSelectedLayers={setSelectedLayers}
      />

      {/* Pass `setViewState` to allow zooming on item click */}
      <LayersDisplayInformation
        selectedLayers={selectedLayers}
        layersConfig={LAYERS_CONFIG}
        setViewState={setViewState} // Pass to child
      />

      {/* Map Component */}
      <DeckGL
        viewState={viewState} // Now controlled dynamically
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        layers={layers}
        controller={true}
        getTooltip={getTooltip}
      >
        <Map reuseMaps mapStyle={mapStyle} mapboxAccessToken={mapboxToken} />
      </DeckGL>
    </div>
  );
}

export default App;
