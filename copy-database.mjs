#!/usr/bin/env node

/**
 * Complete Database Copy Script
 * 
 * This script copies the entire database structure and data from source to destination
 * Supports:
 * - Turso SQLite to another Turso instance
 * - Turso SQLite to Local SQLite
 * - Local SQLite to Turso SQLite
 * - Local SQLite to another Local SQLite
 */

import { createClient } from "@libsql/client";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}`),
  progress: (msg) => console.log(`${colors.cyan}→${colors.reset} ${msg}`),
};

// Configuration
const config = {
  SOURCE: {
    type: process.env.SOURCE_DB_TYPE || "turso", // "turso" or "sqlite"
    url: process.env.TURSO_DATABASE_URL || "./local.db",
    authToken: process.env.TURSO_AUTH_TOKEN || null,
  },
  DESTINATION: {
    type: process.env.DEST_DB_TYPE || "turso", // "turso" or "sqlite"
    url: process.env.DEST_DATABASE_URL || "./backup.db",
    authToken: process.env.DEST_AUTH_TOKEN || null,
  },
};

// Initialize database connections
async function initializeConnections() {
  log.section("Initializing Database Connections");

  const sourceConfig =
    config.SOURCE.type === "turso"
      ? {
          url: config.SOURCE.url,
          authToken: config.SOURCE.authToken,
        }
      : {
          url: `file:${config.SOURCE.url}`,
        };

  const destConfig =
    config.DESTINATION.type === "turso"
      ? {
          url: config.DESTINATION.url,
          authToken: config.DESTINATION.authToken,
        }
      : {
          url: `file:${config.DESTINATION.url}`,
        };

  try {
    const sourceDb = createClient(sourceConfig);
    const destDb = createClient(destConfig);

    // Test connections
    log.progress("Testing source database connection...");
    await sourceDb.execute("SELECT 1");
    log.success(
      `Source database connected (${config.SOURCE.type}: ${config.SOURCE.url})`
    );

    log.progress("Testing destination database connection...");
    await destDb.execute("SELECT 1");
    log.success(
      `Destination database connected (${config.DESTINATION.type}: ${config.DESTINATION.url})`
    );

    return { sourceDb, destDb };
  } catch (error) {
    log.error(
      `Failed to initialize database connections: ${error.message}`
    );
    process.exit(1);
  }
}

// Get all tables from source database
async function getTables(db) {
  try {
    const result = await db.execute(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`
    );
    return result.rows.map((row) => row.name);
  } catch (error) {
    log.error(`Failed to get tables: ${error.message}`);
    throw error;
  }
}

// Get table schema
async function getTableSchema(db, tableName) {
  try {
    const result = await db.execute(`PRAGMA table_info(${tableName})`);
    return result.rows;
  } catch (error) {
    log.error(
      `Failed to get schema for table ${tableName}: ${error.message}`
    );
    throw error;
  }
}

// Get CREATE TABLE statement
async function getCreateTableStatement(db, tableName) {
  try {
    const result = await db.execute(
      `SELECT sql FROM sqlite_master WHERE type='table' AND name=?`,
      [tableName]
    );
    if (result.rows.length === 0) {
      throw new Error(`Table ${tableName} not found`);
    }
    return result.rows[0].sql;
  } catch (error) {
    log.error(
      `Failed to get CREATE statement for ${tableName}: ${error.message}`
    );
    throw error;
  }
}

// Get all indexes and triggers
async function getIndexesAndTriggers(db, tableName) {
  try {
    const indexResult = await db.execute(
      `SELECT sql FROM sqlite_master WHERE type='index' AND tbl_name=? AND sql IS NOT NULL`,
      [tableName]
    );

    const triggerResult = await db.execute(
      `SELECT sql FROM sqlite_master WHERE type='trigger' AND tbl_name=?`,
      [tableName]
    );

    return {
      indexes: indexResult.rows.map((r) => r.sql),
      triggers: triggerResult.rows.map((r) => r.sql),
    };
  } catch (error) {
    log.error(
      `Failed to get indexes/triggers for ${tableName}: ${error.message}`
    );
    throw error;
  }
}

// Drop all tables in destination
async function clearDestinationDatabase(db) {
  log.section("Preparing Destination Database");
  log.progress("Retrieving existing tables...");

  try {
    const tables = await getTables(db);

    if (tables.length === 0) {
      log.info("Destination database is empty");
      return;
    }

    log.progress(`Found ${tables.length} existing table(s), dropping them...`);

    // Disable foreign keys temporarily
    await db.execute("PRAGMA foreign_keys = OFF");

    for (const table of tables) {
      await db.execute(`DROP TABLE IF EXISTS ${table}`);
      log.progress(`Dropped table: ${table}`);
    }

    // Re-enable foreign keys
    await db.execute("PRAGMA foreign_keys = ON");
    log.success("Destination database cleared");
  } catch (error) {
    log.error(`Failed to clear destination database: ${error.message}`);
    throw error;
  }
}

// Copy table schema
async function copyTableSchema(sourceDb, destDb, tableName) {
  try {
    log.progress(`Copying schema for table: ${tableName}`);

    const createStatement = await getCreateTableStatement(sourceDb, tableName);
    await destDb.execute(createStatement);

    // Copy indexes and triggers
    const { indexes, triggers } = await getIndexesAndTriggers(
      sourceDb,
      tableName
    );

    for (const index of indexes) {
      try {
        await destDb.execute(index);
      } catch (err) {
        log.warn(`Failed to create index: ${err.message}`);
      }
    }

    for (const trigger of triggers) {
      try {
        await destDb.execute(trigger);
      } catch (err) {
        log.warn(`Failed to create trigger: ${err.message}`);
      }
    }

    log.success(`Schema copied for table: ${tableName}`);
  } catch (error) {
    log.error(`Failed to copy schema for ${tableName}: ${error.message}`);
    throw error;
  }
}

