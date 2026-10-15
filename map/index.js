require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/widgets/BasemapToggle"
], function (Map, SceneView, Graphic, GraphicsLayer, BasemapToggle) {
  var map = new Map({
    basemap: "satellite",
    ground: "world-elevation"
  });

  // Globe view (spherical Earth with atmosphere, tilt and rotate).
  var view = new SceneView({
    container: "viewDiv",
    map: map,
    viewingMode: "global",
    center: [10, 25],
    zoom: 2
  });

  var toggle = new BasemapToggle({
    view: view,
    nextBasemap: "topo"
  });
  view.ui.add(toggle, "top-right");

  var graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  var kinds = {
    stay:    { style: "square", color: [64, 176, 64, 0.9],  base: 12 },
    well:    { style: "square", color: [196, 64, 64, 0.85], base: 12 },
    travel:  { style: "circle", color: [196, 64, 64, 0.5],  base: 8 }
  };

  function createSymbol(kind, size) {
    var k = kinds[kind];
    return {
      type: "simple-marker",
      color: k.color,
      style: k.style,
      size: size,
      outline: { color: [255, 255, 255], width: 1 }
    };
  }

  // Scale markers with zoom level.
  function scaleMarkers() {
    var f = 45000000 ** 0.3 / view.scale ** 0.3;
    graphicsLayer.graphics.forEach(function (g) {
      var kind = g.attributes.kind;
      g.symbol = createSymbol(kind, kinds[kind].base * f);
    });
  }
  view.watch("scale", scaleMarkers);

  // Load markers from places.csv (columns: type,city,latitude,longitude,removed).
  fetch("places.csv")
    .then(function (r) { return r.text(); })
    .then(function (text) {
      var rows = text.trim().split(/\r?\n/).map(function (row) { return row.split(","); });
      var col = {};
      rows[0].forEach(function (name, i) { col[name] = i; });
      rows.slice(1).forEach(function (c) {
        var kind = c[col.type];
        // Rows with a value in the "removed" column are kept in the CSV but not shown.
        if (!kinds[kind] || (c[col.removed] || "").trim()) return;
        graphicsLayer.add(new Graphic({
          geometry: { type: "point", latitude: parseFloat(c[col.latitude]), longitude: parseFloat(c[col.longitude]) },
          attributes: { kind: kind, city: c[col.city] },
          symbol: createSymbol(kind, kinds[kind].base)
        }));
      });
      scaleMarkers();
    });

});
