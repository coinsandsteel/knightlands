import fs from "fs-extra";

async function run() {
  await syncVersion();
}

async function syncVersion() {
  try {
    let frontendVersionFile = process.env.FRONTEND_VERSION_FILE || "/tmp/__client_version";
    await fs.move(
      frontendVersionFile + ".tmp",
      frontendVersionFile, {
        overwrite: true
      }
    );
    console.log(`Version was successfully synced!`);
  } catch (e) {
    console.error(`ERROR! Version syncer failed`, e);
  }
}

run();