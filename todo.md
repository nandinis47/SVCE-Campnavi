# Corrected Campus Routing — R Wing Section

## Managed full-stack TypeScript/Express + Drizzle/TiDB routing migration

- [x] Repair upgraded full-stack scaffold dependencies, merge conflicts, and dev-server startup errors before adding routing features.

- [x] Upgrade the static project with the supported managed backend and database capability.
- [x] Design database tables for buildings/locations, navigation nodes, and graph edges.
- [x] Seed the authoritative graph without inventing or changing route data.
- [x] Implement server-side Dijkstra and a typed route procedure/API.
- [x] Integrate frontend route requests while preserving the existing map visualization, UI, and Student AI.
- [x] Add explicit route-query loading and backend-error states so API failures are not shown as graph disconnections.
- [x] Add explicit node-selector query loading/error handling and verify the fallback behavior.
- [x] Verify database/API/UI behavior and document setup and test commands; save a checkpoint.
- [x] Ensure fallback and warning-state tests are included in the active Vitest configuration and execute successfully.
- [x] Add a deterministic test for the node-query fallback behavior and its user-visible warning state.
- [x] Document the managed full-stack routing migration, schema, seed command, tRPC procedures, and verification commands.
- [x] Save a checkpoint covering the complete managed full-stack routing migration.

## Superseded Python FastAPI + SQL routing migration

- [x] Inventory the current React/Three.js frontend, browser graph, Node/TypeScript scaffold, and route API usage; findings are documented in the managed migration notes.
- [x] Confirm whether the managed project supports replacing the current backend with Python/FastAPI/SQLAlchemy/PostgreSQL without breaking deployment; the managed runtime does not support that swap, so the supported TypeScript/Express + Drizzle/TiDB path was selected.
- [x] Preserve the existing graph as the authoritative seed source; do not invent or alter route data.
- [x] If supported, create modular FastAPI routers/services/models/database configuration and SQL graph tables; not applicable because the managed platform limitation was confirmed.
- [x] If supported, move Dijkstra execution to the backend and integrate the frontend route request while preserving the existing 3D map and Student AI; completed through the supported managed server architecture.
- [x] Document schema, API, environment variables, installation, startup, migration, seed, and testing commands.
- [x] Verify existing UI/map/Student AI behavior and save a checkpoint; the exact platform limitation and non-destructive managed alternative are documented.

## New R Wing and Student Community Centre route section

- [x] Add R Wing Junction → straight → 9 steps → EB105A (Data Science Department).
- [x] Add EB105A → straight → 9 steps → Boys Washroom → 11 steps → EB107 A/B Laboratory.
- [x] Add EB107 A/B Laboratory → straight → 6 steps → EB120 Student Community Centre.
- [x] Add EB107 A/B Laboratory → right → 44 steps → Student Community Centre main area.
- [x] Add EB120 → straight → 7 steps → EB108 A/B Laboratory → right → 8 steps → EB109 Project Room → straight → 19 steps → EB110 → straight → 18 steps → EB111 → straight → 7 steps → EB112 Interactive Learning Room / Meeting Room.
- [x] Add EB112 → left → 13 steps → Student Community Centre main area.
- [x] Add Student Community Centre main area → straight → 13 steps → Delegates Lounge / Principal Chamber.
- [x] Preserve ambiguous duplicate labels and do not invent the omitted Path to Block A connection or any unprovided distance.
- [x] Verify graph connectivity and save a checkpoint.

## Student AI renamed-room voice recognition

- [x] Inspect Student AI voice-query normalization and graph-node matching.
- [x] Add EB101, EB102, EB103, and EB104 room-name aliases to the existing node IDs.
- [x] Ensure natural spoken variants such as “E B 104” and “DS Faculty Room” resolve correctly.
- [x] Preserve route data, coordinates, map, UI, and unrelated functionality; verify and save a checkpoint.

## R Wing route-node label renames

- [x] Rename R101 to EB101 (Studio Room).
- [x] Rename R102 to EB102 (Studio Room).
- [x] Rename R103 to EB103 (Studio Room).
- [x] Rename R104 / DS Staffroom to EB104 (DS Faculty Room).
- [x] Preserve IDs, weights, directions, route order, map positions, and all unrelated behavior; verify and save a checkpoint.

## R Wing 2 to R101 direction correction

- [x] Change only R Wing 2 College Block → R101 from straight to left.
- [x] Preserve the 5-step weight, endpoints, node order, and all other route data.
- [x] Verify the direction-only change and save a checkpoint.

## R Wing 2 Ground Floor sequence update

