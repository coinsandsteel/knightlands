import fs from "fs-extra";
import replace from "replace-in-file";
import {
  uid
} from "uid";

async function run() {
  await updateVersion();
}

async function updateVersion() {
  let version = uid();

  try {
    await fs.remove('/tmp/__client_version');
    await fs.remove('/tmp/__client_version.tmp');

    ['service-worker.js', 'index.html'].forEach(async (fileName) => {
      let distFullPath = "./src/commands/templates/" + fileName + ".dist";
      let tmpFullPath = "./public/" + fileName + ".tmp";
      let targetFullPath = "./public/" + fileName;

      // There MUST be .tmp file
      // Otherwise browser might cache non-replaced version
      await fs.copy(
        distFullPath,
        tmpFullPath, {
          overwrite: true
        }
      );

      await replace({
        files: tmpFullPath,
        from: /%version%/g,
        to: version
      });

      await fs.move(
        tmpFullPath,
        targetFullPath, {
          overwrite: true
        }
      );
    });

    await fs.writeFile(
      '/tmp/__client_version.tmp',
      version,
      {
        encoding: 'utf8'
      }
    );
    console.log(`Version was successfully updated! (${version})`);
  } catch (e) {
    console.error(`ERROR! Version updater failed`, e);
  }
}

// node -r esm -r ts-node/register src/commands/update_version.js
run();