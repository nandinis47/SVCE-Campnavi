# Routing Source Findings

## Authoritative source

Source: `/home/ubuntu/upload/route.pdf`, 18 pages. The document is the sole authority for route topology, step counts, directions, gates, stairs, lifts, floor transitions, and named rooms.

## Explicit route families captured

The source describes a ground-floor route from Main Gate through the Enquiry Office, Face Detection area, R Wing 2, R Wing 1, Center Dome, cafeteria entrances, student community/meeting/principal areas, parking, bus stop, Girls Hostel Entrance, Gate 2, Student Lounge, Staff Lounge, New Block, and Sports Ground Gate. It also describes connected room sequences for R Wing 2, R Wing 1, L Wing 2, L Wing 1, ECE, and multiple lab/classroom corridors.

The source explicitly documents floor transitions through staircases and lifts, including R Wing 1/R Wing 2 first-floor access, ISE/CSE transitions, New Block lift/staircase junction, First Floor Department of Basic Science, Second Floor Department of Civil Engineering, and Third Floor MBA Block. It gives 27-step staircase transitions between several floors and explicit lift/staircase junctions.

Pages 8–10 provide a structured Left Wing 2 to New Block route: L Wing 2 Cyber Security Department Floor 1 Staircase → Students Lounge Sitting Area (7 straight) → Student Lounge (5 straight) → Main Road Junction (5 straight) → Girls Hostel Entrance (60 right) → Gate 2 (8 straight), and Main Road Junction → Staff Lounge (15 left) → Mechanical R&D Centre (19 right) → Fluid Mechanics/Hydraulic Machines Laboratory (27 straight) → Research Laboratory (19 straight) → New Block Main Entrance (10 straight) → endpoint/Girls Hostel compound view (65 straight). New Block Main Entrance → Lift/Staircase Junction is 20 straight; Lift/Staircase Junction → N105 is 24 left; N105 → N101 is 11 straight; N101 → N104 is 10 straight; N104 → Drinking Water Counter is 1 forward; N104 area → N102 is 5 straight.

Pages 10–13 document Basic Science, Civil Engineering, and floor transitions. Explicit sequences include Ground Floor staircase → next-floor staircase (6 straight) → Department of Basic Science (27 up) → centre point (6 straight); Basic Science centre → left route N208 (10 left), N209 (20 straight), N210 (20 straight), N211/Mechanical HOD area (8 straight); centre → right route N201 (16 right), N207 (5 right), N202 (12 straight), N206 (5 straight), N205 (5 straight), N204/N203 junction (6 straight); centre → second-floor staircase (3). Second Floor route begins with 27 steps up, then 6 straight to Lift and Centre Point; left route N310 (11 left), N311 (27 straight), N312/library/skill-lab junction (20 straight); right route N301/N309 (17 right), N308 (11 straight), N307/N302 (6 straight), N306 (7 straight), N305 (6 straight), Drinking Water Counter (1 forward), N304/N303 (7 straight).

Pages 13–18 document the Third Floor MBA block: Second Floor → MBA Block via 27 steps up → Lift and Centre Point via 6 straight; left route N408/N414 (13 left), N413 (14 straight), N409/N412 (14 straight), N410/N411 (17 straight); right route N407 (12 right), N406 (12 straight), N401 (10 straight), N402/N405 (6 straight), N404 (6 straight), Drinking Water Counter (1 forward), N403 (6 straight); terrace staircase branches left from the MBA staircase.

The final campus-wide passage gives an additional route sequence: New Block outside → left 65 steps with Mechanical Department and Staff Lounge along the way → Staff Lounge → 15 left to Student Lounge → 60 straight to Girls Hostel Entrance → 6 steps to Gate 2 → right 8 to Student Lounge Sitting Area → 10 right to L Wing 2 → courtyard/sitting area → 15 to benches → 30 to Xerox/medical room → 23 left to Cafeteria → 25 to Amphitheatre → 38 straight to courtyard → 7 forward to R Wing / cafeteria entrance → 20 straight to Face Detection → 10 to Ganesha statue → College Bus Parking → 8 left to Enquiry Block → 10 to Exit Gate → 85 left to Bus Stop → 18 across road to Sports Ground Gate → Sports Ground Gate branches left 17 to ATM, then Hot Corns, then 18 to Main Canteen; Main Canteen → right to a gate (6 steps) → 125 to Boys Hostel → 35 to Sports Ground; Sports Ground Gate → 64 to vehicle parking → 5 to Bus Stop.

## Ambiguities that must remain flagged

The document uses inconsistent names and spellings, including “Students Lounge” versus “Student Lounge,” “Staff Lounge” appearing in multiple contexts, “Main Gate” versus “Exit Gate,” “Cafetaria” versus “Cafeteria,” and unnamed junctions such as “main corridor point,” “centre point,” and “from here.” Several side-of-corridor landmarks are described without a unique node-to-node edge or exact coordinate. The document sometimes omits the starting node for a sequence, repeats room names with conflicting labels (for example duplicated R314/L313 references), and gives directional prose without a complete geometric bearing.

The PDF provides step distances but not exact image coordinates for most rooms, labs, junctions, staircases, lifts, or unnamed corridors. Those nodes can be included in the weighted graph for computation, but their 3D highlight positions must be flagged as unresolved rather than guessed. Only existing campus locations with known normalized coordinates may be anchored visually without further user input.

## Implementation constraint

Implement only edges explicitly supported by the document. Preserve direction words and floor-transition metadata on edges. Do not synthesize shortcut edges, inferred distances, or guessed 3D positions. Surface unresolved node anchors and ambiguous source statements in the UI for review.