- [x] Set Face Detection Junction → left → 0 steps → R Wing 2 College Block (Ground Floor).
- [x] Add R Wing 2 College Block → straight → 5 steps → R101.
- [x] Preserve R101 → R102 (19) → R103 (19) → R104 / DS Staffroom (19) → R-Wing Junction.
- [x] Verify only this R Wing 2 sequence change and save a checkpoint.

## Single-sentence Student AI opening

- [x] Keep only sentence 1 as the app-opening Student AI greeting.
- [x] Ensure opening TTS speaks exactly one sentence and preserve all other guidance behavior.
- [x] Verify the targeted change and save a checkpoint.

## Hands-free Student AI Play Mode

- [x] Inspect current TTS lifecycle and browser speech-recognition availability.
- [x] Add a Play Mode toggle that automatically starts microphone listening without a microphone button.
- [x] Convert recognized speech to text and send it through the existing graph-backed response logic.
- [x] Pause recognition while TTS is speaking, then resume listening after the answer.
- [x] Show subtle Listening… and Speaking… states while preserving text input fallback.
- [x] Verify microphone-denied/unsupported fallback and unchanged routing/map behavior; save a checkpoint.

## Dynamic Start-node selector

- [x] Add a Start dropdown populated from every valid campus graph node.
- [x] Keep the selected Start node synchronized with route calculation and current-position/manual fallback controls.
- [x] Preserve Destination, Find Route, Student AI, map, graph, backend, and all unrelated behavior.
- [x] Verify an arbitrary start selection and save a checkpoint.

## Consolidated Route Planner UI

- [x] Inspect current Route Planner and Current Position placement and state wiring.
- [x] Keep Open Route Planner and the location controls at bottom-left.
- [x] Use detected location automatically as Start, with Confirm Block/Floor fallback when unavailable.
- [x] Preserve Destination selection, Find Route, and route nodes/directions/steps below the controls.
- [x] Preserve main-anchor 3D path display and Student AI at bottom-right.
- [x] Verify the targeted UI change without modifying backend, database, or unrelated map logic; save a checkpoint.

## Spoken Student AI guidance

- [x] Inspect the Student AI message lifecycle and browser speech support.
- [x] Add graph-derived browser text-to-speech for opening, route, response, and arrival messages.
- [x] Add Play, Pause, Stop, and mute controls.
- [x] Ensure speech automatically announces route guidance after Find Route without inventing content.
- [x] Verify speech fallback and control behavior, then save a checkpoint.

## Confirmed Admission Enquiry → Face Detection route

- [x] Add Admission Enquiry → Face Detection intermediate node sequence using 20 steps straight, then 15 steps right.
- [x] Preserve Main Gate → Admission Enquiry (10 steps) and the existing Face Detection → R Wing 2 route.
- [x] Keep Face Detection text-only while projecting visible route geometry through confirmed main anchors.
- [x] Add Student AI guidance from the graph route, including the opening message, Find Route handoff, natural route-status replies, and double-tap pause.
- [x] Verify the requested route and save a checkpoint.

## Main-anchor visualization and Student AI guidance

- [x] Verify Main Gate → Admission Enquiry → Face Detection → R Wing 2 route semantics from existing graph data.
- [x] Show only confirmed main-anchor geometry on the 3D map while retaining Face Detection in text guidance.
- [x] Add bottom-right Student AI control and chat panel without disturbing existing layout.
- [x] Start opening guidance on app load and route guidance after Find Route using only existing directions and steps.
- [x] Support route-status replies and double-tap pause without inventing guidance.
- [x] Verify the targeted behavior and save a checkpoint.

## Main-anchor routing display logic from attached specification

- [x] Map existing internal nodes to only explicitly confirmed parent/main anchors; do not invent relationships.
- [x] Keep internal rooms searchable/selectable while projecting the 3D route to visible main anchors only.
- [x] Preserve exact graph calculation and all existing distances/weights; use the projection only for display.
- [x] Show the exact selected start and destination plus projected main anchors in the text route sequence.
- [x] Ensure internal locations do not create separate 3D markers.
- [x] Verify main-anchor, main-to-internal, internal-to-main, and internal-to-internal cases; save a checkpoint.

## Next navigation improvements

- [x] Audit available confirmed 3D anchors and representative graph routes before changing UI.
- [x] Add a compact intermediate-node summary to the route planner.
- [x] Validate representative cross-section routes and directionality without changing route data.
- [x] Document remaining unanchored path segments; do not invent coordinates or connections.
- [x] Verify the planner and map, then save a checkpoint.

## Dynamic route planner and complete path refresh

