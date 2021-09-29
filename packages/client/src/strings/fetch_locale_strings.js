import { Configuration, LocalesApi } from "phrase-js";
import FormData from "form-data";
import fetch from "node-fetch";
import fs from "fs";
import localisationSetup from "./setup";

const globalAny = global;
globalAny.window = { fetch };
globalAny.FormData = FormData;

async function run() {
  const configuration = new Configuration({
    apiKey: "token " + process.env.PHRASE_API_TOKEN
  });
  const localesApi = new LocalesApi(configuration);

  Object.keys(localisationSetup.locales).forEach(async locale => {
    await fetchLocaleJsonFile(locale, localesApi);
  });
}

async function fetchLocaleJsonFile(locale, localesApi) {
  let requestParameters = {
    id: locale,
    projectId: "a83617e99ff397f4409a7ce9af684a48",
    fileFormat: "simple_json",
    includeEmptyTranslations: true,
    includeTranslatedKeys: true,
    includeUnverifiedTranslations: true
  };

  let binaryFile = null;
  try {
    binaryFile = await localesApi.localeDownload(requestParameters);
  } catch (err) {
    console.log(err);
    return;
  }

  let text = await binaryFile.text();
  let localeFile = `./src/strings/${locale}.json`;

  await fs.writeFileSync(localeFile, text, "utf8");
  console.log(`"${locale}"" locale fetched successfully!`);
}

// yarn locale
run();
