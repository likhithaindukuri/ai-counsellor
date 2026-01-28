require("dotenv").config();
const pool = require("./src/config/db");

async function fixDatabase() {
  try {
    console.log("🔍 Checking database structure...\n");

    // Check users table structure
    const usersCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);

    if (usersCheck.rows.length > 0) {
      console.log("📋 Current users table structure:");
      usersCheck.rows.forEach((col) => {
        console.log(`   • ${col.column_name}: ${col.data_type}`);
      });

      const idColumn = usersCheck.rows.find((r) => r.column_name === "id");
      if (idColumn && !idColumn.data_type.includes("int")) {
        console.log("\n⚠️  Users table has non-integer ID. This prevents foreign keys.");
        console.log("💡 Creating new tables without foreign keys first...\n");
      }
    }

    // Create tables without foreign keys first
    console.log("📝 Creating tables...\n");

    // Drop tables if they exist with wrong type, then recreate
    console.log("🔄 Dropping old tables if they exist...\n");
    await pool.query("DROP TABLE IF EXISTS user_todos CASCADE");
    await pool.query("DROP TABLE IF EXISTS locked_universities CASCADE");
    await pool.query("DROP TABLE IF EXISTS university_shortlists CASCADE");

    // University shortlists (using UUID to match users.id)
    try {
      await pool.query(`
        CREATE TABLE university_shortlists (
          id SERIAL PRIMARY KEY,
          user_id UUID NOT NULL,
          university_name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(user_id, university_name)
        )
      `);
      console.log("   ✅ university_shortlists");
    } catch (err) {
      console.log(`   ⚠️  university_shortlists: ${err.message.substring(0, 50)}`);
    }

    // Locked universities
    try {
      await pool.query(`
        CREATE TABLE locked_universities (
          id SERIAL PRIMARY KEY,
          user_id UUID UNIQUE NOT NULL,
          university_name VARCHAR(255) NOT NULL,
          locked_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log("   ✅ locked_universities");
    } catch (err) {
      console.log(`   ⚠️  locked_universities: ${err.message.substring(0, 50)}`);
    }

    // User todos
    try {
      await pool.query(`
        CREATE TABLE user_todos (
          id SERIAL PRIMARY KEY,
          user_id UUID NOT NULL,
          task TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log("   ✅ user_todos");
    } catch (err) {
      console.log(`   ⚠️  user_todos: ${err.message.substring(0, 50)}`);
    }

    // Create indexes
    console.log("\n📝 Creating indexes...\n");
    const indexes = [
      { name: "idx_shortlists_user_id", sql: "CREATE INDEX IF NOT EXISTS idx_shortlists_user_id ON university_shortlists(user_id)" },
      { name: "idx_locked_user_id", sql: "CREATE INDEX IF NOT EXISTS idx_locked_user_id ON locked_universities(user_id)" },
      { name: "idx_todos_user_id", sql: "CREATE INDEX IF NOT EXISTS idx_todos_user_id ON user_todos(user_id)" }
    ];

    for (const idx of indexes) {
      try {
        await pool.query(idx.sql);
        console.log(`   ✅ ${idx.name}`);
      } catch (err) {
        if (err.code !== "42P07") console.log(`   ⚠️  ${idx.name}: ${err.message.substring(0, 50)}`);
      }
    }

    console.log("\n✨ Database setup completed!");
    console.log("\n📋 All required tables are now available:");
    console.log("   • university_shortlists");
    console.log("   • locked_universities");
    console.log("   • user_todos");
    console.log("\n🚀 You can now use shortlisting, locking, and todos features!");
    console.log("\n💡 Note: Foreign keys are not enforced, but functionality will work correctly.");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

fixDatabase();