- [x] Inspect Start/Destination state and the current route overlay lifecycle.
- [x] Make Start and Destination selectable from every valid campus graph node, with Main Gate only as the initial default.
- [x] Replace the previous blue route with the complete Dijkstra path across every intermediate node when Find Route is clicked.
- [x] Ensure route refreshes correctly for changed selections without modifying graph, coordinates, backend, or route data.
- [x] Verify the targeted behavior and save a checkpoint.

## R Wing 2 marker adjustment — follow-up

- [x] Move only the R Wing 2 visual marker slightly farther right.
- [x] Preserve R Wing 2 identity, routing coordinates, building, and all unrelated map elements.
- [x] Verify the targeted shift and save a checkpoint.

## R Wing 2 marker adjustment

- [x] Move only the R Wing 2 visual marker slightly right.
- [x] Preserve R Wing 2 identity, routing coordinates, building, and all unrelated map elements.
- [x] Verify the targeted shift and save a checkpoint.

## R Wing marker swap

- [x] Exchange only the visual coordinates of the R Wing 1 and R Wing 2 campus markers.
- [x] Preserve marker names, IDs, click behavior, routing node identities, buildings, and all unrelated locations.
- [x] Verify the swapped positions and save a checkpoint.

## Exact route-definition replacement

- [x] Set Face Detection Junction → left → 0 steps → R Wing 2 Ground Floor begins.
- [x] Preserve R Wing 2 Ground Floor → R102 (19) → R103 (19) → R104 / DS Staffroom (19) → R-Wing Junction (8).
- [x] Remove the aggregate R Wing Junction → R Wing 1 Ground-Floor Labs edge.
- [x] Preserve the detailed R Wing 1 route: R-Wing Junction → right → R112 (5) → R111 (20) → DS Skill Lab (20) → R Wing 1 Staircase (16).
- [x] Verify only these route-definition changes and save a checkpoint.

## Latest confirmed R Wing metadata

- [x] Mark the full Face Detection Junction left branch through R102, R103, R104 / DS Staffroom, and R-Wing Junction as R Wing 2 Ground Floor.
- [x] Confirm R112 as the R Wing 1 Ground-Floor Labs room-level anchor, 5 steps from R-Wing Junction.
- [x] Preserve the existing R112 → R111 → DS Skill Lab → R Wing 1 staircase sequence and weights.
- [x] Verify metadata, anchor references, and save a checkpoint.

## Latest confirmed route updates

- [x] Set R Wing Junction → College Bus Parking to left, 12 steps, beside the shared stairs.
- [x] Add a distinct R Wing 1 First-Floor Junction node and terminate the shared-stairs 26-step transition there, not directly at a first-floor destination.
- [x] Preserve the R Wing 1 ground-floor lab sequence through R112, R111, DS Skill Lab, and the R Wing 1 first-floor staircase.
- [x] Set Face Detection Junction → Amphitheatre to straight, 63 steps to the Amphitheatre endpoint.
- [x] Set Face Detection Junction → Cafeteria Entrance 2 to right, 10 steps.
- [x] Verify Dijkstra paths and save a checkpoint.

## Latest R Wing 2 continuation

- [x] Extend the Face Detection Junction left branch through R Wing 2 College Block to the R-Wing Junction.
- [x] Preserve the existing R Wing 2 sequence and weights: R Wing 2 → R102 (19) → R103 (19) → R104 / DS Staffroom (19) → R-Wing Junction (8).
- [x] Keep the branch's Face Detection Junction → R Wing 2 distance unweighted until supplied.
- [x] Verify the end-to-end route and save a checkpoint.

## Latest user-confirmed corrections

- [x] Confirmed interpretation: College Bus Parking → right → 12 steps → shared R Wing 1 & 2 first-floor stairs; reverse wording from R-Wing Junction is the left path toward College Bus Parking, with stairs alongside.

- [x] Keep Face Detection Junction → R Wing 2 ground floor as a left branch with no invented distance.
- [x] Set College Bus Parking → right → 12 steps → Shared R Wing Stairs, and document the reverse R-Wing Junction left-path interpretation.
- [x] Set the shared R Wing stairs → R Wing first-floor junction transition to 26 steps and preserve the up transition.
- [x] Add the R Wing 1 right branch: R112 (5), R111 (20), DS Skill Lab (20), and stairs to R Wing 1 first floor (16).
- [x] Update the R Wing 1 straight branch: R105 (10), R106 (4), and R107 (8), using the user's clarified room labels.
- [x] Change Face Detection Junction → Cafeteria Entrance 2 direction from left to right without changing its missing weight.
- [x] Verify only these requested changes and save a checkpoint.

## Single-edge direction correction

- [x] Change only `Face Detection Junction → R Wing 2 College Block (Ground Floor)` direction from right to left.
- [x] Preserve the null step count, endpoints, source, reversibility, and every other edge unchanged.
- [x] Verify and save the targeted checkpoint.

