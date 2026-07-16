import mysql from "mysql2/promise";
import postgres from "postgres";

async function migrate() {
  console.log("Connecting to databases...");
  
  const mysqlHost = process.env.MYSQL_HOST || "localhost";
  const mysqlPort = Number(process.env.MYSQL_PORT) || 3306;
  const mysqlUser = process.env.MYSQL_USERNAME || "root";
  const mysqlPass = process.env.MYSQL_PASSWORD || "password";
  const mysqlDb = process.env.MYSQL_DATABASE || "osl";

  const pgHost = process.env.POSTGRES_HOST || "localhost";
  const pgPort = Number(process.env.POSTGRES_PORT) || 5432;
  const pgUser = process.env.POSTGRES_USER || "osl";
  const pgPass = process.env.POSTGRES_PASSWORD || "osl";
  const pgDb = process.env.POSTGRES_DB || "osl";

  console.log(`MySQL source: ${mysqlUser}@${mysqlHost}:${mysqlPort}/${mysqlDb}`);
  console.log(`PostgreSQL target: ${pgUser}@${pgHost}:${pgPort}/${pgDb}`);

  let mysqlConn;
  let pg;

  try {
    mysqlConn = await mysql.createConnection({
      host: mysqlHost,
      port: mysqlPort,
      user: mysqlUser,
      password: mysqlPass,
      database: mysqlDb,
    });
    console.log("Connected to MySQL source database.");
  } catch (err) {
    console.error("Failed to connect to MySQL source database:", err);
    process.exit(1);
  }

  try {
    pg = postgres({
      host: pgHost,
      port: pgPort,
      user: pgUser,
      password: pgPass,
      database: pgDb,
      max: 10,
    });
    console.log("Connected to PostgreSQL target database.");
  } catch (err) {
    console.error("Failed to connect to PostgreSQL target database:", err);
    await mysqlConn.end();
    process.exit(1);
  }

  try {
    // Truncate target tables in reverse dependency order
    console.log("\nCleaning up target PostgreSQL database tables...");
    await pg.unsafe('TRUNCATE TABLE user_server_manage, server_vote, server_status, server_vote_hook, server_request, server, "user" CASCADE;');
    console.log("Target tables cleaned successfully.");

    // Migrate user table
    console.log("\nMigrating 'user' table...");
    const [users] = await mysqlConn.query("SELECT * FROM user");
    if (Array.isArray(users) && users.length > 0) {
      await pg`INSERT INTO "user" ${pg(users)}`;
      console.log(`Migrated ${users.length} users.`);
    } else {
      console.log("No users found to migrate.");
    }

    // Migrate server table
    console.log("\nMigrating 'server' table...");
    const [servers] = await mysqlConn.query("SELECT * FROM server");
    if (Array.isArray(servers) && servers.length > 0) {
      await pg`INSERT INTO server ${pg(servers)}`;
      console.log(`Migrated ${servers.length} servers.`);
    } else {
      console.log("No servers found to migrate.");
    }

    // Migrate user_server_manage table
    console.log("\nMigrating 'user_server_manage' table...");
    const [userServerManages] = await mysqlConn.query("SELECT * FROM user_server_manage");
    if (Array.isArray(userServerManages) && userServerManages.length > 0) {
      await pg`INSERT INTO user_server_manage ${pg(userServerManages)}`;
      console.log(`Migrated ${userServerManages.length} user_server_manage records.`);
    } else {
      console.log("No user_server_manage records found.");
    }

    // Migrate server_status table
    console.log("\nMigrating 'server_status' table...");
    const [serverStatuses] = await mysqlConn.query("SELECT * FROM server_status");
    if (Array.isArray(serverStatuses) && serverStatuses.length > 0) {
      const chunkSize = 2000;
      for (let i = 0; i < serverStatuses.length; i += chunkSize) {
        const chunk = serverStatuses.slice(i, i + chunkSize);
        await pg`INSERT INTO server_status ${pg(chunk)}`;
      }
      console.log(`Migrated ${serverStatuses.length} server_status records.`);
    } else {
      console.log("No server_status records found.");
    }

    // Migrate server_vote table
    console.log("\nMigrating 'server_vote' table...");
    const [serverVotes] = await mysqlConn.query("SELECT * FROM server_vote");
    if (Array.isArray(serverVotes) && serverVotes.length > 0) {
      const chunkSize = 2000;
      for (let i = 0; i < serverVotes.length; i += chunkSize) {
        const chunk = serverVotes.slice(i, i + chunkSize);
        await pg`INSERT INTO server_vote ${pg(chunk)}`;
      }
      console.log(`Migrated ${serverVotes.length} server_vote records.`);
    } else {
      console.log("No server_vote records found.");
    }

    // Migrate server_vote_hook table
    console.log("\nMigrating 'server_vote_hook' table...");
    const [serverVoteHooks] = await mysqlConn.query("SELECT * FROM server_vote_hook");
    if (Array.isArray(serverVoteHooks) && serverVoteHooks.length > 0) {
      await pg`INSERT INTO server_vote_hook ${pg(serverVoteHooks)}`;
      console.log(`Migrated ${serverVoteHooks.length} server_vote_hook records.`);
    } else {
      console.log("No server_vote_hook records found.");
    }

    // Migrate server_request table
    console.log("\nMigrating 'server_request' table...");
    const [serverRequests] = await mysqlConn.query("SELECT * FROM server_request");
    if (Array.isArray(serverRequests) && serverRequests.length > 0) {
      await pg`INSERT INTO server_request ${pg(serverRequests)}`;
      console.log(`Migrated ${serverRequests.length} server_request records.`);
    } else {
      console.log("No server_request records found.");
    }

    // Reset PK serial sequences in Postgres
    console.log("\nResetting primary key sequences in PostgreSQL...");
    const tablesWithSerial = ["server", "server_status", "server_vote", "server_request"];
    for (const table of tablesWithSerial) {
      await pg.unsafe(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE(MAX(id), 1)) FROM ${table};`);
    }
    console.log("Sequences reset successfully.");
    console.log("\nData migration completed successfully!");
  } catch (err) {
    console.error("\nMigration failed with error:", err);
  } finally {
    if (mysqlConn) await mysqlConn.end();
    if (pg) await pg.end();
  }
}

migrate();
