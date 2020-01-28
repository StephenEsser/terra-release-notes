const fs = require('fs');
const Changelog = require('./changelog-parser/changelog-parser');

const ROOT_DIR = process.cwd();
const RELEASES_FILE = `${ROOT_DIR}/src/static/releases.json`;

Changelog.generateReleases()
  .then((releases) => { fs.writeFileSync(RELEASES_FILE, JSON.stringify(releases)); })
  .catch((error) => { console.log(error); });
