[out:json];
// gather results
(

  node(around:100.0, "lat", "lon");
  way(around:100.0, "lat", "lon");
);
// print results
out body;
>;
out skel qt;