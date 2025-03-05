import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function LayersDisplayInformation({ selectedLayers, layersConfig, setViewState }) {
  //  Initialize all layers as expanded by default
  const [expanded, setExpanded] = useState(
    Object.keys(selectedLayers).reduce((acc, layerId) => {
      acc[layerId] = true; // Open all layers by default
      return acc;
    }, {})
  );

  //  Toggle accordion open/close state
  const handleExpand = (layerId) => {
    setExpanded((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  //  Function to zoom into an item when clicked
  const zoomToFeature = (coordinates) => {
    setViewState({
      latitude: coordinates[1], // Adjust for [lng, lat] format
      longitude: coordinates[0],
      zoom: 14, // Zoom level when clicking
      pitch: 0,
      bearing: 0,
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        width: "320px",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
        padding: "10px",
        zIndex: 1100,
      }}
    >
      <Typography variant="h6" style={{ marginBottom: "10px" }}>
        Active Layers Data
      </Typography>

      {Object.entries(selectedLayers)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([layerId]) => (
          <Accordion
            key={layerId}
            expanded={expanded[layerId]}
            onChange={() => handleExpand(layerId)}
            sx={{ marginBottom: "5px" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${layerId}-content`}
              id={`${layerId}-header`}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {layersConfig[layerId]?.label || layerId}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              {layersConfig[layerId].data.map((feature, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{ marginBottom: "8px", cursor: "pointer" }} //  Clickable
                  onClick={() => zoomToFeature(feature.coordinates)} //  Zoom on Click
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {feature.name || "Unknown"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {feature.address || "N/A"}
                    </Typography>

                    {layerId === "chargingStation" && feature.typeOfStation && (
                      <div style={{ marginTop: "5px" }}>
                        <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                          <BoltIcon sx={{ color: "#2e7d32", marginRight: "5px" }} /> 
                          <b>Charging Types:</b>
                        </Typography>
                        <div style={{ marginLeft: "10px" }}>
                          {Object.entries(feature.typeOfStation).map(([type, count]) => (
                            <Typography key={type} variant="body2">
                              - {type}: {count} ports
                            </Typography>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}

export default LayersDisplayInformation;
