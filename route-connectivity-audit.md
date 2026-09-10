# Campus Route Connectivity Audit

## Scope

This audit inspects the actual `ROUTE_NODES` and `ROUTE_EDGES` definitions in `client/src/lib/routeGraph.ts`. It does not infer connectivity from visual proximity. A connection is classified in two ways:

| Classification | Meaning |
|---|---|
| Structurally connected | A node can be reached through declared edges when edge direction is ignored. |
| Dijkstra-routable | A node can be reached through declared edges with numeric `steps`; `null` edges are intentionally skipped by Dijkstra and therefore require review. |

The current graph contains **138 nodes and 41 declared edges**. Structurally, the Main Gate/R Wing/Amphitheatre/Cafeteria/Student Community Centre route family forms one connected route family. The latest confirmed updates add the R Wing 2 → EB105A → EB107 A/B sequence, both EB107 A/B branches, the EB120 laboratory sequence through EB112, and the 13-step links through Student Community Centre main area to Delegates Lounge / Principal Chamber. All currently declared route edges are numeric and available to Dijkstra.

## Confirmed traversal from Main Gate

| Section | Node-by-node result | Status |
|---|---|---|
| Main Gate → Admission Enquiry → College Bus Parking | Main Gate —10→ Admission Enquiry —30→ College Bus Parking, with an alternative Main Gate —35→ College Bus Parking | **Dijkstra-routable**; 40 steps via Enquiry or 35 steps direct |
| Face Detection | Face Detection —26→ Face Detection Junction | **Dijkstra-routable internally**, but no confirmed weighted edge connects Face Detection to Main Gate or the main-road component |
| Face Detection Junction → R Wing 2 | Junction → R Wing 2 is declared `left` with no step count | **Structurally connected only**; blocks Dijkstra across this boundary |
| R Wing 2 classrooms | R Wing 2 —19→ R102 —19→ R103 —19→ R104/DS Staffroom —8→ R Wing Junction | **Dijkstra-routable internally**; total 65 steps from R Wing 2 to the junction |
| R Wing Junction → College Bus Parking | R Wing Junction —12→ College Bus Parking, direction `left`; shared stairs are alongside this path | **Dijkstra-routable** |
| College Bus Parking → shared stairs | College Bus Parking —12→ shared stairs, direction `right` | **Dijkstra-routable** |
| Shared stairs → R Wing 1 First-Floor Junction | Shared stairs —26→ R Wing 1 First-Floor Junction, direction `forward` | **Dijkstra-routable**; onward first-floor destination branches remain to be supplied |
| R Wing Junction → R Wing 1 ground-floor labs | R Wing Junction —5→ EB105A —9→ Boys Washroom —11→ EB107 A/B; room anchors remain review-only | **Dijkstra-routable**, 25 steps to EB107 A/B |
| R Wing Junction → R Wing 1 ground floor | The clarified straight route begins directly with R Wing Junction —10→ R105/Data Science HOD Room; the existing R105 → R106 → R107 branch is unchanged | **Specific straight classroom branch is Dijkstra-routable** |
| R Wing 1 right branch | R Wing Junction —5→ R112 —20→ R111 —20→ DS Skill Lab —16→ R Wing 1 Staircase | **Dijkstra-routable**, 61 steps internally; first-floor destination remains anchor-review only |
| R Wing 1 straight branch | R Wing Junction —10→ R105/Data Science HOD Room —4→ R106/Boys Washroom —8→ R107/ADE Lab Room | **Dijkstra-routable**, 22 steps internally |
| Face Detection Junction → Amphitheatre | Face Detection Junction —63→ Amphitheatre, direction `straight` | **Dijkstra-routable**; the legacy Amphitheatre Route/63-step endpoint chain is no longer used for this branch |
| Face Detection Junction → Cafeteria Entrance 2 | Face Detection Junction —10→ Cafeteria Entrance 2, direction `right`; the map node remains distinct from the route-document Cafeteria Entrance node | **Dijkstra-routable**, with endpoint identity still documented |
| Cafeteria Entrance → Cafeteria → 68-step continuation → Amphitheatre endpoint | Cafeteria Entrance —8→ Cafeteria —68→ continuation —5→ Amphitheatre endpoint | **Dijkstra-routable** within the route-document Cafeteria sequence; it is not linked to Cafeteria Entrance 2 by a confirmed edge |

## Disconnected or incomplete previously added sections

The following nodes currently have no declared edges and therefore form isolated components. They cannot be reached by Dijkstra from Main Gate, regardless of their visual position on the 3D map:

