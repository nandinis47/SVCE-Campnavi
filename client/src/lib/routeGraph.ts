/**
 * Authoritative campus routing graph.
 * Source: /home/ubuntu/upload/route.pdf (18 pages).
 * Design: Satellite Explorer — route metadata preserves the document wording.
 * No edge is inferred; every edge below is transcribed from an explicit source passage.
 */

export type RouteFloor = "ground" | "floor-1" | "floor-2" | "floor-3" | "terrace" | "unknown";
export type RouteDirection = "straight" | "left" | "right" | "forward" | "up" | "down" | "branch" | "unknown";

export interface RouteNode {
  id: string;
  label: string;
  floor: RouteFloor;
  kind: "location" | "junction" | "room" | "staircase" | "lift" | "gate" | "endpoint";
  anchorId?: string;
  ambiguous?: boolean;
  reviewNote?: string;
  buildingSection?: string;
  roomAnchorId?: string;
  mainAnchorId?: string;
}

export interface RouteEdge {
  id: string;
  from: string;
  to: string;
  steps: number | null;
  direction: RouteDirection;
  transition?: "staircase" | "lift" | "gate" | "road-crossing";
  source: string;
  reversible: boolean;
}

export interface ShortestRoute {
  nodeIds: string[];
  edges: RouteEdge[];
  totalSteps: number;
  directions: string[];
  reviewFlags: string[];
}

const n = (
  id: string,
  label: string,
  floor: RouteFloor,
  kind: RouteNode["kind"],
  extra: Pick<RouteNode, "anchorId" | "ambiguous" | "reviewNote" | "buildingSection" | "roomAnchorId" | "mainAnchorId"> = {}
): RouteNode => ({ id, label, floor, kind, ...extra });

