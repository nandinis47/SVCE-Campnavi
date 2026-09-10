// Design: Satellite Explorer — drone image as 3D ground plane
// Coordinates are normalized (0-1) relative to the drone image (1536x1136)
// x: left-to-right, y: top-to-bottom (image space)
// Based on user's numbered drone image (23 locations)

export interface CampusLocation {
  id: string;
  name: string;
  number: number; // the number from the drone image
  category: "academic" | "administrative" | "sports" | "service" | "nature" | "parking" | "hostel";
  description: string;
  x: number; // normalized 0-1 (left to right)
  y: number; // normalized 0-1 (top to bottom)
  icon: string; // lucide icon name
}

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  // === ENTRANCE & ADMIN AREA (bottom-left to center) ===
  {
    id: "main-gate",
    name: "Main Gate",
    number: 1,
    category: "service",
    description: "Primary entry point to the campus with security checkpoint",
    x: 0.13,
    y: 0.35,
    icon: "DoorOpen",
  },
  {
    id: "enquiry-office",
    name: "Enquiry Office",
    number: 2,
    category: "administrative",
    description: "Admissions and general enquiry office near the main gate",
    x: 0.16,
    y: 0.32,
    icon: "Phone",
  },
  {
    id: "college-bus-parking",
    name: "College Bus Parking",
    number: 3,
    category: "parking",
    description: "Designated parking area for college buses",
    x: 0.10,
    y: 0.18,
    icon: "Bus",
  },

  // === ACADEMIC BLOCKS (top area) ===
  {
    id: "r-wing-1",
    name: "R Wing 1 (Classrooms)",
    number: 4,
    category: "academic",
    description: "Right wing classroom block — teaching and lecture rooms",
    x: 0.26,
    y: 0.08,
    icon: "GraduationCap",
  },
  {
    id: "r-wing-2",
    name: "R Wing 2 (Classrooms)",
    number: 5,
    category: "academic",
    description: "Right wing classroom block — additional teaching spaces",
    x: 0.21,
    y: 0.14,
    icon: "GraduationCap",
  },
  {
    id: "center-dome",
    name: "Center Dome",
    number: 6,
    category: "academic",
    description: "Central dome structure — landmark building of the campus",
    x: 0.35,
    y: 0.07,
    icon: "Landmark",
  },
  {
    id: "l-wing-1",
    name: "L Wing 1 (Classrooms)",
    number: 7,
    category: "academic",
    description: "Left wing classroom block — teaching and lecture rooms",
    x: 0.45,
    y: 0.07,
    icon: "GraduationCap",
  },
  {
    id: "l-wing-2",
    name: "L Wing 2 (Classrooms)",
    number: 8,
    category: "academic",
    description: "Left wing classroom block — additional teaching spaces",
    x: 0.50,
    y: 0.18,
    icon: "GraduationCap",
  },
  {
    id: "student-lounge",
    name: "Student Lounge",
    number: 9,
    category: "service",
    description: "Common lounge area for students and faculty to relax",
    x: 0.53,
    y: 0.22,
    icon: "Coffee",
  },
  {
    id: "new-block",
    name: "New Block",
    number: 10,
    category: "academic",
    description: "Recently constructed block with modern facilities",
    x: 0.78,
    y: 0.06,
    icon: "Building2",
  },

  // === CENTER: Gates, Cafeteria & Facilities ===
  {
    id: "second-gate",
    name: "2nd Gate",
    number: 11,
    category: "service",
    description: "Secondary entrance/exit gate of the campus",
    x: 0.55,
    y: 0.27,
    icon: "DoorOpen",
  },
  {
    id: "girls-hostel-entrance",
    name: "Girls Hostel Entrance",
    number: 12,
    category: "hostel",
    description: "Entrance gate to the girls hostel area",
    x: 0.61,
    y: 0.24,
    icon: "DoorClosed",
  },
  {
    id: "girls-hostel",
    name: "Girls Hostel",
    number: 13,
    category: "hostel",
    description: "Residential hostel for female students",
    x: 0.92,
    y: 0.15,
    icon: "Home",
  },
  {
    id: "amphitheater",
    name: "Amphitheater",
    number: 14,
    category: "service",
    description: "Open-air amphitheater for events, performances, and gatherings",
    x: 0.25,
    y: 0.22,
    icon: "Theater",
  },
  {
    id: "cafeteria",
    name: "Cafeteria",
    number: 15,
    category: "service",
    description: "Food court and dining area near the academic blocks",
    x: 0.28,
    y: 0.28,
    icon: "Utensils",
  },
  {
    id: "xerox",
    name: "Xerox",
    number: 16,
    category: "service",
    description: "Photocopying and printing shop for students",
    x: 0.32,
    y: 0.30,
    icon: "Printer",
  },
  {
    id: "canteen",
    name: "Canteen",
    number: 17,
    category: "service",
    description: "Main campus canteen serving snacks and meals",
    x: 0.32,
    y: 0.58,
    icon: "UtensilsCrossed",
  },
  {
    id: "parking",
    name: "Parking",
    number: 18,
    category: "parking",
    description: "Main parking area for cars and two-wheelers",
    x: 0.45,
    y: 0.55,
    icon: "ParkingCircle",
  },
  {
    id: "bus-stop",
    name: "Bus Stop",
    number: 19,
    category: "service",
    description: "Bus stop for college transport and public buses",
    x: 0.48,
    y: 0.40,
    icon: "Bus",
  },

  // === SPORTS AREA (bottom) ===
  {
    id: "sports-ground-entrance",
    name: "Sports Ground Entrance",
    number: 20,
    category: "sports",
    description: "Entry gate to the sports ground and athletic facilities",
    x: 0.26,
    y: 0.44,
    icon: "Play",
  },
  {
    id: "boys-hostel",
    name: "Boys Hostel",
    number: 21,
    category: "hostel",
    description: "Residential hostel for male students",
    x: 0.33,
    y: 0.75,
    icon: "Home",
  },
  {
    id: "sports-ground",
    name: "Sports Ground",
    number: 22,
    category: "sports",
    description: "Athletic field with running track and playing area",
    x: 0.33,
    y: 0.85,
    icon: "Dumbbell",
  },
  {
    id: "basketball",
    name: "Basketball Court",
    number: 23,
    category: "sports",
    description: "Outdoor basketball court for practice and matches",
    x: 0.48,
    y: 0.85,
    icon: "CircleDot",
  },
  {
    id: "staff-lounge",
    name: "Staff Lounge",
    number: 24,
    category: "service",
    description: "Lounge area for teaching and administrative staff",
    x: 0.53,
    y: 0.08,
    icon: "Users",
  },
];

export const CATEGORY_COLORS: Record<string, string> = {
  academic: "#3B82F6",     // Blue
  administrative: "#8B5CF6", // Purple
  sports: "#EF4444",        // Red
  service: "#F59E0B",       // Amber
  nature: "#22C55E",        // Green
  parking: "#6B7280",       // Gray
  hostel: "#EC4899",        // Pink
};

export const CATEGORY_LABELS: Record<string, string> = {
  academic: "Academic",
  administrative: "Administration",
  sports: "Sports",
  service: "Services",
  nature: "Nature",
  parking: "Parking",
  hostel: "Hostel",
};
