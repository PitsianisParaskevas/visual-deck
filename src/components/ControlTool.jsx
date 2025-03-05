import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

// Define available map styles
const mapStyles = {
  standard: "mapbox://styles/mapbox/standard",
  streets: "mapbox://styles/mapbox/streets-v12",
  satellite: "mapbox://styles/mapbox/satellite-v9",
  naviagation: "mapbox://styles/mapbox/navigation-day-v1",
  dark: "mapbox://styles/mapbox/dark-v10",
};

const layers = [
  {
    id: "radServiceStation",
    label: "Bicycle Service Stations",
  },
  {
    id: "chargingStation",
    label: "Charging Stations",
  },
];

function ControlTool({
  mapStyle,
  setMapStyle,
  selectedLayers,
  setSelectedLayers,
}) {
  const handleChangeMap = (event) => {
    setMapStyle(event.target.value);
  };

  const handleLayerToggle = (layerId) => {
    setSelectedLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId], //  Toggle layer visibility
    }));
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        padding: "10px 15px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
        zIndex: 1100, // Ensures it stays above the map
      }}
    >
      {/* Select Map */}
      <FormControl sx={{ minWidth: "150px" }} size="small">
        <Select
          labelId="select-map-label"
          id="map"
          value={mapStyle || mapStyles.standard} // Ensures a valid default value
          onChange={handleChangeMap}
        >
          {Object.entries(mapStyles).map(([key, value]) => (
            <MenuItem key={key} value={value}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Layer Visibility */}
      <div style={{ marginTop: "10px" }}>
        <h4 style={{ margin: "10px 0 5px" }}>Layers</h4>
        <FormGroup>
          {layers.map((layer) => (
            <FormControlLabel
              key={layer.id}
              control={
                <Checkbox
                  checked={selectedLayers[layer.id] || false} //  Prevents undefined errors
                  onChange={() => handleLayerToggle(layer.id)}
                />
              }
              label={layer.label}
            />
          ))}
        </FormGroup>
      </div>
    </div>
  );
}

export default ControlTool;