export const ROUTE_NODES: RouteNode[] = [
  n("main-gate", "Main Gate", "ground", "gate", { anchorId: "main-gate" }),
  n("enquiry-office", "Admission Enquiry", "ground", "location", { anchorId: "enquiry-office" }),
  n("face-detection", "Face Detection Area", "ground", "junction", { mainAnchorId: "r-wing-2", ambiguous: true, reviewNote: "The user identifies Face Detection as a smaller route location within the R Wing 2 approach; it has no separate 3D marker." }),
  n("admission-face-turn", "Admission Enquiry → Face Detection Turn Point", "ground", "junction", { ambiguous: true, reviewNote: "The user confirms a right turn after 20 straight steps but supplies no unique map coordinate." }),
  n("face-detection-junction", "Face Detection Junction", "ground", "junction", { ambiguous: true, reviewNote: "The user confirms this junction but has not supplied a unique map anchor." }),
  n("courtyard-branch-point", "Courtyard Branch Point", "ground", "junction", { ambiguous: true, reviewNote: "The user describes this point after the 5-step straight segment but has not supplied a unique map anchor." }),
  n("student-seating-courtyard", "Student Seating Courtyard", "ground", "location", { ambiguous: true, reviewNote: "The user describes this as the courtyard where students sit; no unique map anchor is supplied." }),
  n("courtyard-right-seating", "Courtyard Right Seating Area", "ground", "location", { ambiguous: true, reviewNote: "The earlier courtyard branch was superseded by the user's later Amphitheatre route description." }),
  n("amphitheatre-route", "Amphitheatre Route", "ground", "junction", { ambiguous: true, reviewNote: "The user identifies this as the 5-step endpoint before the 63-step Amphitheatre segment; no unique map anchor is supplied." }),
  n("amphitheatre-63-end", "Amphitheatre 63-Step End", "ground", "endpoint", { ambiguous: true, reviewNote: "The user identifies this as the end of the 63-step Amphitheatre segment; no unique map anchor is supplied." }),
  n("cafeteria-route", "Cafeteria", "ground", "location", { ambiguous: true, reviewNote: "This is the route-document Cafeteria node; it is kept separate from the current Canteen marker because no unique Cafeteria anchor was supplied." }),
  n("cafeteria-crossing", "Cafeteria 68-Step Continuation", "ground", "junction", { ambiguous: true, reviewNote: "The user describes the entire cafeteria segment as 68 steps; no unique endpoint anchor is supplied." }),
  n("cafeteria-entrance-route", "Cafeteria Entrance", "ground", "location", { ambiguous: true, reviewNote: "The route document says Cafeteria Entrance without a unique map anchor or confirmation that it is Entrance 2." }),
  n("r-wing-2", "R Wing 2 College Block (Ground Floor)", "ground", "location", { anchorId: "r-wing-2", buildingSection: "R Wing 2 Ground Floor" }),
  n("r101", "EB101 (Studio Room)", "ground", "room", { buildingSection: "R Wing 2 Ground Floor", ambiguous: true, reviewNote: "The source identifies EB101 (Studio Room) but supplies no unique 3D room anchor." }),
  n("r102", "EB102 (Studio Room)", "ground", "room", { buildingSection: "R Wing 2 Ground Floor", ambiguous: true, reviewNote: "The source identifies EB102 (Studio Room) but supplies no unique 3D room anchor." }),
  n("r103", "EB103 (Studio Room)", "ground", "room", { buildingSection: "R Wing 2 Ground Floor", ambiguous: true, reviewNote: "The source identifies EB103 (Studio Room) but supplies no unique 3D room anchor." }),
  n("r104-ds-staffroom", "EB104 (DS Faculty Room)", "ground", "room", { buildingSection: "R Wing 2 Ground Floor", ambiguous: true, reviewNote: "The source identifies EB104 (DS Faculty Room) but supplies no unique 3D room anchor." }),
  n("eb105a", "EB105A (Data Science Department)", "ground", "room", { buildingSection: "R Wing 1 Ground Floor", ambiguous: true, reviewNote: "The source identifies EB105A but supplies no unique 3D room anchor." }),
  n("eb107ab", "EB107 A/B (Laboratory)", "ground", "room", { buildingSection: "R Wing 1 Ground Floor", ambiguous: true, reviewNote: "The source identifies EB107 A/B Laboratory but supplies no unique 3D room anchor." }),
  n("eb120-student-community-centre", "EB120 Student Community Centre", "ground", "room", { ambiguous: true, reviewNote: "The source identifies EB120 Student Community Centre but supplies no unique 3D room anchor." }),
  n("eb108ab", "EB108 A/B Laboratory", "ground", "room", { ambiguous: true, reviewNote: "The source identifies EB108 A/B Laboratory but supplies no unique 3D room anchor." }),
  n("eb109-project-room", "EB109 Project Room", "ground", "room", { ambiguous: true, reviewNote: "The source identifies EB109 Project Room but supplies no unique 3D room anchor." }),
  n("eb110-controller-office", "EB110 (Office of Controller of Examination)", "ground", "room", { ambiguous: true, reviewNote: "The source identifies EB110 but supplies no unique 3D room anchor." }),
  n("eb111-controller-office", "EB111 (Office of Controller of Examination)", "ground", "room", { ambiguous: true, reviewNote: "The source identifies EB111 but supplies no unique 3D room anchor." }),
  n("eb112-interactive-learning-room", "EB112 Interactive Learning Room (Meeting Room)", "ground", "room", { ambiguous: true, reviewNote: "The source identifies EB112 but supplies no unique 3D room anchor." }),
  n("student-community-centre-main-area", "Student Community Centre (Main Area)", "ground", "location", { ambiguous: true, reviewNote: "The source identifies the main area separately from EB120 but supplies no unique 3D anchor." }),
  n("delegates-lounge-principal-chamber", "Delegates Lounge / Principal Chamber", "ground", "location", { ambiguous: true, reviewNote: "The source combines Delegates Lounge with Principal Chamber and supplies no unique 3D anchor." }),
  n("delegates-lounge-approach", "Delegates Lounge Approach", "ground", "junction", { ambiguous: true, reviewNote: "The user describes a 13-step straight approach followed by a zero-step right turn into Delegates Lounge; no unique anchor is supplied." }),
  n("r-wing-junction", "R Wing Junction", "ground", "junction", { buildingSection: "R Wing 2 Ground Floor", ambiguous: true, reviewNote: "The source names the R Wing Junction but supplies no unique 3D coordinate." }),
  n("r-wing-1-ground-labs", "R Wing 1 Ground-Floor Labs", "ground", "location", { anchorId: "r-wing-1", buildingSection: "R Wing 1 Ground-Floor Labs", roomAnchorId: "r112", ambiguous: true, reviewNote: "The R Wing 1 ground-floor lab sequence is room-anchored at R112, 5 steps from R Wing Junction; the broader building anchor remains R Wing 1." }),
  n("r105-boys-washroom", "R105 / Data Science HOD Room", "ground", "room", { ambiguous: true, reviewNote: "The source identifies this straight-branch stop as R105 / Data Science HOD Room; no unique 3D room anchor is supplied." }),
  n("boys-washroom", "Boys Washroom", "ground", "room", { ambiguous: true, reviewNote: "Retained as a legacy node; the clarified straight sequence identifies R106 as the Boys Washroom." }),
  n("r106-ds-hod", "R106 / Boys Washroom", "ground", "room", { ambiguous: true, reviewNote: "The source identifies this straight-branch stop as R106 / Boys Washroom; no unique 3D room anchor is supplied." }),
  n("data-science-hod-room", "Data Science HOD Room", "ground", "room", { ambiguous: true, reviewNote: "Retained as a legacy alias; the clarified straight sequence identifies R105 as the Data Science HOD Room." }),
  n("r107-ade-lab", "R107 / ADE Lab Room", "ground", "room", { ambiguous: true, reviewNote: "The source identifies this straight-branch stop as R107 / ADE Lab Room; no unique 3D room anchor is supplied." }),
  n("ade-lab-room", "ADE Lab Room", "ground", "room", { ambiguous: true, reviewNote: "Retained as a legacy alias for the clarified R107 / ADE Lab Room stop." }),
  n("amphitheatre", "Amphitheatre", "ground", "location", { anchorId: "amphitheater" }),
  n("cafeteria-entrance-1", "Cafeteria Entrance 1", "ground", "location", { anchorId: "cafeteria", ambiguous: true, reviewNote: "The document distinguishes two cafeteria entrances but the current map has one Cafeteria anchor." }),
  n("face-detection-stage", "Face Detection Junction Stage", "ground", "junction", { ambiguous: true, reviewNote: "The stage between Face Detection Junction and Cafeteria Entrance 1." }),
  n("cafeteria-entrance-1-junction", "Cafeteria Entrance 1 Junction", "ground", "junction", { ambiguous: true, reviewNote: "Junction 4 steps from Cafeteria Entrance 1 with branches to Xerox and Decorative Fountain." }),
  n("cafeteria-entrance-2", "Cafeteria Entrance 2", "ground", "location", { anchorId: "cafeteria", ambiguous: true, reviewNote: "The document distinguishes two cafeteria entrances but the current map has one Cafeteria anchor." }),
  n("r-wing-1", "R Wing 1", "ground", "location", { anchorId: "r-wing-1" }),
  n("college-bus-parking", "College Bus Parking", "ground", "location", { anchorId: "college-bus-parking" }),
  n("center-dome", "Center Dome", "ground", "location", { anchorId: "center-dome" }),
  n("student-community-centre", "Student Community Centre", "ground", "location", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("meeting-room", "Meeting Room", "ground", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("principal-chamber", "Principal Chamber", "ground", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("admission-block", "Admission Block", "ground", "location", { ambiguous: true, reviewNote: "The document distinguishes Admission Block from Enquiry Office but the current map has no separate anchor." }),
  n("lift-library", "Lift and Library", "ground", "lift", { ambiguous: true, reviewNote: "Combined wording does not identify separate lift and library coordinates." }),
  n("decorative-fountain", "Decorative Fountain", "ground", "junction", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("l-wing-1", "L Wing 1", "ground", "location", { anchorId: "l-wing-1" }),
  n("wb110", "WB110 Skill Lab", "ground", "room", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 Skill Lab WB110." }),
  n("wb111", "WB111", "ground", "room", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 Room WB111." }),
  n("wb112", "WB112", "ground", "room", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 Room WB112." }),
  n("student-resting-area", "Student Resting Area", "ground", "location", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "Student resting area near WB112." }),
  n("l-wing-junction", "L Wing Junction", "ground", "junction", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 junction after WB112." }),
  n("wb105a", "WB105A Department of CSE Cybersecurity", "ground", "room", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 WB105A Cybersecurity Department." }),
  n("l-wing-girls-washroom", "L Wing Girls Washroom", "ground", "room", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 Girls Washroom." }),
  n("l-wing-drinking-water", "L Wing Drinking Water", "ground", "location", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 Drinking Water counter." }),
  n("wb107", "WB107 Laboratory", "ground", "room", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 WB107 Laboratory." }),
  n("library-entrance-2", "Library Entrance 2", "ground", "location", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 Library Entrance 2." }),
  n("wb108", "WB108 Laboratory", "ground", "room", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 WB108 Laboratory." }),
  n("l-wing-1-first-floor", "L Wing 1 — 1st Floor", "floor-1", "endpoint", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 first floor landing." }),
  n("wb204", "WB204 Lecture Hall", "floor-1", "room", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 WB204 Lecture Hall." }),
  n("wb203", "WB203 Lecture Hall", "floor-1", "room", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 WB203 Lecture Hall." }),
  n("wb202", "WB202 Lecture Hall", "floor-1", "room", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 WB202 Lecture Hall." }),
  n("wb201", "WB201 Lecture Hall", "floor-1", "room", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 WB201 Lecture Hall." }),
  n("l-wing-2-first-floor", "L Wing 2 — 1st Floor", "floor-1", "endpoint", { buildingSection: "L Wing 2", ambiguous: true, reviewNote: "L Wing 2 first floor landing." }),
  n("wb205a", "WB205A Department of ISE", "floor-1", "room", { buildingSection: "L Wing 2", ambiguous: true, reviewNote: "L Wing 2 WB205A Department of ISE." }),
  n("wb206a", "WB206A Mens Washroom", "floor-1", "room", { buildingSection: "L Wing 2", ambiguous: true, reviewNote: "L Wing 2 WB206A Mens Washroom." }),
  n("wb207", "WB207", "floor-1", "room", { buildingSection: "L Wing 2", ambiguous: true, reviewNote: "L Wing 2 WB207." }),
  n("wb208", "WB208 Lecture Hall", "floor-1", "room", { buildingSection: "L Wing 2", ambiguous: true, reviewNote: "L Wing 2 WB208 Lecture Hall." }),
  n("wb214", "WB214 Faculty Room", "floor-1", "room", { buildingSection: "L Wing 2", ambiguous: true, reviewNote: "L Wing 2 WB214 Faculty Room." }),
  n("wb213ab", "WB213 A/B Laboratory", "floor-1", "room", { buildingSection: "L Wing 2", ambiguous: true, reviewNote: "L Wing 2 WB213 A/B Laboratory." }),
  n("wb212ab", "WB212 A/B Laboratory", "floor-1", "room", { buildingSection: "L Wing 2", ambiguous: true, reviewNote: "L Wing 2 WB212 A/B Laboratory." }),
  n("l-wing-1-first-floor-junction", "L Wing 1 — First-Floor Junction", "floor-1", "junction", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 first floor junction." }),
  n("l-wing-1-deans-approach", "L Wing 1 Deans Office Approach", "floor-1", "junction", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 junction 24 steps from first floor junction." }),
  n("deans-office", "Deans Office", "floor-1", "room", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 Deans Office." }),
  n("l-wing-1-second-floor", "L Wing 1 — 2nd Floor", "floor-2", "endpoint", { buildingSection: "L Wing 1", ambiguous: true, reviewNote: "L Wing 1 second floor landing." }),
  n("r111", "R111", "ground", "room", { buildingSection: "R Wing 1 Ground-Floor Labs", ambiguous: true, reviewNote: "Room anchor is not present in the current 3D location data." }),
  n("r112", "R112", "ground", "room", { buildingSection: "R Wing 1 Ground-Floor Labs", roomAnchorId: "r112", ambiguous: true, reviewNote: "Confirmed room-level anchor for the R Wing 1 ground-floor lab branch; no normalized 3D room coordinate is present in campus data." }),
  n("r113", "R113", "ground", "room", { ambiguous: true, reviewNote: "Room anchor is not present in the current 3D location data." }),
  n("ds-skill-lab", "DS Skill Lab", "ground", "room", { ambiguous: true, reviewNote: "The source names DS Skill Lab but supplies no unique 3D room anchor." }),
  n("r-wing-1-staircase", "R Wing 1 Staircase", "ground", "staircase", { ambiguous: true, reviewNote: "The source describes this staircase but supplies no unique map coordinate." }),
  n("l-wing-1-staircase", "L Wing 1 Staircase", "ground", "staircase", { ambiguous: true, reviewNote: "The source describes this staircase but supplies no unique map coordinate." }),
  n("r-wing-2-staircase", "Shared R Wing Stairs", "ground", "staircase", { ambiguous: true, reviewNote: "The source places the stairs after College Bus Parking but does not provide a unique 3D coordinate." }),
  n("r-wing-2-first-floor", "R Wing 2 — 1st Floor", "floor-1", "endpoint", { ambiguous: true, reviewNote: "The source identifies this first-floor destination but supplies no unique stair landing anchor." }),
  n("r-wing-1-first-floor", "R Wing 1 — 1st Floor", "floor-1", "endpoint", { ambiguous: true, reviewNote: "The source identifies this first-floor destination but supplies no unique stair landing anchor." }),
  n("r-wing-1-first-floor-junction", "R Wing 1 — First-Floor Junction", "floor-1", "junction", { ambiguous: true, reviewNote: "The supplied 26 steps terminate at this first-floor junction; the exact onward branch to a specific first-floor destination is not yet supplied." }),
  n("r-wing-1-staircase-direct", "R Wing 1 Direct Staircase", "ground", "staircase", { buildingSection: "R Wing 1", ambiguous: true, reviewNote: "Direct staircase from R Wing Junction to R Wing 1 first floor." }),
  n("eb204", "EB204 Faculty Room", "floor-1", "room", { buildingSection: "R Wing 1", ambiguous: true, reviewNote: "R Wing 1 EB204 Faculty Room." }),
  n("eb203", "EB203", "floor-1", "room", { buildingSection: "R Wing 1", ambiguous: true, reviewNote: "R Wing 1 EB203." }),
  n("eb202", "EB202", "floor-1", "room", { buildingSection: "R Wing 1", ambiguous: true, reviewNote: "R Wing 1 EB202." }),
  n("eb201", "EB201", "floor-1", "room", { buildingSection: "R Wing 1", ambiguous: true, reviewNote: "R Wing 1 EB201." }),
  n("eb205a", "EB205A Department of ECE", "floor-1", "room", { buildingSection: "R Wing 1", ambiguous: true, reviewNote: "R Wing 1 EB205A Department of ECE." }),
  n("eb207ab", "EB207A/B Laboratory", "floor-1", "room", { buildingSection: "R Wing 1", ambiguous: true, reviewNote: "R Wing 1 EB207A/B Laboratory." }),
  n("wb208abc", "WB208 A/B/C", "floor-1", "room", { buildingSection: "R Wing 1", ambiguous: true, reviewNote: "R Wing 1 WB208 A/B/C." }),
  n("eb212-interactive", "EB212 Interactive Learning Room", "floor-1", "room", { buildingSection: "R Wing 1", ambiguous: true, reviewNote: "R Wing 1 EB212 Interactive Learning Room." }),
  n("eb212-interactive-2", "EB212 Interactive Learning Room 2", "floor-1", "room", { buildingSection: "R Wing 1", ambiguous: true, reviewNote: "R Wing 1 EB212 Interactive Learning Room second location." }),
  n("eb209abc", "EB209 A/B/C", "floor-1", "room", { buildingSection: "R Wing 1", ambiguous: true, reviewNote: "R Wing 1 EB209 A/B/C." }),
  n("student-community-centre-1st-floor", "Student Community Centre 1st Floor Entrance", "floor-1", "location", { buildingSection: "R Wing 1", ambiguous: true, reviewNote: "R Wing 1 Student Community Centre 1st Floor Entrance." }),
  n("eb210", "EB210 Interactive Learning Room", "floor-1", "room", { buildingSection: "R Wing 1", ambiguous: true, reviewNote: "R Wing 1 EB210 Interactive Learning Room." }),
  n("eb215ab", "EB215 A/B Laboratory", "floor-1", "room", { buildingSection: "R Wing 1", ambiguous: true, reviewNote: "R Wing 1 EB215 A/B Laboratory." }),
  n("eb214ab-rwing", "EB214 A/B Laboratory", "floor-1", "room", { buildingSection: "R Wing 1", ambiguous: true, reviewNote: "R Wing 1 EB214 A/B Laboratory." }),
  n("eb213ab-rwing", "EB213 A/B Laboratory", "floor-1", "room", { buildingSection: "R Wing 1", ambiguous: true, reviewNote: "R Wing 1 EB213 A/B Laboratory." }),
  n("r-wing-1-second-floor-stairs", "R Wing 1 Second Floor Stairs", "floor-1", "staircase", { buildingSection: "R Wing 2", ambiguous: true, reviewNote: "R Wing 1 second floor stairs from R Wing 2 first floor." }),
  n("r-wing-2-deans-room", "R Wing 2 Deans Room", "floor-1", "room", { buildingSection: "R Wing 2", ambiguous: true, reviewNote: "R Wing 2 Deans Room." }),
  n("r-wing-2-deans-turn", "R Wing 2 Deans Room Turn", "floor-1", "junction", { buildingSection: "R Wing 2", ambiguous: true, reviewNote: "R Wing 2 junction after Deans Room." }),
  n("r-wing-2-deans-left-turn", "R Wing 2 Deans Room Left Turn", "floor-1", "junction", { buildingSection: "R Wing 2", ambiguous: true, reviewNote: "R Wing 2 junction 20 steps left from Deans Room." }),
  n("r-wing-2-lift-approach", "R Wing 2 Lift Approach", "floor-1", "junction", { buildingSection: "R Wing 2", ambiguous: true, reviewNote: "R Wing 2 junction 4 steps forward from Deans Room Left Turn." }),
  n("first-floor-lift", "First Floor Lift", "floor-1", "lift", { buildingSection: "R Wing 2", ambiguous: true, reviewNote: "First floor lift 4 steps left from Lift Approach." }),
  n("r-wing-2-lift-exit", "R Wing 2 Lift Exit", "floor-1", "junction", { buildingSection: "R Wing 2", ambiguous: true, reviewNote: "R Wing 2 junction 4 steps forward from First Floor Lift." }),
  n("wb211", "WB211", "floor-1", "room", { buildingSection: "R Wing 2", ambiguous: true, reviewNote: "R Wing 2 WB211." }),
  n("wb210-studio", "WB210 Studio Room", "floor-1", "room", { buildingSection: "R Wing 2", ambiguous: true, reviewNote: "R Wing 2 WB210 Studio Room." }),
  n("wb209-lecture", "WB209 Lecture Hall", "floor-1", "room", { buildingSection: "R Wing 2", ambiguous: true, reviewNote: "R Wing 2 WB209 Lecture Hall." }),
  n("wb208-lecture-rwing2", "WB208 Lecture Hall", "floor-1", "room", { buildingSection: "R Wing 2", ambiguous: true, reviewNote: "R Wing 2 WB208 Lecture Hall." }),
  n("l-wing-2-cyber-staircase", "L Wing 2 Cyber Security Department Floor 1 Staircase", "floor-1", "staircase", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("students-lounge-sitting-area", "Students Lounge Sitting Area", "floor-1", "junction", { ambiguous: true, reviewNote: "The document says sitting areas are on both sides and supplies no unique anchor." }),
  n("student-lounge", "Student Lounge", "floor-1", "location", { anchorId: "student-lounge" }),
  n("main-road-junction", "Main Road Junction", "floor-1", "junction", { ambiguous: true, reviewNote: "Named junction has no unique map coordinate in the current model." }),
  n("girls-hostel-entrance", "Girls Hostel Entrance", "floor-1", "gate", { anchorId: "girls-hostel-entrance" }),
  n("gate-2", "Gate 2", "floor-1", "gate", { anchorId: "second-gate" }),
  n("staff-lounge", "Staff Lounge", "floor-1", "location", { anchorId: "staff-lounge" }),
  n("mechanical-rd-centre", "Mechanical Engineering Research and Development Centre", "floor-1", "location", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("fluid-mechanics-lab", "Fluid Mechanics and Hydraulic Machines Laboratory", "floor-1", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("research-lab", "Research Laboratory", "floor-1", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("new-block-main-entrance", "New Block Main Entrance", "ground", "gate", { anchorId: "new-block" }),
  n("girls-hostel-endpoint", "Girls Hostel Compound View Endpoint", "ground", "endpoint", { anchorId: "girls-hostel", ambiguous: true, reviewNote: "The source describes a visible endpoint rather than a named entrance." }),
  n("new-block-lift-stair-junction", "New Block Lift/Staircase Junction", "ground", "junction", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("new-block-staircase", "New Block Staircase to Next Floor", "ground", "staircase", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n105", "N105 – Foundry and Forging Laboratory", "ground", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n101", "N101 – Energy Conservation Engineering Laboratory", "ground", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n104", "N104 – Ladies Washroom", "ground", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("drinking-water-ground", "Drinking Water Counter (New Block Ground Floor)", "ground", "location", { ambiguous: true, reviewNote: "The source names multiple drinking-water counters without unique coordinates." }),
  n("n102", "N102 – Geotechnical Engineering Laboratory", "ground", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("ground-floor-staircase", "Ground Floor Staircase", "ground", "staircase", { ambiguous: true, reviewNote: "The source does not identify one unique staircase coordinate." }),
  n("basic-science-staircase", "Department of Basic Science Staircase", "floor-1", "staircase", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("basic-science-centre", "Department of Basic Science Centre Point", "floor-1", "junction", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n208", "N208 – Classroom", "floor-1", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n214", "N214 – Staff Room 1", "floor-1", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n209", "N209 – Design Lab", "floor-1", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n213", "N213 – Classroom", "floor-1", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n210", "N210 – Heat and Mass Transfer Laboratory", "floor-1", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n211", "N211 – Department Library", "floor-1", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n201", "N201 – Classroom", "floor-1", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n207", "N207 – Skills Lab", "floor-1", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n202", "N202 – Classroom", "floor-1", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n206", "N206 – Classroom", "floor-1", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n205", "N205 – HOD of Basic Science Room", "floor-1", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n204", "N204 – Counselling Room", "floor-1", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n203", "N203 – Classroom", "floor-1", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("civil-staircase", "Department of Civil Engineering Staircase", "floor-2", "staircase", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("civil-lift-centre", "Civil Engineering Lift and Centre Point", "floor-2", "lift", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n310", "N310 – Computer-Aided Design Lab", "floor-2", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n316", "N316 – Seminar Hall", "floor-2", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n311", "N311 – Environmental Lab", "floor-2", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n315", "N315 – Conference Lounge", "floor-2", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n312", "N312 – Geology Lab", "floor-2", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n301", "N301 – Classroom", "floor-2", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n309", "N309 – Classroom", "floor-2", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n308", "N308 – Staff Room 2", "floor-2", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n307", "N307 – Staff Room 1", "floor-2", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n302", "N302 – Classroom", "floor-2", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n306", "N306 – HOD of Civil Engineering Room", "floor-2", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n305", "N305 – Ladies Washroom", "floor-2", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n304", "N304 – Gents Washroom", "floor-2", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n303", "N303 – Classroom", "floor-2", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("mba-staircase", "MBA Block Staircase", "floor-3", "staircase", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("mba-lift-centre", "MBA Lift and Centre Point", "floor-3", "lift", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n408", "N408 – Department of MCA", "floor-3", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n414", "N414 – M.Tech Classroom", "floor-3", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n413", "N413 – M.Tech Classroom", "floor-3", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n409", "N409 – Lecture Hall (Finance)", "floor-3", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n412", "N412 – Lecture Hall (Marketing)", "floor-3", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n410", "N410 – MBA", "floor-3", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n411", "N411 – MBA", "floor-3", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n407", "N407 – Staff Room", "floor-3", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n406", "N406 – HOD of MBA Room", "floor-3", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n401", "N401 – Seminar Hall", "floor-3", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n402", "N402 – MCA Lecture Hall", "floor-3", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n405", "N405 – Lecture Hall", "floor-3", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n404", "N404 – Girls Washroom", "floor-3", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("n403", "N403 – Boys Washroom", "floor-3", "room", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("terrace-staircase", "Terrace Staircase", "terrace", "staircase", { ambiguous: true, reviewNote: "The source gives a branch but no distance or map coordinate." }),
  n("xerox-medical", "Xerox and Medical Room", "ground", "location", { anchorId: "xerox", ambiguous: true, reviewNote: "The source combines Xerox and medical room; only Xerox has a current anchor." }),
  n("sports-ground-gate", "Sports Ground Gate", "ground", "gate", { ambiguous: true, reviewNote: "The current gate geometry has a visual anchor, but the PDF does not provide a normalized image coordinate." }),
  n("atm", "ATM", "ground", "location", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("hot-corns", "Hot Corns", "ground", "location", { ambiguous: true, reviewNote: "No current campus marker or unique image coordinate is supplied." }),
  n("main-canteen", "Main Canteen", "ground", "location", { anchorId: "canteen", ambiguous: true, reviewNote: "The document calls this Main Canteen; current map label is Canteen." }),
  n("canteen-gate", "Gate after Main Canteen", "ground", "gate", { ambiguous: true, reviewNote: "The source mentions a gate after the canteen but gives no separate current map anchor." }),
  n("boys-hostel", "Boys Hostel", "ground", "location", { anchorId: "boys-hostel" }),
  n("sports-ground", "Sports Ground", "ground", "location", { anchorId: "sports-ground" }),
  n("vehicle-parking", "Bike, Car and Van Parking", "ground", "location", { anchorId: "parking", ambiguous: true, reviewNote: "The source distinguishes vehicle parking from the current generic Parking marker." }),
  n("bus-stop", "Bus Stop", "ground", "location", { anchorId: "bus-stop" }),
  n("exit-gate", "Exit Gate", "ground", "gate", { ambiguous: true, reviewNote: "The source names an Exit Gate but the current map has no separate Exit Gate anchor." }),
  n("admission-section-start", "Admission Section Starts", "ground", "location", { ambiguous: true, reviewNote: "The user identifies the start of the Admission Section after Delegates Lounge but supplies no 3D anchor." }),
  n("admission-section-counters", "Admission Section Counters", "ground", "location", { ambiguous: true, reviewNote: "The user identifies the Admission Section counters but supplies no 3D anchor." }),
  n("admission-section-end", "Admission Section End", "ground", "location", { ambiguous: true, reviewNote: "The user identifies the end of the Admission Section but supplies no 3D anchor." }),
  n("teachers-punching", "Teachers Punching", "ground", "location", { ambiguous: true, reviewNote: "The user identifies Teachers Punching as a zero-step left branch; no 3D anchor is supplied." }),
  n("teacher-chamber", "Teacher Chamber", "ground", "location", { ambiguous: true, reviewNote: "The user identifies Teacher Chamber as a zero-step right branch; no 3D anchor is supplied." }),
  n("center-dome-entrance", "Center Dome Entrance / Main College Building Entrance", "ground", "location", { ambiguous: true, reviewNote: "The user combines Center Dome Entrance with Main College Building Entrance; no unique anchor is supplied." }),
  n("fountain-xerox-approach", "Decorative Fountain to Xerox Approach", "ground", "junction", { ambiguous: true, reviewNote: "The user supplies an approximate 0–24-step approach before the 12-step Xerox segment." }),
  n("route-xerox", "Xerox", "ground", "location", { anchorId: "xerox", ambiguous: true, reviewNote: "Route-document Xerox is kept separate from the combined legacy Xerox and Medical Room node." }),
  n("medical-room", "Medical Room", "ground", "location", { ambiguous: true, reviewNote: "The source writes −2 steps left to Medical Room; the sign/measurement is ambiguous and requires confirmation." }),
  n("fountain-cafeteria-turn", "Decorative Fountain Cafeteria Turn", "ground", "junction", { ambiguous: true, reviewNote: "The user identifies a 6-step right turn and zero-step left turn before Cafeteria; no 3D anchor is supplied." }),
  n("fountain-face-stage", "Decorative Fountain 24-Step Stage", "ground", "junction", { ambiguous: true, reviewNote: "The user identifies a 24-step stage before the 34-step Face Detection Junction segment; no 3D anchor is supplied." }),
  n("sitting-benches-greenery-1", "Sitting Benches with Greenery 1", "ground", "location", { ambiguous: true, reviewNote: "No current campus marker or unique map coordinate is supplied." }),
  n("sitting-benches-greenery-2", "Sitting Benches with Greenery 2", "ground", "location", { ambiguous: true, reviewNote: "No current campus marker or unique map coordinate is supplied." }),
  n("student-lawn-seating", "Student Lawn Seating", "ground", "location", { ambiguous: true, reviewNote: "No current campus marker or unique map coordinate is supplied." }),
  n("fountain-seating-branch", "Decorative Fountain Seating Branch", "ground", "junction", { ambiguous: true, reviewNote: "The user describes a 21-step branch point before Student Lawn Seating or L Wing 2; no 3D anchor is supplied." }),
  n("l-wing-2-block", "L Wing 2 Block", "ground", "location", { ambiguous: true, reviewNote: "The user identifies L Wing 2 Block but supplies no unique current 3D anchor." }),
  n("r-wing-1-laboratory-block", "R Wing 1 Laboratory Block", "ground", "location", { anchorId: "r-wing-1", buildingSection: "R Wing 1 Ground Floor", ambiguous: true, reviewNote: "The user identifies the R Wing 1 laboratory block; room-level 3D anchors are not supplied." }),
  n("eb124ab1", "EB124 A/B1 Laboratory", "ground", "room", { buildingSection: "R Wing 1 Ground Floor", ambiguous: true, reviewNote: "No unique 3D room anchor is supplied." }),
  n("eb123ab", "EB123 A/B CAD Laboratory", "ground", "room", { buildingSection: "R Wing 1 Ground Floor", ambiguous: true, reviewNote: "No unique 3D room anchor is supplied." }),
  n("eb122ab", "EB122 A/B Computer Center", "ground", "room", { buildingSection: "R Wing 1 Ground Floor", ambiguous: true, reviewNote: "No unique 3D room anchor is supplied." }),
  n("r-wing-1-lab-branch", "R Wing 1 Laboratory Branch", "ground", "junction", { ambiguous: true, reviewNote: "The user identifies the branch after EB122 for lawn/amphitheatre or the first-floor R Wing 1 path; no unique anchor is supplied." }),
  n("r-wing-1-lawn-amphitheatre", "R Wing 1 Lawn and Amphitheatre", "ground", "location", { ambiguous: true, reviewNote: "No current campus marker or unique map coordinate is supplied." }),
];

const edge = (id: string, from: string, to: string, steps: number | null, direction: RouteDirection, source: string, transition?: RouteEdge["transition"]): RouteEdge => ({ id, from, to, steps, direction, source, transition, reversible: true });

export interface MissingRouteConnection {
  edgeId: string;
  from: string;
  to: string;
  direction: RouteDirection;
  routePosition: string;
  requiredConfirmation: string;
}

export const ROUTE_EDGES: RouteEdge[] = [
  // Confirmed by the user's explicit routing instructions and supplied diagrams.
  edge("main-admission", "main-gate", "enquiry-office", 10, "straight", "user-confirm"),
  edge("main-bus-parking", "main-gate", "college-bus-parking", 35, "straight", "user-confirm"),
  edge("admission-bus-parking", "enquiry-office", "college-bus-parking", 30, "straight", "user-confirm"),
  edge("admission-face-straight-20", "enquiry-office", "admission-face-turn", 20, "straight", "user-confirm"),
  edge("admission-face-right-15", "admission-face-turn", "face-detection", 15, "right", "user-confirm"),
  edge("face-detection-junction", "face-detection", "face-detection-junction", 26, "straight", "user-confirm"),
  // The confirmed left branch begins R Wing 2 Ground Floor immediately at the junction.
  edge("junction-r-wing-2", "face-detection-junction", "r-wing-2", 0, "left", "user-confirm"),
  edge("r-wing-2-r101", "r-wing-2", "r101", 5, "left", "user-confirm"),
  edge("r101-r102", "r101", "r102", 19, "straight", "user-confirm"),
  edge("r102-r103", "r102", "r103", 19, "straight", "user-confirm"),
  edge("r103-r104-ds-staffroom", "r103", "r104-ds-staffroom", 19, "straight", "user-confirm"),
  edge("r104-r-wing-junction", "r104-ds-staffroom", "r-wing-junction", 8, "straight", "user-confirm"),
  edge("r-wing-junction-eb105a", "r-wing-junction", "eb105a", 9, "straight", "user-confirm"),
  edge("eb105a-boys-washroom", "eb105a", "boys-washroom", 9, "straight", "user-confirm"),
  edge("boys-washroom-eb107ab", "boys-washroom", "eb107ab", 11, "straight", "user-confirm"),
  edge("eb107ab-eb120", "eb107ab", "eb120-student-community-centre", 6, "straight", "user-confirm"),
  edge("eb107ab-student-community-centre-main-area", "eb107ab", "student-community-centre-main-area", 44, "right", "user-confirm"),
  edge("eb120-eb108ab", "eb120-student-community-centre", "eb108ab", 7, "straight", "user-confirm"),
  edge("eb108ab-eb109", "eb108ab", "eb109-project-room", 8, "right", "user-confirm"),
  edge("eb109-eb110", "eb109-project-room", "eb110-controller-office", 19, "straight", "user-confirm"),
  edge("eb110-eb111", "eb110-controller-office", "eb111-controller-office", 18, "straight", "user-confirm"),
  edge("eb111-eb112", "eb111-controller-office", "eb112-interactive-learning-room", 7, "straight", "user-confirm"),
  edge("eb112-student-community-centre-main-area", "eb112-interactive-learning-room", "student-community-centre-main-area", 13, "left", "user-confirm"),
  edge("r-wing-junction-college-bus-parking", "r-wing-junction", "college-bus-parking", 12, "left", "user-confirm"),
  edge("college-bus-parking-r-wing-stairs", "college-bus-parking", "r-wing-2-staircase", 12, "right", "user-confirm", "staircase"),
  edge("r-wing-stairs-r-wing-1-first-floor-junction", "r-wing-2-staircase", "r-wing-1-first-floor-junction", 26, "forward", "user-confirm", "staircase"),
  edge("r-wing-junction-r112", "r-wing-junction", "r112", 5, "right", "user-confirm"),
  edge("r112-r111", "r112", "r111", 20, "straight", "user-confirm"),
  edge("r111-ds-skill-lab", "r111", "ds-skill-lab", 20, "straight", "user-confirm"),
  edge("ds-skill-lab-r-wing-1-staircase", "ds-skill-lab", "r-wing-1-staircase", 16, "straight", "user-confirm", "staircase"),
  edge("r-wing-junction-r105", "r-wing-junction", "r105-boys-washroom", 10, "straight", "user-confirm"),
  edge("r105-r106", "r105-boys-washroom", "r106-ds-hod", 4, "straight", "user-confirm"),
  edge("r106-r107", "r106-ds-hod", "r107-ade-lab", 8, "straight", "user-confirm"),
  edge("junction-amphitheatre", "face-detection-junction", "amphitheatre", 63, "straight", "user-confirm"),
  edge("junction-cafeteria-entrance-2", "face-detection-junction", "cafeteria-entrance-2", 10, "right", "user-confirm"),
  edge("junction-face-detection-stage", "face-detection-junction", "face-detection-stage", 2, "straight", "user-confirm"),
  edge("stage-cafeteria-entrance-1", "face-detection-stage", "cafeteria-entrance-1", 2, "forward", "user-confirm"),
  edge("cafeteria-entrance-1-junction-right", "cafeteria-entrance-1", "cafeteria-entrance-1-junction", 4, "right", "user-confirm"),
  edge("cafeteria-junction-xerox", "cafeteria-entrance-1-junction", "route-xerox", 15, "right", "user-confirm"),
  edge("cafeteria-junction-fountain", "cafeteria-entrance-1-junction", "decorative-fountain", 4, "left", "user-confirm"),
  edge("cafeteria-entrance-8-right", "cafeteria-entrance-route", "cafeteria-route", 8, "right", "user-confirm"),
  edge("cafeteria-68", "cafeteria-route", "cafeteria-crossing", 68, "straight", "user-confirm"),
  edge("cafeteria-to-amphitheatre-5-left", "cafeteria-crossing", "amphitheatre-63-end", 5, "left", "user-confirm"),
  edge("student-centre-main-delegates-approach", "student-community-centre-main-area", "delegates-lounge-approach", 13, "straight", "user-confirm"),
  edge("delegates-approach-delegates-zero-right", "delegates-lounge-approach", "delegates-lounge-principal-chamber", 0, "right", "user-confirm"),
  edge("delegates-admission-start-zero", "delegates-lounge-principal-chamber", "admission-section-start", 2, "straight", "user-confirm"),
  edge("admission-start-counters", "admission-section-start", "admission-section-counters", 18, "straight", "user-confirm"),
  edge("admission-counters-center-dome", "admission-section-counters", "center-dome", 0, "right", "user-confirm"),
  edge("admission-counters-end", "admission-section-counters", "admission-section-end", 18, "straight", "user-confirm"),
  edge("admission-end-teachers-punching", "admission-section-end", "teachers-punching", 0, "left", "user-confirm"),
  edge("admission-end-teacher-chamber", "admission-section-end", "teacher-chamber", 0, "right", "user-confirm"),
  edge("admission-end-library-lift", "admission-section-end", "lift-library", 2, "straight", "user-confirm"),
  edge("center-dome-l-wing-1", "center-dome", "l-wing-1", 0, "left", "user-confirm"),
  edge("l-wing-1-wb110", "l-wing-1", "wb110", 5, "left", "user-confirm"),
  edge("wb110-wb111", "wb110", "wb111", 18, "forward", "user-confirm"),
  edge("wb111-wb112", "wb111", "wb112", 18, "forward", "user-confirm"),
  edge("wb112-student-resting", "wb112", "student-resting-area", 11, "right", "user-confirm"),
  edge("wb112-l-wing-junction", "wb112", "l-wing-junction", 16, "straight", "user-confirm"),
  edge("l-wing-junction-wb105a", "l-wing-junction", "wb105a", 5, "left", "user-confirm"),
  edge("wb105a-girls-washroom", "wb105a", "l-wing-girls-washroom", 5, "forward", "user-confirm"),
  edge("girls-washroom-drinking-water", "l-wing-girls-washroom", "l-wing-drinking-water", 3, "forward", "user-confirm"),
  edge("drinking-water-wb107", "l-wing-drinking-water", "wb107", 6, "right", "user-confirm"),
  edge("drinking-water-library-entrance-2", "l-wing-drinking-water", "library-entrance-2", 6, "left", "user-confirm"),
  edge("library-entrance-2-wb108", "library-entrance-2", "wb108", 4, "forward", "user-confirm"),
  edge("l-wing-junction-staircase", "l-wing-junction", "l-wing-1-staircase", 2, "straight", "user-confirm", "staircase"),
  edge("l-wing-staircase-first-floor", "l-wing-1-staircase", "l-wing-1-first-floor", 0, "forward", "user-confirm", "staircase"),
  edge("l-wing-first-floor-wb204", "l-wing-1-first-floor", "wb204", 10, "left", "user-confirm"),
  edge("wb204-wb203", "wb204", "wb203", 18, "forward", "user-confirm"),
  edge("wb203-wb202", "wb203", "wb202", 18, "forward", "user-confirm"),
  edge("wb202-wb201", "wb202", "wb201", 18, "forward", "user-confirm"),
  edge("center-dome-r-wing-1", "center-dome", "r-wing-1", 0, "right", "user-confirm"),
  edge("center-dome-entrance", "center-dome", "center-dome-entrance", 2, "straight", "user-confirm"),
  edge("center-dome-entrance-fountain", "center-dome-entrance", "decorative-fountain", 40, "straight", "user-confirm"),
  edge("fountain-xerox-approach", "decorative-fountain", "fountain-xerox-approach", 24, "straight", "user-confirm"),
  edge("fountain-approach-xerox", "fountain-xerox-approach", "route-xerox", 12, "straight", "user-confirm"),
  edge("fountain-approach-medical", "fountain-xerox-approach", "medical-room", 4, "left", "user-confirm"),
  edge("fountain-cafeteria-right", "decorative-fountain", "fountain-cafeteria-turn", 6, "right", "user-confirm"),
  edge("fountain-turn-cafeteria", "fountain-cafeteria-turn", "cafeteria-route", 0, "left", "user-confirm"),
  edge("fountain-face-stage", "decorative-fountain", "fountain-face-stage", 24, "straight", "user-confirm"),
  edge("fountain-stage-face-junction", "fountain-face-stage", "face-detection-junction", 34, "straight", "user-confirm"),
  edge("fountain-greenery-1", "decorative-fountain", "sitting-benches-greenery-1", 30, "left", "user-confirm"),
  edge("greenery-1-greenery-2", "sitting-benches-greenery-1", "sitting-benches-greenery-2", 15, "straight", "user-confirm"),
  edge("greenery-2-seating-branch", "sitting-benches-greenery-2", "fountain-seating-branch", 21, "straight", "user-confirm"),
  edge("seating-branch-student-lawn", "fountain-seating-branch", "student-lawn-seating", 2, "left", "user-confirm"),
  edge("seating-branch-l-wing-2-approach", "fountain-seating-branch", "l-wing-2-block", 6, "straight", "user-confirm"),
  edge("l-wing-2-approach-block", "l-wing-2-block", "l-wing-2-cyber-staircase", 0, "left", "user-confirm"),
  edge("l-wing-2-cyber-staircase-first-floor", "l-wing-2-cyber-staircase", "l-wing-2-first-floor", 0, "forward", "user-confirm", "staircase"),
  edge("l-wing-2-first-floor-wb205a", "l-wing-2-first-floor", "wb205a", 10, "right", "user-confirm"),
  edge("wb205a-wb206a", "wb205a", "wb206a", 6, "forward", "user-confirm"),
  edge("wb206a-wb207", "wb206a", "wb207", 10, "forward", "user-confirm"),
  edge("wb207-wb208", "wb207", "wb208", 14, "straight", "user-confirm"),
  edge("l-wing-2-first-floor-wb214", "l-wing-2-first-floor", "wb214", 18, "straight", "user-confirm"),
  edge("wb214-wb213ab", "wb214", "wb213ab", 18, "forward", "user-confirm"),
  edge("wb213ab-wb212ab", "wb213ab", "wb212ab", 18, "forward", "user-confirm"),
  edge("wb212ab-l-wing-1-junction", "wb212ab", "l-wing-1-first-floor-junction", 6, "forward", "user-confirm"),
  edge("l-wing-1-junction-deans-approach", "l-wing-1-first-floor-junction", "l-wing-1-deans-approach", 24, "right", "user-confirm"),
  edge("deans-approach-deans-office", "l-wing-1-deans-approach", "deans-office", 20, "left", "user-confirm"),
  edge("l-wing-1-junction-staircase", "l-wing-1-first-floor-junction", "l-wing-1-staircase", 3, "left", "user-confirm"),
  edge("l-wing-1-staircase-ground-floor", "l-wing-1-staircase", "l-wing-1", 0, "forward", "user-confirm", "staircase"),
  edge("l-wing-1-staircase-second-floor", "l-wing-1-staircase", "l-wing-1-second-floor", 0, "forward", "user-confirm", "staircase"),
  edge("r-wing-junction-r-wing-1-block-zero", "r-wing-junction", "r-wing-1-laboratory-block", 0, "right", "user-confirm"),
  edge("r-wing-junction-direct-staircase", "r-wing-junction", "r-wing-1-staircase-direct", 25, "left", "user-confirm", "staircase"),
  edge("r-wing-1-direct-staircase-first-floor", "r-wing-1-staircase-direct", "r-wing-1-first-floor", 0, "forward", "user-confirm", "staircase"),
  edge("r-wing-1-first-floor-eb204", "r-wing-1-first-floor", "eb204", 10, "left", "user-confirm"),
  edge("eb204-eb203", "eb204", "eb203", 18, "forward", "user-confirm"),
  edge("eb203-eb202", "eb203", "eb202", 18, "forward", "user-confirm"),
  edge("eb202-eb201", "eb202", "eb201", 18, "forward", "user-confirm"),
  edge("r-wing-1-first-floor-eb205a", "r-wing-1-first-floor", "eb205a", 8, "right", "user-confirm"),
  edge("eb205a-eb207ab", "eb205a", "eb207ab", 10, "forward", "user-confirm"),
  edge("eb207ab-wb208abc", "eb207ab", "wb208abc", 13, "forward", "user-confirm"),
  edge("wb208abc-eb212-interactive", "wb208abc", "eb212-interactive", 6, "right", "user-confirm"),
  edge("eb212-interactive-eb212-2", "eb212-interactive", "eb212-interactive-2", 8, "forward", "user-confirm"),
  edge("eb212-2-eb209abc", "eb212-interactive-2", "eb209abc", 17, "left", "user-confirm"),
  edge("eb212-2-student-community-1st", "eb212-interactive-2", "student-community-centre-1st-floor", 17, "right", "user-confirm"),
  edge("eb212-2-eb210", "eb212-interactive-2", "eb210", 18, "forward", "user-confirm"),
  edge("r-wing-2-first-floor-eb215ab", "r-wing-2-first-floor", "eb215ab", 8, "straight", "user-confirm"),
  edge("eb215ab-eb214ab-rwing", "eb215ab", "eb214ab-rwing", 18, "forward", "user-confirm"),
  edge("eb214ab-rwing-eb213ab-rwing", "eb214ab-rwing", "eb213ab-rwing", 18, "forward", "user-confirm"),
  edge("eb213ab-rwing-r-wing-2-first-floor", "eb213ab-rwing", "r-wing-2-first-floor", 18, "forward", "user-confirm"),
  edge("r-wing-2-first-floor-l-wing-1", "r-wing-2-first-floor", "l-wing-1", 4, "right", "user-confirm"),
  edge("r-wing-2-first-floor-center-dome", "r-wing-2-first-floor", "center-dome", 4, "right", "user-confirm"),
  edge("r-wing-2-first-floor-r-wing-1-second-floor-stairs", "r-wing-2-first-floor", "r-wing-1-second-floor-stairs", 4, "right", "user-confirm", "staircase"),
  edge("r-wing-2-first-floor-eb210", "r-wing-2-first-floor", "eb210", 24, "left", "user-confirm"),
  edge("r-wing-2-eb210-deans-room", "eb210", "r-wing-2-deans-room", 20, "forward", "user-confirm"),
  edge("r-wing-2-deans-room-turn", "r-wing-2-deans-room", "r-wing-2-deans-turn", 20, "forward", "user-confirm"),
  edge("r-wing-2-deans-turn-l-wing-1-junction", "r-wing-2-deans-turn", "l-wing-1-first-floor-junction", 24, "right", "user-confirm"),
  edge("r-wing-2-deans-room-left-turn", "r-wing-2-deans-room", "r-wing-2-deans-left-turn", 20, "left", "user-confirm"),
  edge("r-wing-2-deans-left-turn-lift-approach", "r-wing-2-deans-left-turn", "r-wing-2-lift-approach", 4, "forward", "user-confirm"),
  edge("r-wing-2-lift-approach-first-floor-lift", "r-wing-2-lift-approach", "first-floor-lift", 4, "left", "user-confirm"),
  edge("first-floor-lift-lift-exit", "first-floor-lift", "r-wing-2-lift-exit", 4, "forward", "user-confirm"),
  edge("r-wing-2-lift-exit-wb211", "r-wing-2-lift-exit", "wb211", 4, "forward", "user-confirm"),
  edge("wb211-wb210-studio", "wb211", "wb210-studio", 18, "right", "user-confirm"),
  edge("wb210-studio-wb209-lecture", "wb210-studio", "wb209-lecture", 18, "forward", "user-confirm"),
  edge("wb209-lecture-wb208-lecture-rwing2", "wb209-lecture", "wb208-lecture-rwing2", 18, "forward", "user-confirm"),
  edge("r-wing-1-block-eb124ab1", "r-wing-1-laboratory-block", "eb124ab1", 6, "straight", "user-confirm"),
  edge("eb124ab1-eb123ab", "eb124ab1", "eb123ab", 18, "straight", "user-confirm"),
  edge("eb123ab-eb122ab", "eb123ab", "eb122ab", 18, "straight", "user-confirm"),
  edge("eb122ab-lab-branch", "eb122ab", "r-wing-1-lab-branch", 12, "straight", "user-confirm"),
  edge("lab-branch-lawn-amphitheatre", "r-wing-1-lab-branch", "r-wing-1-lawn-amphitheatre", 5, "forward", "user-confirm"),
  edge("lab-branch-center-dome", "r-wing-1-lab-branch", "center-dome", 2, "forward", "user-confirm"),
  edge("lab-branch-first-floor", "r-wing-1-lab-branch", "r-wing-1-first-floor", 5, "straight", "user-confirm-alternative"),
];

const missingConnectionDetails: Record<string, Pick<MissingRouteConnection, "routePosition" | "requiredConfirmation">> = {};

export const MISSING_ROUTE_CONNECTIONS: MissingRouteConnection[] = ROUTE_EDGES
  .filter((routeEdge) => routeEdge.steps === null)
  .map((routeEdge) => ({
    edgeId: routeEdge.id,
    from: routeEdge.from,
    to: routeEdge.to,
    direction: routeEdge.direction,
    routePosition: missingConnectionDetails[routeEdge.id]?.routePosition ?? "Declared route edge with no supplied measurement",
    requiredConfirmation: missingConnectionDetails[routeEdge.id]?.requiredConfirmation ?? "Walking steps and endpoint identity",
  }));

const NODE_BY_ID = new Map(ROUTE_NODES.map((node) => [node.id, node]));
const EDGES_BY_NODE = new Map<string, RouteEdge[]>();
for (const routeEdge of ROUTE_EDGES) {
  const listFrom = EDGES_BY_NODE.get(routeEdge.from) ?? [];
  listFrom.push(routeEdge);
  EDGES_BY_NODE.set(routeEdge.from, listFrom);
  if (routeEdge.reversible) {
    const listTo = EDGES_BY_NODE.get(routeEdge.to) ?? [];
    listTo.push({ ...routeEdge, id: `${routeEdge.id}-reverse`, from: routeEdge.to, to: routeEdge.from });
    EDGES_BY_NODE.set(routeEdge.to, listTo);
  }
}

export function getRouteNode(id: string): RouteNode | undefined {
  return NODE_BY_ID.get(id);
}

/**
 * Resolves spoken room names to existing graph node IDs without changing the graph.
 * Supports the renamed EB rooms, spaced speech such as “E B 104”, and room-name phrases.
 */
const normalizeSpokenLocation = (value: string) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim()
  .replace(/\be\s+b\s*(10[1-4])\b/g, "eb$1");

const SPOKEN_LOCATION_ALIASES: Array<{ phrases: string[]; nodeId: string }> = [
  { phrases: ["eb104", "eb104 ds faculty room", "ds faculty room", "ds faculty"], nodeId: "r104-ds-staffroom" },
  { phrases: ["eb103", "eb103 studio room"], nodeId: "r103" },
  { phrases: ["eb102", "eb102 studio room"], nodeId: "r102" },
  { phrases: ["eb101", "eb101 studio room"], nodeId: "r101" },
];

export const resolveRouteNodeFromSpokenQuery = (query: string): RouteNode | undefined => {
  const normalized = normalizeSpokenLocation(query);
  const alias = SPOKEN_LOCATION_ALIASES
    .flatMap(({ phrases, nodeId }) => phrases.map((phrase) => ({ phrase, nodeId })))
    .sort((a, b) => b.phrase.length - a.phrase.length)
    .find(({ phrase }) => normalized.includes(normalizeSpokenLocation(phrase)));
  if (alias) return NODE_BY_ID.get(alias.nodeId);

  return ROUTE_NODES.find((node) => normalized.includes(normalizeSpokenLocation(node.label)));
};

export interface NormalizedCampusPoint {
  x: number;
  y: number;
}

export const getAnchoredRouteNodes = () => ROUTE_NODES.filter((node) => Boolean(node.anchorId));

/**
 * Projects a calculated route onto confirmed visible main anchors for 3D display.
 * Internal-room projections use only explicit buildingSection metadata; no coordinate
 * or parent relationship is inferred for otherwise unanchored nodes.
 */
export const getMainAnchorRouteNodeId = (nodeId: string): string | null => {
  const node = NODE_BY_ID.get(nodeId);
  if (!node) return null;
  if (node.mainAnchorId) return node.mainAnchorId;
  if (node.kind === "room" || node.roomAnchorId) {
    if (node.buildingSection === "R Wing 2 Ground Floor") return "r-wing-2";
    if (node.buildingSection === "R Wing 1 Ground-Floor Labs") return "r-wing-1";
    return null;
  }
  return node.anchorId ? node.id : null;
};

export const projectRouteToMainAnchors = (nodeIds: string[]): string[] => {
  const projected: string[] = [];
  for (const nodeId of nodeIds) {
    const anchorNodeId = getMainAnchorRouteNodeId(nodeId);
    if (anchorNodeId && projected[projected.length - 1] !== anchorNodeId) projected.push(anchorNodeId);
  }
  return projected;
};

export const getTextRouteSequence = (startId: string, endId: string, nodeIds: string[]): string[] => {
  const anchors = projectRouteToMainAnchors(nodeIds);
  const startParent = getMainAnchorRouteNodeId(startId);
  const sequence: string[] = [startId];
  if (startParent && startParent !== startId) sequence.push(startParent);
  for (const anchorNodeId of anchors) {
    if (sequence[sequence.length - 1] !== anchorNodeId) sequence.push(anchorNodeId);
  }
  if (sequence[sequence.length - 1] !== endId) sequence.push(endId);
  return sequence;
};

/**
 * Calculates the visible route between parent/main anchors while keeping the
 * exact selected internal locations available for the text sequence.
 */
export const findShortestRouteUsingMainAnchors = (startId: string, endId: string): ShortestRoute | null => {
  const visibleStart = getMainAnchorRouteNodeId(startId) ?? startId;
  const visibleEnd = getMainAnchorRouteNodeId(endId) ?? endId;
  return findShortestRoute(visibleStart, visibleEnd);
};

export const nearestAnchoredRouteNode = (
  point: NormalizedCampusPoint,
  resolveAnchor: (anchorId: string) => NormalizedCampusPoint | null,
) => {
  let nearest: { node: RouteNode; distance: number } | null = null;
  for (const node of getAnchoredRouteNodes()) {
    if (!node.anchorId) continue;
    const anchor = resolveAnchor(node.anchorId);
    if (!anchor) continue;
    const distance = Math.hypot(anchor.x - point.x, anchor.y - point.y);
    if (!nearest || distance < nearest.distance) nearest = { node, distance };
  }
  return nearest;
};

export function findShortestRoute(startId: string, endId: string): ShortestRoute | null {
  if (!NODE_BY_ID.has(startId) || !NODE_BY_ID.has(endId)) return null;
  const distances = new Map<string, number>();
  const previous = new Map<string, { nodeId: string; edge: RouteEdge }>();
  const unvisited = new Set(ROUTE_NODES.map((node) => node.id));
  for (const node of ROUTE_NODES) distances.set(node.id, Number.POSITIVE_INFINITY);
  distances.set(startId, 0);

  while (unvisited.size > 0) {
    let current: string | undefined;
    let best = Number.POSITIVE_INFINITY;
    for (const candidate of Array.from(unvisited)) {
      const distance = distances.get(candidate) ?? Number.POSITIVE_INFINITY;
      if (distance < best) {
        best = distance;
        current = candidate;
      }
    }
    if (!current || best === Number.POSITIVE_INFINITY) break;
    unvisited.delete(current);
    if (current === endId) break;

    for (const routeEdge of EDGES_BY_NODE.get(current) ?? []) {
      if (!unvisited.has(routeEdge.to) || routeEdge.steps === null) continue;
      const candidateDistance = best + routeEdge.steps;
      if (candidateDistance < (distances.get(routeEdge.to) ?? Number.POSITIVE_INFINITY)) {
        distances.set(routeEdge.to, candidateDistance);
        previous.set(routeEdge.to, { nodeId: current, edge: routeEdge });
      }
    }
  }

  if (!previous.has(endId) && startId !== endId) return null;
  const nodeIds: string[] = [endId];
  const edges: RouteEdge[] = [];
  let cursor = endId;
  while (cursor !== startId) {
    const step = previous.get(cursor);
    if (!step) return null;
    edges.unshift(step.edge);
    nodeIds.unshift(step.nodeId);
    cursor = step.nodeId;
  }

  const reviewFlags = nodeIds
    .map((id) => NODE_BY_ID.get(id))
    .filter((node): node is RouteNode => Boolean(node?.ambiguous))
    .map((node) => `${node.label}: ${node.reviewNote ?? "Source wording requires review."}`);

  const directions = edges.map((routeEdge, index) => {
    const from = NODE_BY_ID.get(routeEdge.from)?.label ?? routeEdge.from;
    const to = NODE_BY_ID.get(routeEdge.to)?.label ?? routeEdge.to;
    const transition = routeEdge.transition ? ` via ${routeEdge.transition}` : "";
    return `${index + 1}. From ${from}, move ${routeEdge.steps ?? "an unstated distance"} steps ${routeEdge.direction}${transition} to reach ${to}. [${routeEdge.source}]`;
  });

  return {
    nodeIds,
    edges,
    totalSteps: distances.get(endId) ?? 0,
    directions,
    reviewFlags,
  };
}

export const ROUTE_SOURCE_SUMMARY = "Routes and step weights transcribed only from the user's supplied routing diagrams and confirmations; ambiguous names, unnamed junctions, missing branch weights, ranges, negative-step wording, and missing 3D anchors are flagged rather than inferred. The later user-confirm Amphitheatre/Cafeteria section supersedes the earlier courtyard 65/50 interpretation.";
