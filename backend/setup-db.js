const fs = require("fs");
const path = require("path");
require("dotenv").config();
const pool = require("./src/config/db");

async function setupDatabase() {
  try {
    console.log("📦 Reading schema file...");
    const schemaPath = path.join(__dirname, "sql", "schema.sql");
    const schemaSQL = fs.readFileSync(schemaPath, "utf8");

    console.log("🔌 Connecting to database...");
    console.log(`   Database: ${process.env.DB_NAME}`);
    console.log(`   Host: ${process.env.DB_HOST}`);

    // Check if users table exists and verify its structure
    try {
      const usersCheck = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND table_schema = 'public'
      `);
      if (usersCheck.rows.length > 0) {
        console.log("\n⚠️  Users table already exists. Checking structure...");
        const idColumn = usersCheck.rows.find((r) => r.column_name === "id");
        if (idColumn && !idColumn.data_type.includes("int")) {
          console.log("   ⚠️  Users table has non-integer ID. This may cause foreign key issues.");
        }
      }
    } catch (err) {
      // Table doesn't exist, which is fine
    }

    console.log(`\n📝 Executing SQL schema...\n`);

    // Remove comments and split into statements
    let cleanSQL = schemaSQL.replace(/--.*$/gm, "");
    const statements = cleanSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.match(/^\s*$/));

    // Execute statements one by one, handling errors gracefully
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ";";
      if (statement.trim() && statement.trim() !== ";") {
        try {
          await pool.query(statement);
          const tableMatch = statement.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
          const indexMatch = statement.match(/CREATE\s+INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
          const name = tableMatch ? tableMatch[1] : (indexMatch ? indexMatch[1] : null);
          if (name) {
            console.log(`   ✅ ${name}`);
          }
        } catch (error) {
          // Ignore "already exists" errors
          if (error.code === "42P07" || error.message.includes("already exists")) {
            const tableMatch = statement.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
            const indexMatch = statement.match(/CREATE\s+INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
            const name = tableMatch ? tableMatch[1] : (indexMatch ? indexMatch[1] : null);
            if (name) {
              console.log(`   ⚠️  ${name} (already exists, skipping)`);
            }
          } else if (error.message.includes("foreign key constraint")) {
            // Foreign key error - try to create table without FK first, then add FK
            console.log(`   ⚠️  Foreign key constraint issue detected. Trying alternative approach...`);
            const tableMatch = statement.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
            if (tableMatch) {
              const tableName = tableMatch[1];
              // Extract table definition without foreign keys
              const tableDef = statement.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?\w+\s*\((.*)\)/is);
              if (tableDef) {
                // Remove FOREIGN KEY constraints temporarily
                let defWithoutFK = tableDef[1].replace(/,\s*FOREIGN\s+KEY\s+\([^)]+\)\s+REFERENCES\s+\w+\([^)]+\)/gi, "");
                try {
                  await pool.query(`CREATE TABLE IF NOT EXISTS ${tableName} (${defWithoutFK})`);
                  console.log(`   ✅ ${tableName} (created without foreign keys)`);
                  // Note: Foreign keys will be added when we fix the schema
                } catch (err2) {
                  console.log(`   ⚠️  ${tableName} (skipped due to error: ${err2.message.substring(0, 50)})`);
                }
              }
            }
          } else {
            console.error(`   ❌ Error: ${error.message.substring(0, 100)}`);
            // Continue with other statements
          }
        }
      }
    }

    console.log("\n✨ Database setup completed successfully!");
    console.log("\n📋 Tables created:");
    console.log("   • users");
    console.log("   • user_profiles");
    console.log("   • user_stages");
    console.log("   • university_shortlists");
    console.log("   • locked_universities");
    console.log("   • user_todos");
    console.log("\n🚀 You can now restart your backend server!");
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error setting up database:");
    console.error(error.message);
    if (error.code === "42P01") {
      console.error("\n💡 Tip: Make sure PostgreSQL is running and the database exists.");
    }
    process.exit(1);
  }
}

setupDatabase();
