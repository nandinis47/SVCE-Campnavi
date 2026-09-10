# Managed Full-Stack Campus Routing Migration

## Architecture decision

The project now uses the managed WebDev full-stack architecture: React/Three.js on the client, Express with tRPC on the server, and Drizzle ORM against the managed MySQL/TiDB database. The original Python/FastAPI/PostgreSQL target was not used because the managed runtime supports the TypeScript/Express + Drizzle/TiDB stack directly.

The existing 3D map, marker geometry, route planner layout, browser speech features, and Student AI remain client-facing features. Route calculation and the authoritative graph are now database-backed and executed on the server.

## Database schema

The migration defines three routing-related tables in `drizzle/schema.ts`:

| Table | Purpose |
|---|---|
| `route_nodes` | Stores every authoritative navigation node, including floor, node kind, anchor metadata, ambiguity flags, and review notes. |
| `route_edges` | Stores every source edge, direction, optional transition type, reversibility, and documented step weight. A `NULL` step count is retained for unresolved source measurements and is excluded from Dijkstra calculations. |
| `campus_locations` | Stores the existing 3D marker metadata, including marker name, numbered source location, category, description, icon, and normalized drone-image coordinates. |

The user/authentication table remains provided by the managed scaffold. The initial migration is `drizzle/0000_nappy_pretty_boy.sql`; the marker metadata migration is `drizzle/0001_many_scream.sql`.

## Authoritative graph and seeding

`server/authoritativeRouteGraph.ts` is generated from `client/src/lib/routeGraph.ts` by `scripts/extract-route-graph.mjs`. This preserves the supplied route node labels, edge endpoints, directions, step weights, transitions, reversibility, and source metadata without inventing connections.

Run the extraction after an intentional authoritative graph update:

```bash
node scripts/extract-route-graph.mjs
```

Seed the route graph and current 3D marker dataset with:

```bash
node --import tsx scripts/seed-route-graph.mjs
```

The seed operation is idempotent. It leaves populated tables unchanged and reports the existing counts instead of duplicating rows. The verified database currently contains 138 route nodes, 39 route edges, and 24 campus locations.

## Server procedures

The typed procedures are defined in `server/routers.ts` under `campus`:

| Procedure | Purpose |
|---|---|
| `campus.nodes` | Returns the database-backed navigation node list for the Start and Destination selectors. |
| `campus.locations` | Returns the persisted 3D marker metadata. |
| `campus.route` | Accepts `startId` and `endId`, loads the graph from the database, and returns the shortest documented route. |
| `campus.node` | Returns one database-backed node by ID. |

The route response preserves the existing client contract: ordered `nodeIds`, traversed `edges`, `totalSteps`, graph-derived `directions`, and `reviewFlags`.

## Dijkstra behavior

`server/routeGraphService.ts` expands reversible edges into reverse traversal entries and runs Dijkstra using the documented `steps` value as the weight. Edges with `steps: null` remain available for review metadata but are not traversed. The service does not infer coordinates, distances, route branches, or missing measurements.

The frontend sends route requests through the managed tRPC API. `Home.tsx` passes the returned route into `CampusScene`, `RoutePanel`, and `StudentAI`. The Three.js layer still projects the returned node sequence onto confirmed visible anchors for drawing, while Student AI receives the server-generated directions and review flags.

## Verification commands

Run the complete local validation suite from the project root:

```bash
pnpm test -- --run
pnpm check
pnpm build
```

The routing tests cover direct weighted-route selection, reversible navigation, the confirmed Face Detection Junction → Amphitheatre path, exclusion of unresolved edges, and the selector’s database/local-fallback resolver.

The local API smoke test for the initial route is:

```bash
curl -G 'http://localhost:3000/api/trpc/campus.route' \
  --data-urlencode 'input={"json":{"startId":"main-gate","endId":"college-bus-parking"}}'
```

The verified response is the direct Main Gate → College Bus Parking path with 35 documented steps.

The Route Planner now distinguishes backend states explicitly. While a route request is pending it shows a calculation state; if the backend fails it reports a route-service error instead of claiming that the graph is disconnected. If the node query fails, the selectors use the existing local node list and display a visible fallback notice.

## Environment and operational setup

