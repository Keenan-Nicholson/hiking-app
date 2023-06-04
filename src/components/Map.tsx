import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./root.css";

const lng = -56.3851;
const lat = 48.9793;
const zoom = 6;
const API_KEY = import.meta.env.VITE_API_KEY;

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
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("style.load", async () => {
      try {
        let response = await fetch("./public/tracks.geojson");
        console.log(response);
        let geoJSONcontent = await response.json();
        console.log(geoJSONcontent);

        map.current!.addSource("my-source", {
          type: "geojson",
          data: geoJSONcontent,
        });

        map.current!.addLayer({
          id: "track",
          type: "line",
          source: "my-source",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-width": 2,
            "line-color": "#FF0000",
          },
        });
      } catch (error) {
        console.error("Error loading geoJSON content:", error);
      }
    });
  });

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
};
