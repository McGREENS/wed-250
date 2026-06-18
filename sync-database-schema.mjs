import { createClient } from "@libsql/client";
import "dotenv/config";

// Source database (test - andiza-laurier)
const sourceClient = createClient({
  url: "libsql://andiza-laurier.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzg1NzM2NjIsImlkIjoiMDE5ZTFiM2YtYTEwMS03NjI4LWFlMTUtMzEwYjFmYzgyNjM2IiwicmlkIjoiOGY5MjA2NDgtZmNmMy00NTI0LWFlOWMtYzliMTU4NTQ5NDFjIn0.85oHmDE2Pys975-WVD96hdHp7pfFA2O5iXloCoUFHOiFqQZ2aXFGViOWDxzdXPt-5YcqAyCQS4vKXRv4uUZ8CQ",
});

// Target database (production - database-rose-book-vercel)
const targetClient = createClient({
  url: "libsql://database-rose-book-vercel-icfg-yewewbmsmdg5mps5mmjpurdl.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzg1NzM2NjIsImlkIjoiMDE5ZTFiM2YtYTEwMS03NjI4LWFlMTUtMzEwYjFmYzgyNjM2IiwicmlkIjoiOGY5MjA2NDgtZmNmMy00NTI0LWFlOWMtYzliMTU4NTQ5NDFjIn0.85oHmDE2Pys975-WVD96hdHp7pfFA2O5iXloCoUFHOiFqQZ2aXFGViOWDxzdXPt-5YcqAyCQS4vKXRv4uUZ8CQ",
});

async function copyDatabaseSchema() {
  try {
    console.log("\n=== Step 1: Checking Source Database (Test) ===\n");
    
    // Get all tables from source
    const tables = await sourceClient.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name;
    `);
    
    console.log("📋 Tables in source database:");
    tables.rows.forEach(r => console.log(`  - ${r.name}`));
    
    console.log("\n=== Step 2: Getting CREATE statements ===\n");
    
    const createStatements = [];
    for (const table of tables.rows) {
      const tableName = table.name;
      const createStmt = await sourceClient.execute(`
        SELECT sql FROM sqlite_master 
        WHERE type='table' AND name='${tableName}';
      `);
      
      if (createStmt.rows.length > 0 && createStmt.rows[0].sql) {
        createStatements.push({
          name: tableName,
          sql: createStmt.rows[0].sql
        });
        console.log(`✓ Got CREATE statement for ${tableName}`);
      }
    }
    
    console.log("\n=== Step 3: Getting all indexes ===\n");
    
    const indexes = await sourceClient.execute(`
      SELECT sql FROM sqlite_master 
      WHERE type='index' AND sql IS NOT NULL
      ORDER BY name;
    `);
    
    console.log(`Found ${indexes.rows.length} indexes`);
    
    console.log("\n=== Step 4: Checking Target Database (Production) ===\n");
    
    const targetTables = await targetClient.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name;
    `);
    
    console.log("📋 Tables in target database:");
    targetTables.rows.forEach(r => console.log(`  - ${r.name}`));
    
    console.log("\n=== Step 5: Applying schema to production ===\n");
    
    for (const stmt of createStatements) {
      try {
        // Check if table exists
        const exists = targetTables.rows.some(r => r.name === stmt.name);
        if (exists) {
          console.log(`⚠️  Table ${stmt.name} already exists, checking structure...`);
          
          // Get column info for both databases
          const sourceColumns = await sourceClient.execute(`PRAGMA table_info(${stmt.name})`);
          const targetColumns = await targetClient.execute(`PRAGMA table_info(${stmt.name})`);
          
          const sourceColNames = sourceColumns.rows.map(r => r.name);
          const targetColNames = targetColumns.rows.map(r => r.name);
          
          const missingColumns = sourceColNames.filter(col => !targetColNames.includes(col));
          
          if (missingColumns.length > 0) {
            console.log(`  ℹ️  Missing columns in ${stmt.name}: ${missingColumns.join(", ")}`);
            
            // Try to add missing columns
            for (const colName of missingColumns) {
              const colInfo = sourceColumns.rows.find(r => r.name === colName);
              let alterSql = `ALTER TABLE ${stmt.name} ADD COLUMN ${colName} ${colInfo.type}`;
              if (colInfo.dflt_value) {
                alterSql += ` DEFAULT ${colInfo.dflt_value}`;
              }
              
              try {
                await targetClient.execute(alterSql);
                console.log(`    ✓ Added column ${colName} to ${stmt.name}`);
              } catch (err) {
                console.log(`    ✗ Failed to add column ${colName}: ${err.message}`);
              }
            }
          } else {
            console.log(`  ✓ All columns exist in ${stmt.name}`);
          }
        } else {
          // Create the table
          await targetClient.execute(stmt.sql);
          console.log(`✓ Created table ${stmt.name}`);
        }
      } catch (error) {
        console.log(`✗ Error with table ${stmt.name}: ${error.message}`);
      }
    }
    
    console.log("\n=== Step 6: Applying indexes ===\n");
    
    for (const index of indexes.rows) {
      if (index.sql) {
        try {
          await targetClient.execute(index.sql);
          console.log(`✓ Created index`);
        } catch (error) {
          if (!error.message.includes("already exists")) {
            console.log(`✗ Error creating index: ${error.message}`);
          }
        }
      }
    }
    
    console.log("\n✅ Schema sync completed!\n");
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await sourceClient.close();
    await targetClient.close();
  }
}

copyDatabaseSchema();
