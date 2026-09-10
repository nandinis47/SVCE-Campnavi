import {
  boolean,
  float,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const routeFloorEnum = mysqlEnum("routeFloor", [
  "ground",
  "floor-1",
  "floor-2",
  "floor-3",
  "terrace",
  "unknown",
]);

export const routeNodeKindEnum = mysqlEnum("routeNodeKind", [
  "location",
  "junction",
  "room",
  "staircase",
  "lift",
  "gate",
  "endpoint",
]);

export const routeDirectionEnum = mysqlEnum("routeDirection", [
  "straight",
  "left",
  "right",
  "forward",
  "up",
  "down",
  "branch",
  "unknown",
]);

export const routeTransitionEnum = mysqlEnum("routeTransition", [
  "staircase",
  "lift",
  "gate",
  "road-crossing",
]);

/**
 * Authoritative campus graph nodes. The string node ID is intentionally stable
 * because it is also used by the existing React map and Student AI aliases.
 */
export const routeNodes = mysqlTable(
  "route_nodes",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    label: varchar("label", { length: 255 }).notNull(),
    floor: routeFloorEnum.notNull(),
    kind: routeNodeKindEnum.notNull(),
    anchorId: varchar("anchorId", { length: 128 }),
    ambiguous: boolean("ambiguous").default(false).notNull(),
    reviewNote: text("reviewNote"),
    buildingSection: varchar("buildingSection", { length: 255 }),
    roomAnchorId: varchar("roomAnchorId", { length: 128 }),
    mainAnchorId: varchar("mainAnchorId", { length: 128 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    anchorIdx: index("route_nodes_anchor_idx").on(table.anchorId),
    floorIdx: index("route_nodes_floor_idx").on(table.floor),
    kindIdx: index("route_nodes_kind_idx").on(table.kind),
  }),
);

export type RouteNodeRow = typeof routeNodes.$inferSelect;
export type InsertRouteNode = typeof routeNodes.$inferInsert;

/**
 * Authoritative weighted graph edges. A null step count is retained because
 * the source document explicitly contains unresolved measurements; such edges
 * remain reviewable but are excluded from shortest-path calculations.
 */
export const routeEdges = mysqlTable(
  "route_edges",
  {
    id: varchar("id", { length: 160 }).primaryKey(),
    fromNodeId: varchar("fromNodeId", { length: 128 })
      .notNull()
      .references(() => routeNodes.id),
    toNodeId: varchar("toNodeId", { length: 128 })
      .notNull()
      .references(() => routeNodes.id),
    steps: int("steps"),
    direction: routeDirectionEnum.notNull(),
    transition: routeTransitionEnum,
    source: varchar("source", { length: 255 }).notNull(),
    reversible: boolean("reversible").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    fromNodeIdx: index("route_edges_from_node_idx").on(table.fromNodeId),
    toNodeIdx: index("route_edges_to_node_idx").on(table.toNodeId),
  }),
);

export type RouteEdgeRow = typeof routeEdges.$inferSelect;
export type InsertRouteEdge = typeof routeEdges.$inferInsert;

export const campusLocationCategoryEnum = mysqlEnum("campusLocationCategory", [
  "academic",
  "administrative",
  "sports",
  "service",
  "nature",
  "parking",
  "hostel",
]);

/**
 * Existing 3D marker metadata. Coordinates are normalized to the drone image
 * and are stored separately from graph nodes because not every marker is a
 * navigable route node and not every route node has a 3D anchor.
 */
export const campusLocations = mysqlTable(
  "campus_locations",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    number: int("number").notNull(),
    category: campusLocationCategoryEnum.notNull(),
    description: text("description").notNull(),
    x: float("x").notNull(),
    y: float("y").notNull(),
    icon: varchar("icon", { length: 64 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    categoryIdx: index("campus_locations_category_idx").on(table.category),
    numberIdx: index("campus_locations_number_idx").on(table.number),
  }),
);

export type CampusLocationRow = typeof campusLocations.$inferSelect;
export type InsertCampusLocation = typeof campusLocations.$inferInsert;