- [x] Transcribe the R Wing 2 and R Wing 1 routes exactly as provided.
- [x] Add confirmed R Wing classroom, staffroom, junction, lab, washroom, and HOD nodes with the stated step weights.
- [x] Preserve the left path toward College Bus Parking and the stairs/floor transition for R Wing 2/R Wing 1 first floor.
- [x] Flag any unresolved stair endpoint or floor-transition destination instead of guessing.
- [x] Verify Dijkstra routing, directions, and preservation of unrelated map/UI behavior.
- [x] Save a checkpoint and deliver the updated routing section; included in checkpoint `0bab919f`.

## User-provided route transcription

| From | Direction / transition | To | Steps |
|---|---|---|---:|
| Face Detection Junction | right, ground floor | R Wing 2 ground floor college block | not stated |
| R Wing 2 ground floor | classroom sequence | R102 | 19 |
| R102 | straight | R103 | 19 |
| R103 | straight | R104 / DS Staffroom | 19 |
| R104 / DS Staffroom | straight | R Wing Junction | 8 |
| R Wing Junction | left path | College Bus Parking | not stated |
| R Wing Junction | stairs | R Wing 2 or R Wing 1, first floor | not uniquely specified |
| R Wing Junction | right, ground-floor labs | R Wing 1 ground floor labs | not stated |
| R Wing Junction | straight | R105 / Boys Washroom | 10 |
| R105 / Boys Washroom | straight | R106 / Data Science HOD Room | 4 |
| R106 / Data Science HOD Room | straight | R107 / ADE Lab Room | not stated |

## Ambiguities

The user did not state a step count from Face Detection Junction to R Wing 2, from R Wing Junction to the R Wing 1 labs, or from R106 to R107. The stairs lead to either R Wing 2 or R Wing 1 first floor and require explicit transition handling without choosing one endpoint.

## Complete missing-connection audit

- [x] Enumerate every null-weight edge and every section boundary with no declared edge.
- [x] Record each gap's start node, destination node, route position, known direction, and required measurement or confirmation.
- [x] Add a review-only missing-connection list without changing confirmed graph data.
- [x] Add visual review indicators only for gaps with existing confirmed anchors; avoid guessed coordinates.
- [x] Verify routing behavior and preserve all current confirmed edges and weights.
- [x] Save a checkpoint and deliver the audit.

## Route calculation and graph connectivity audit

- [x] Inspect the route planner state flow and existing Dijkstra invocation.
- [x] Add a clear Find Route / Calculate Route button below the start and destination controls.
- [x] Ensure valid graph routes render step-by-step and do not show the no-route message.
- [x] Audit every authoritative node and edge from Main Gate through all transcribed sections.
- [x] Record disconnected components and missing/unverified links without inventing connections.
- [x] Verify the UI and save a checkpoint.

## Clarified R Wing diagram update

- [x] Replace the single staircase branch with explicit destinations: R Wing 2 — 1st Floor and R Wing 1 — 1st Floor, reached from the College Bus Parking side.
- [x] Add the explicit straight branch from R-Wing Junction to R Wing 1 — Ground Floor, then R105 → Boys Washroom → R106 → Data Science HOD Room → R107 → ADE Lab Room.
- [x] Preserve the exact known weights: 19, 19, 19, 8, 10, and 4; keep unstated distances null and review-flagged.
- [x] Verify the corrected R Wing routes and save a new checkpoint.

- [x] Complete operational documentation with environment variables, installation, startup, migration application, seed, and test commands.
- [x] Add explicit post-migration Student AI route-handoff and fallback-flow verification, then save the final checkpoint.

## Latest user-supplied Student Community, Center Dome, and R Wing 1 routes

- [ ] Transcribe the Student Community Centre main-area → Delegates Lounge → Admission Section sequence using only supplied steps and directions.
- [ ] Preserve the ambiguous Center Dome alternatives, 0–14 step range, and teacher/library/lift branches as review metadata without guessing.
- [ ] Add Center Dome branches to L Wing 1, R Wing 1, Center Dome Entrance, Decorative Fountain, Xerox, and Medical Room with supplied weights.
- [ ] Add Decorative Fountain branches to Cafeteria, Face Detection Junction, seating/greenery nodes, Student Lawn Seating, and L Wing 2 with supplied weights.
- [ ] Add the R Wing Junction → R Wing 1 laboratories → lawn/amphitheatre or first-floor branch with supplied weights and ambiguity flags.
- [ ] Seed and verify the updated authoritative graph, preserve existing UI/Student AI behavior, document the new sections, and save a checkpoint.
