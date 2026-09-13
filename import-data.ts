import "dotenv/config";
import fs from "fs";
import { parse } from "csv-parse/sync";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(
  process.env.DATABASE_URL!
);

function readCsv(file: string) {
  const text = fs.readFileSync(file, "utf8");

  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  });
}

function value(v: any) {
  if (v === undefined || v === null || v === "") return null;
  return v;
}

console.log("Reading CSV files...");

const nodes = readCsv("./data/route_nodes_20260911_095306.csv");
const edges = readCsv("./data/route_edges_20260911_095254.csv");
const locations = readCsv("./data/campus_locations_20260911_095235.csv");

console.log(`Nodes: ${nodes.length}`);
console.log(`Edges: ${edges.length}`);
console.log(`Locations: ${locations.length}`);

try {
  await connection.beginTransaction();

  console.log("Clearing old route/location data...");

  await connection.query("DELETE FROM route_edges");
  await connection.query("DELETE FROM route_nodes");
  await connection.query("DELETE FROM campus_locations");

  console.log("Importing route nodes...");

  for (const row of nodes as any[]) {
    await connection.execute(
      `INSERT INTO route_nodes
       (id, label, routeFloor, routeNodekind, anchorId, ambiguous, reviewNote,
        buildingSection, roomAnchorId, mainAnchorId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        row.id,
        row.label,
        value(row.routeFloor) ?? "unknown",
        value(row.routeNodeKind) ?? "location",
        value(row.anchorId),
        row.ambiguous === "" ? 0 : Number(row.ambiguous ?? 0),
        value(row.reviewNote),
        value(row.buildingSection),
        value(row.roomAnchorId),
        value(row.mainAnchorId),
        value(row.createdAt),
        value(row.updatedAt),
      ]
    );
  }

  console.log("Importing route edges...");

  for (const row of edges as any[]) {
    await connection.execute(
  `INSERT INTO route_edges
   (id, fromNodeId, toNodeId, steps, routeDirection, routeTransition,
    source, reversible, createdAt, updatedAt)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    value(row.id),
    value(row.fromNodeId),
    value(row.toNodeId),
    value(row.steps),
    value(row.routeDirection) ?? "unknown",
    value(row.routeTransition),
    value(row.source),
    row.reversible === "" || row.reversible === undefined
      ? 1
      : Number(row.reversible),
    value(row.createdAt),
    value(row.updatedAt),
  ]
);
  }

  console.log("Importing campus locations...");

  for (const row of locations as any[]) {
    await connection.execute(
      `INSERT INTO campus_locations
       (id, name, number, campusLocationCategory, description, x, y, icon,
        createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        row.id,
        row.name,
        value(row.number),
        value(row.campusLocationCategory) ?? "service",
        value(row.description),
        value(row.x),
        value(row.y),
        value(row.icon),
        value(row.createdAt),
        value(row.updatedAt),
      ]
    );
  }

  await connection.commit();

  console.log("");
  console.log("================================");
  console.log("CampNavi data import successful!");
  console.log(`Route nodes: ${nodes.length}`);
  console.log(`Route edges: ${edges.length}`);
  console.log(`Campus locations: ${locations.length}`);
  console.log("================================");
} catch (error) {
  await connection.rollback();

  console.error("Import failed:");
  console.error(error);

  process.exitCode = 1;
} finally {
  await connection.end();
}