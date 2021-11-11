import fs from "fs-extra";

async function run() {
  await syncVersion();
}

async function syncVersion() {
  try {
    await fs.move(
      '/tmp/__client_version.tmp',
      '/tmp/__client_version', {
        overwrite: true
      }
    );
    console.log(`Version was successfully synced!`);
  } catch (e) {
    console.error(`ERROR! Version syncer failed`, e);
  }
}

run();