The managed project injects its environment values through the WebDev project configuration; secrets must not be committed to `.env` files. The application uses `DATABASE_URL` for the managed MySQL/TiDB database, `JWT_SECRET` for session signing, `VITE_APP_ID`, `OAUTH_SERVER_URL`, and `VITE_OAUTH_PORTAL_URL` for Manus OAuth, `OWNER_OPEN_ID` and `OWNER_NAME` for owner identity, and the built-in Forge variables (`BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL`, and `VITE_FRONTEND_FORGE_API_KEY`) for managed platform services. Analytics variables are `VITE_ANALYTICS_ENDPOINT` and `VITE_ANALYTICS_WEBSITE_ID` when analytics is enabled.

Install the project dependencies with:

```bash
pnpm install
```

Start the managed development server with:

```bash
pnpm dev
```

The production build and server bundle are validated with `pnpm build`; the generated server is started by the managed runtime using `pnpm start`.

## Applying schema migrations

Update `drizzle/schema.ts`, then generate the SQL migration using:

```bash
pnpm drizzle-kit generate
```

Review the generated SQL under `drizzle/` and apply the reviewed creation-only statements through the managed database migration interface (`webdev_execute_sql` in the development workflow). The initial route schema is `drizzle/0000_nappy_pretty_boy.sql`, and the dedicated marker table is `drizzle/0001_many_scream.sql`. Do not use destructive drops or data-loss changes for this graph migration. For a configured local database, the project also exposes the scaffold command:

```bash
pnpm db:push
```

After applying the migration, load the authoritative graph and 3D marker metadata with:

```bash
node --import tsx scripts/seed-route-graph.mjs
```

The seed command is intentionally idempotent and reports existing row totals instead of duplicating populated tables.

## Post-migration Student AI verification

Student AI now consumes the same server-returned route object passed to the route planner and map. The focused guidance tests verify that a calculated route produces the requested destination handoff and first documented instruction, that a reached-node response advances only through the returned directions and announces arrival at the end, and that a missing route produces a no-guess response instead of fabricated directions. The tests also cover the exact node-query fallback warning and the distinction between a backend route-service failure and a valid disconnected graph.

The latest validation run passed 5 test files and 12 tests, TypeScript checking, and the production build. Browser speech synthesis and microphone recognition remain browser capabilities; no external AI or speech API is required for the existing Student AI flow.

## Latest user-supplied route update

The latest graph refresh adds 23 route nodes and the supplied route branches for the Student Community Centre, Admission Section, Center Dome, Decorative Fountain, seating areas, L Wing 2, and R Wing 1 laboratories. The refreshed managed database contains 161 authoritative nodes and 71 source edges.

The Student Community Centre path is represented as Student Community Centre Main Area → 13 straight → Delegates Lounge Approach → 0 right → Delegates Lounge / Principal Chamber → 0 straight → Admission Section Starts → 18 straight → Admission Section Counters. From the counters, the Center Dome branch remains unresolved because the source gives “right or opposite” and a 0–14-step range; the edge is retained with a null weight and review metadata. The Admission Section End branches are preserved as 0 left to Teachers Punching, 0 right to Teacher Chamber, and 2 straight to the combined Lift and Library node.

Center Dome now has the supplied 18-step left branch to L Wing 1, 18-step right branch to R Wing 1, and 13 straight to Center Dome / Main College Building Entrance, followed by 40 straight to Decorative Fountain. The fountain-to-Xerox approach retains its approximate 0–24-step range as unresolved, followed by the documented 12-step straight Xerox segment. The Medical Room branch preserves the written negative-two-step ambiguity as unresolved rather than converting it into an invented positive distance.

The fountain also includes the 6-step right and 0-step left Cafeteria branch, the 24-step stage and 34-step continuation to Face Detection Junction, and the greenery route: 30 left to Greenery 1, 15 straight to Greenery 2, 21 straight to a seating branch, then 2 left to Student Lawn Seating or 6 straight and 0 left to L Wing 2. The R Wing Junction branch now includes 0 right to R Wing 1 Laboratory Block, then 6 straight to EB124 A/B1, 18 straight to EB123 A/B CAD Laboratory, 18 straight to EB122 A/B Computer Center, and 12 straight to a branch with the supplied 5-step right lawn/amphitheatre alternative and 5-step straight first-floor alternative. Both alternatives remain review-marked because their wording does not uniquely identify a final endpoint geometry.

No new 3D marker coordinates were invented. New route nodes without explicit existing anchors remain searchable in the backend and route planner but are projected only when an existing confirmed main anchor is available.
