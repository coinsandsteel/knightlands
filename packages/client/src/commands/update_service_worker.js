import fs from "fs-extra";
import replace from "replace-in-file";
import { uid } from "uid";

async function run() {
  await updateServiceWorker();
}

async function updateServiceWorker() {
  let sourceFilePath = "./src/commands/service-worker.js.dist";
  let tmpFilePath = "./public/service-worker.js.tmp";
  let targetFilePath = "./public/service-worker.js";
  let version = uid();

  // There MUST be .tmp file
  // Otherwise browser might cache non-replaced version
  await fs.copy(
    sourceFilePath,
    tmpFilePath, {
      overwrite: true
    }
  );

  await replace({
    files: tmpFilePath,
    from: /%version%/g,
    to: version
  });

  await fs.move(
    tmpFilePath,
    targetFilePath, {
      overwrite: true
    }
  );

  console.log(`Service worker was successfully updated! (${version})`);
}

// yarn locale
run();