/**
 * LocationPanel — Detail popup when a marker is clicked
 * Design: Satellite Explorer — glassmorphic floating panel
 */
import { useState } from "react";
import { X, Navigation, MapPin, Clock, Users, Phone, MessageCircle, PhoneCall } from "lucide-react";
import { CATEGORY_COLORS, type CampusLocation } from "@/lib/campusData";

interface LocationPanelProps {
  location: CampusLocation;
  onClose: () => void;
}

export default function LocationPanel({ location, onClose }: LocationPanelProps) {
  const color = CATEGORY_COLORS[location.category];
  const [showContactCard, setShowContactCard] = useState(false);

  // Opening times mapping
  const openingTimes: Record<string, string> = {
    "Enquiry Office": "8:30 AM – 5:00 PM",
    "College Bus Parking": "8:20 AM – 4:45 PM",
    "Girls Hostel": "6:00 AM – 8:00 PM",
    "Xerox": "9:00 AM – 5:00 PM",
    "Parking": "Anytime",
    "Boys Hostel": "6:00 AM – 8:00 PM",
  };

  const displayOpeningTime = openingTimes[location.name] || "8:00 AM – 5:00 PM";

  // Contact data mapping
  const contactData: Record<string, { name: string; phones: string[] }[]> = {
    "Enquiry Office": [{ name: "Enquiry Office", phones: ["+91 9731226262", "+91 9740202345"] }],
    "R Wing 1 (Classrooms)": [
      { name: "Data Science Department (Ground floor)", phones: ["9900952528"] },
      { name: "ECE Department (2nd floor)", phones: ["9916090956"] },
      { name: "AIML Department (3rd floor)", phones: ["8762170269"] },
    ],
    "L Wing 2 (Classrooms)": [
      { name: "Cybersecurity Department (Ground floor)", phones: ["9844641646"] },
      { name: "ISE Department (1st floor)", phones: ["9743230958"] },
      { name: "CSE Department (2nd floor)", phones: ["7975394329"] },
    ],
    "Center Dome": [{ name: "General College Phone", phones: ["+91 9731226262", "+91 9916775988"] }],
    "Girls Hostel": [{ name: "Girls Hostel", phones: ["9876543948"] }],
    "Boys Hostel": [{ name: "Boys Hostel", phones: ["9863894876"] }],
    "Cafeteria": [{ name: "Cafeteria", phones: ["8764673946"] }],
    "Xerox": [{ name: "Xerox Shop", phones: ["9902238699"] }],
    "Canteen": [{ name: "Canteen", phones: ["7809754367"] }],
    "Sports Ground": [{ name: "Sports Ground", phones: ["9876543210"] }],
    "Basketball Court": [{ name: "Basketball Court", phones: ["9876754321"] }],
    "New Block": [
      { name: "Basic Science (1st floor)", phones: ["9535530365"] },
      { name: "MBA and MCA (3rd floor)", phones: ["9986049659"] },
    ],
  };

  // Locations that should not display the Contact button
  const locationsWithoutContact = [
    "Main Gate",
    "R Wing 2 (Classrooms)",
    "L Wing 1 (Classrooms)",
    "Student Lounge",
    "2nd Gate",
    "Girls Hostel Entrance",
    "Amphitheater",
    "Bus Stop",
    "Sports Ground Entrance",
    "Staff Lounge",
    "Parking",
  ];

  const showContactButton = !locationsWithoutContact.includes(location.name);

  return (
    <div
      className="fixed top-20 right-4 z-40 w-72 animate-in slide-in-from-right-4 fade-in duration-300"
      style={{ animationFillMode: "both" }}
    >
      <div
        className="rounded-2xl border border-white/10 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9))",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* Color accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
          }}
        />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{
                    backgroundColor: color,
                    color: "white",
                  }}
                >
                  {location.number}
                </span>
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${color}20`,
                    color: color,
                  }}
                >
                  {location.category}
                </span>
              </div>
              <h3 className="text-white text-lg font-bold">{location.name}</h3>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            {location.description}
          </p>

          {/* Info rows */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm">
              <MapPin className="w-3.5 h-3.5" style={{ color }} />
              <span className="text-white/70">Campus Location</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Clock className="w-3.5 h-3.5" style={{ color }} />
              <span className="text-white/70">Open: {displayOpeningTime}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Users className="w-3.5 h-3.5" style={{ color }} />
              <span className="text-white/70">Accessible to all students</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-5">
            <button
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white transition-all active:scale-95"
              style={{
                backgroundColor: color,
              }}
              onClick={onClose}
            >
              <Navigation className="w-3 h-3" />
              Navigate
            </button>
            {showContactButton && (
              <button
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 transition-all active:scale-95"
                onClick={() => setShowContactCard(true)}
              >
                <Phone className="w-3 h-3" />
                Contact
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contact Card Overlay */}
      {showContactCard && contactData[location.name] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          onClick={() => setShowContactCard(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.95))",
              backdropFilter: "blur(20px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Color accent bar */}
            <div
              className="h-1 w-full"
              style={{
                background: `linear-gradient(90deg, ${color}, ${color}88)`,
              }}
            />

            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white text-lg font-bold">{location.name}</h3>
                  <p className="text-white/60 text-sm">Contact Information</p>
                </div>
                <button
                  onClick={() => setShowContactCard(false)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Contact entries */}
              <div className="space-y-3">
                {contactData[location.name].map((contact, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-white/5 border border-white/10 p-3"
                  >
                    <p className="text-white font-medium text-sm mb-2">{contact.name}</p>
                    <div className="space-y-2">
                      {contact.phones.map((phone, phoneIdx) => (
                        <div
                          key={phoneIdx}
                          className="flex items-center justify-between"
                        >
                          <span className="text-white/70 text-sm">{phone}</span>
                          <div className="flex gap-2">
                            <a
                              href={`tel:${phone}`}
                              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                              title="Call"
                            >
                              <PhoneCall className="w-4 h-4" />
                            </a>
                            <a
                              href={`sms:${phone}`}
                              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                              title="Message"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
