import { count } from "drizzle-orm";
import { campusLocations } from "../drizzle/schema";
import { CAMPUS_LOCATIONS } from "../client/src/lib/campusData";
import { getDb } from "./db";

export async function seedCampusLocations() {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_URL is not configured");

  const [{ locationCount }] = await db.select({ locationCount: count() }).from(campusLocations);
  if (locationCount > 0) {
    return {
      seeded: false,
      reason: "campus locations table already contains data",
      locationCount,
    };
  }

  await db.insert(campusLocations).values(
    CAMPUS_LOCATIONS.map((location) => ({
      id: location.id,
      name: location.name,
      number: location.number,
      category: location.category,
      description: location.description,
      x: location.x,
      y: location.y,
      icon: location.icon,
    })),
  );

  return {
    seeded: true,
    locationCount: CAMPUS_LOCATIONS.length,
  };
}
