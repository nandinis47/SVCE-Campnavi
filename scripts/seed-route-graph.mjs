import { seedAuthoritativeRouteGraph } from "../server/routeGraphSeed.ts";
import { seedCampusLocations } from "../server/campusLocationSeed.ts";

const graphResult = await seedAuthoritativeRouteGraph();
const locationResult = await seedCampusLocations();
console.log(JSON.stringify({ graph: graphResult, locations: locationResult }, null, 2));
