import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./root.css";

const GEOJSON_URL =
  // production
  "https://hiking-app.fly.dev/collections/public.tracks/items?f=geojson";
//local development
// "http://localhost:8000/collections/public.tracks/items?f=geojson";

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
      style: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=He3M1IBox770FUgb0GkI`,
      center: [-56.3851, 48.9793],
      zoom: 5.6,
    });

    map.current.on("load", () => {
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
