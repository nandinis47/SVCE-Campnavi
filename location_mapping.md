# Location Mapping from Numbered Drone Image

The numbered image is 674x522 pixels. Converting circle center positions to normalized (0-1) coordinates.

Image dimensions: 674 wide, 522 tall

## Position Analysis (approximate pixel centers of numbered circles):

1 - Main Gate: bottom-left area, near entrance road → approx x:0.06, y:0.50
2 - Enquiry Office: just right of gate → approx x:0.14, y:0.52
3 - College Bus Parking: upper-left area → approx x:0.09, y:0.38
4 - R Wing 1: center-upper area → approx x:0.19, y:0.35
5 - (top row): approx x:0.27, y:0.12
6 - Center Dome: top-center → approx x:0.35, y:0.10
7 - L Wing 1: top-center-right → approx x:0.45, y:0.10
8 - (center): approx x:0.52, y:0.35
9 - Student/Staff Lounge: upper-right → approx x:0.60, y:0.13
10 - New Block: top-right corner → approx x:0.78, y:0.08
11 - 2nd Gate: right-center area → approx x:0.68, y:0.48
12 - Girls Hostel Entrance: center-right → approx x:0.68, y:0.33
13 - Girls Hostel: far right edge → approx x:0.92, y:0.20
14 - Amphitheater: center area → approx x:0.26, y:0.38
15 - Cafeteria: center-left → approx x:0.17, y:0.50
16 - Xerox: center → approx x:0.28, y:0.43
17 - Canteen: lower-center → approx x:0.26, y:0.70
18 - Parking: center → approx x:0.45, y:0.70
19 - Bus Stop: center-right → approx x:0.48, y:0.55
20 - Sports Ground Entrance: lower-left → approx x:0.22, y:0.60
21 - Boys Hostel: bottom-center-left → approx x:0.30, y:0.82
22 - Sports Ground: bottom-center → approx x:0.32, y:0.93
23 - Basketball: bottom-center-right → approx x:0.48, y:0.88

## Cross-referencing with original drone image (1536x1136):
The numbered image is a zoomed/cropped version of the original. Need to estimate positions relative to the full drone image.

Looking at the full drone image layout:
- The numbered image shows the upper portion (campus buildings) prominently
- The campus buildings are in the top half of the drone image
- Parking area is in the center of the drone image
- Sports ground and track are at the bottom of the drone image

## Adjusted normalized coordinates for FULL drone image (1536x1136):
These positions should map to the original drone image texture.