| Section | Current graph status | Required confirmation before connecting |
|---|---|---|
| Courtyard branch and seating areas | Isolated | Exact junction identity and step counts for the branch sequence |
| Cafeteria Entrance 1 | Isolated | Whether it connects to the route-document Cafeteria Entrance or another node |
| Center Dome | Isolated | Entry connection and distance |
| Meeting Room, Admission Block | Isolated | Source junctions and step counts |
| Lift and Library | Isolated | Whether this is one combined node or separate lift/library nodes, plus transitions |
| Decorative Fountain | Isolated | Neighboring route node and distance |
| L Wing 1, R113, and R/L Wing staircases | Isolated | Explicit floor-plan sequence, stair connections, and weights |
| Student Lounge, Staff Lounge, and lounge sitting areas | Isolated | Confirmed approach node, floor transition, and distances |
| Main Road Junction, Girls Hostel Entrance, Gate 2 | Isolated | Confirmed connection to the main route and gate direction/steps |
| Mechanical R&D Centre, Fluid Mechanics Lab, Research Lab | Isolated | Building entrance/junction and distances |
| New Block entrance, lift/stair junction, staircase, and N105/N101/N104/N102 rooms | Isolated | Complete ground-floor sequence and stair/lift transitions |
| Basic Science staircase/centre and N2xx rooms | Isolated | Connection from the preceding floor transition and room sequence |
| Civil staircase/lift/centre and N3xx rooms | Isolated | Connection from the preceding floor transition and room sequence |
| MBA staircase/lift/centre and N4xx rooms | Isolated | Connection from the preceding floor transition and room sequence |
| Terrace staircase | Isolated | Preceding branch, distance, and destination |
| Xerox/Medical, Sports Ground Gate, ATM, Hot Corns, Main Canteen, Canteen Gate | Isolated | Explicit route entry and step counts |
| Boys Hostel, Sports Ground, Vehicle Parking, Bus Stop, Exit Gate | Isolated | Confirmed upstream junctions, gate transitions, and step counts |

## Newly connected Student Community Centre section

| Section | Node-by-node result | Status |
|---|---|---|
| R Wing Junction → EB107 A/B | R Wing Junction —9→ EB105A —9→ Boys Washroom —11→ EB107 A/B | **Dijkstra-routable**, 29 steps |
| EB107 A/B branches | EB107 A/B —6→ EB120 Student Community Centre; EB107 A/B —44→ Student Community Centre main area | **Dijkstra-routable**, branch endpoints remain unanchored |
| EB120 internal sequence | EB120 —7→ EB108 A/B —8→ EB109 Project Room —19→ EB110 —18→ EB111 —7→ EB112 Interactive Learning Room | **Dijkstra-routable**, 59 steps internally |
| EB112 → Student Community Centre main area | EB112 —13→ Student Community Centre main area, direction `left` | **Dijkstra-routable** |
| Student Community Centre main area → Delegates Lounge / Principal Chamber | Main area —13→ Delegates Lounge / Principal Chamber, direction `straight` | **Dijkstra-routable**; destination identity remains combined as supplied |

## Missing or broken boundaries that currently prevent complete Dijkstra routes

1. The R Wing 2 entry, the detailed R Wing 1 labs route, and the new Student Community Centre section are now weighted. Any route boundary outside these declared sections, including a potential Main Gate → Face Detection connection, remains subject to the authoritative source and is not inferred here.
2. Face Detection Junction → R Wing 2 is confirmed as left, 0 steps, followed by the 19, 19, 19, and 8 step R Wing 2 sequence. Amphitheatre and Cafeteria Entrance 2 remain confirmed at 63 straight steps and 10 right steps respectively.
3. The aggregate R Wing Junction → R Wing 1 Ground-Floor Labs edge has been replaced by the detailed weighted route R112 (5) → R111 (20) → DS Skill Lab (20) → R Wing 1 Staircase (16).
4. The clarified R Wing 1 right and straight sequences and the new EB105A/EB107 A/B/Student Community Centre sequences are weighted and Dijkstra-routable. No aggregate labs edge remains.
5. Cafeteria Entrance 2 is not linked to the separate route-document Cafeteria Entrance node. This must be confirmed rather than inferred.
6. All isolated legacy sections require explicit source edges before they can participate in campus-wide routing.

## 3D map review status

The route planner now exposes **no remaining null-weight connections** for the currently declared graph edges; the Graph Review section is empty for this route set. Each item includes the exact node pair, known direction, route position, and the measurement or identity confirmation required.

A missing edge is not drawn as a line on the 3D map when either endpoint lacks a confirmed 3D anchor. In the current graph, every null-weight boundary has at least one unanchored junction, room, staircase, or ambiguous route identity. Drawing a line to a visually nearby marker would therefore imply an unverified coordinate, so the map intentionally shows only confirmed route highlights. Once both endpoint anchors are supplied, these review items can be promoted to visual dashed overlays without changing their routing weights.

No connection was added as part of this audit. The only functional change in this update is the review-only Graph Review list in the planner; existing null-weight edges continue to be excluded by Dijkstra until the user supplies their distances.
