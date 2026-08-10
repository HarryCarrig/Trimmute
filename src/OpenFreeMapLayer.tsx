import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-leaflet";

export default function OpenFreeMapLayer() {
  const map = useMap();

  useEffect(() => {
    const layer = (L as any).maplibreGL({
      style: "https://tiles.openfreemap.org/styles/dark",
    });

    layer.addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map]);

  return null;
}