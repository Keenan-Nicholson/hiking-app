import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./root.css";

const API_KEY = import.meta.env.VITE_MAP_TILER_API_KEY;

const GEOJSON_URL =
  "https://hiking-app.fly.dev/collections/public.tracks/items?f=geojson";

export const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) {
      return;
    }
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${API_KEY}`,
      center: [-56.3851, 48.9793],
      zoom: 5.6,
    });

    map.current.on("load", () => {
      console.log("loading geojson url");
      map.current?.addSource("tracks", {
        type: "geojson",
        data: GEOJSON_URL,
      });

      map.current?.addLayer({
        id: "tracks",
        type: "line",
        source: "tracks",
        paint: {
          "line-color": "red",
          "line-width": 2,
        },
      });
    });
  });

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
};