// Copy table data in chunks
async function copyTableData(sourceDb, destDb, tableName, chunkSize = 1000) {
  try {
    log.progress(`Counting rows in table: ${tableName}`);

    // Get total row count
    const countResult = await sourceDb.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
    const totalRows = countResult.rows[0].count;

    if (totalRows === 0) {
      log.info(`No data to copy for table: ${tableName}`);
      return;
    }

    log.progress(`Copying ${totalRows} row(s) from ${tableName}...`);

    // Get column names
    const schemaResult = await sourceDb.execute(`PRAGMA table_info(${tableName})`);
    const columns = schemaResult.rows.map((r) => r.name);
    const columnList = columns.join(", ");

    // Temporarily disable foreign key constraints
    await destDb.execute("PRAGMA foreign_keys = OFF");

    // Copy data in chunks
    const numChunks = Math.ceil(totalRows / chunkSize);

    for (let i = 0; i < numChunks; i++) {
      const offset = i * chunkSize;
      const limit = chunkSize;

      // Fetch chunk from source
      const dataResult = await sourceDb.execute(
        `SELECT ${columnList} FROM ${tableName} LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      if (dataResult.rows.length === 0) break;

      // Insert chunk to destination
      for (const row of dataResult.rows) {
        const values = columns.map((col) => row[col]);
        const placeholders = columns.map(() => "?").join(", ");
        const insertQuery = `INSERT INTO ${tableName} (${columnList}) VALUES (${placeholders})`;

        try {
          await destDb.execute(insertQuery, values);
        } catch (err) {
          log.warn(`Failed to insert row: ${err.message}`);
        }
      }

      const progress = Math.min((i + 1) * chunkSize, totalRows);
      log.progress(`${tableName}: ${progress}/${totalRows} rows copied`);
    }

    // Re-enable foreign key constraints
    await destDb.execute("PRAGMA foreign_keys = ON");

    log.success(`Data copied for table: ${tableName} (${totalRows} row(s))`);
  } catch (error) {
    log.error(`Failed to copy data for ${tableName}: ${error.message}`);
    throw error;
  }
}

// Verify copy integrity
async function verifyDatabase(sourceDb, destDb) {
  log.section("Verifying Database Copy");

  try {
    const sourceTables = await getTables(sourceDb);
    const destTables = await getTables(destDb);

    log.progress(`Source tables: ${sourceTables.length}`);
    log.progress(`Destination tables: ${destTables.length}`);

    let allValid = true;

    for (const table of sourceTables) {
      if (!destTables.includes(table)) {
        log.error(`Table ${table} missing in destination`);
        allValid = false;
        continue;
      }

      // Compare row counts
      const sourceCount = await sourceDb.execute(`SELECT COUNT(*) as count FROM ${table}`);
      const destCount = await destDb.execute(`SELECT COUNT(*) as count FROM ${table}`);

      const sourceRows = sourceCount.rows[0].count;
      const destRows = destCount.rows[0].count;

      if (sourceRows !== destRows) {
        log.warn(
          `Table ${table}: source has ${sourceRows} rows, destination has ${destRows} rows`
        );
        allValid = false;
      } else {
        log.success(`Table ${table}: ${sourceRows} row(s) verified`);
      }
    }

    return allValid;
  } catch (error) {
    log.error(`Verification failed: ${error.message}`);
    return false;
  }
}

// Main execution
async function main() {
  try {
    log.section("Database Copy Tool");
    log.info("Configuration:");
    log.info(
      `  Source: ${config.SOURCE.type} (${config.SOURCE.url})`
    );
    log.info(
      `  Destination: ${config.DESTINATION.type} (${config.DESTINATION.url})`
    );

    // Confirm start
    console.log("\n⚠️  WARNING: This will replace all data in the destination database");
    const startTime = Date.now();

    const { sourceDb, destDb } = await initializeConnections();

    // Get tables from source
    log.section("Analyzing Source Database");
    const tables = await getTables(sourceDb);
    log.success(`Found ${tables.length} table(s) in source database`);
    log.info("Tables: " + tables.join(", "));

    // Clear destination
    await clearDestinationDatabase(destDb);

    // Copy schema
    log.section("Copying Database Schema");
    for (const table of tables) {
      await copyTableSchema(sourceDb, destDb, table);
    }

    // Copy data
    log.section("Copying Database Data");
    for (const table of tables) {
      await copyTableData(sourceDb, destDb, table);
    }

    // Verify
    const isValid = await verifyDatabase(sourceDb, destDb);

    // Summary
    log.section("Copy Complete");
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    log.success(`Database copy completed in ${duration}s`);
    if (isValid) {
      log.success("✓ Verification passed - all data copied correctly");
    } else {
      log.warn("⚠ Verification found discrepancies - check logs above");
    }

    // Create backup report
    const report = {
      timestamp: new Date().toISOString(),
      source: {
        type: config.SOURCE.type,
        url: config.SOURCE.url,
      },
      destination: {
        type: config.DESTINATION.type,
        url: config.DESTINATION.url,
      },
      tablesCount: tables.length,
      tablesList: tables,
      duration: `${duration}s`,
      verified: isValid,
    };

    await fs.writeFile(
      path.join(__dirname, "database-copy-report.json"),
      JSON.stringify(report, null, 2)
    );

    log.success(
      "Report saved to: database-copy-report.json"
    );

    process.exit(isValid ? 0 : 1);
  } catch (error) {
    log.error(`Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main();
