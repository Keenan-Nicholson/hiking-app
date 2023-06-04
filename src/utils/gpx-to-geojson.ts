// using togeojson in nodejs

var tj = require("togeojson"),
  fs = require("fs");
// node doesn't have xml parsing or a dom. use xmldom

export const gpxToGeojson = () => {
  var kml = new DOMParser().parseFromString(
    fs.readFileSync("./data/topsail-road-miners-path.gpx", "utf8"),
    "text/xml"
  );

  var converted = tj.kml(kml);

  return converted;
};
