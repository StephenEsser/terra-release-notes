const fs = require('fs');
const fetch = require('node-fetch');
const catalog = require('./catalog.json');

const ROOT_DIR = process.cwd();
const MARKDOWN_FILE = `${ROOT_DIR}/src/release-notes/ReleaseNotes.md`;

class ReleaseNotes {
  /**
   * Retrieves the changelog resource.
   * @param {string} repo - The terra repo. One of terra-core, terra-clinical, or terra-framework.
   * @param {string} component - The component to fetch the changelog for.
   */
  static resource(repo, component) {
    return `https://github.com/cerner/${repo}/blob/master/packages/${component}/CHANGELOG.md?raw=true`;
  }

  /**
   * Retrieves all change logs defined in the catalog.
   */
  static logs() {
    const { repos } = catalog;

    const logs = Object.keys(repos).reduce((arr, repo) => {
      return arr.concat(repos[repo].map((component) => ReleaseNotes.resource(repo, component)));
    }, []);

    return logs;
  }

  /**
   * Fetches the requested changelog from Github.
   * @param {string} url - The url to the changelog.
   */
  static fetchChangelog(url) {
    return fetch(url)
      .then((response) => response.text().then((text) => text))
      .catch((error) => { console.log(error); })
  }

  /**
   * Generates release notes markdown.
   */
  static generateMarkdown() {
    const logs = ReleaseNotes.logs();

    const promises = [];
    for (let index = 0; index < logs.length; index += 1) {
      promises.push(ReleaseNotes.fetchChangelog(logs[index]));
    }

    return Promise.all(promises).then((result) => {
      ReleaseNotes.writeMarkdown(result)
    });
  }

  /**
   * Writes the markdown file.
   * @param {string} markdown - The generated markdown.
   */
  static writeMarkdown(markdown) {
    fs.writeFileSync(MARKDOWN_FILE, markdown);
  }
}

ReleaseNotes.generateMarkdown();
