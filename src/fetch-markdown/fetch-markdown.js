import catalog from './catalog.json';

const RELEASE_REGEX = /^[0-9]+.[0-9]+.[0-9]+\s-\s\(.*\)$/;

class Markdown {
  /**
   * Retrieves the changelog url.
   * @param {string} repo - The terra repo. One of terra-core, terra-clinical, or terra-framework.
   * @param {string} component - The component to fetch the changelog for.
   * @returns {string} - A URL to the changelog.
   */
  static changelogURL(repo, component) {
    return `https://raw.githubusercontent.com/cerner/${repo}/master/packages/${component}/CHANGELOG.md`;
  }

  /**
   * Retrieves all change logs defined in the catalog.
   * @returns {array<Promise>} - An array of promises.
   */
  static logs() {
    const { repos } = catalog;

    const logs = Object.keys(repos).reduce((arr, repo) => (
      arr.concat(repos[repo].map((component) => (
        Markdown.fetchChangelog(Markdown.changelogURL(repo, component)).then((text) => ({ repo, component, text }))
      )))
    ), []);

    return logs;
  }

  /**
   * Fetches the requested changelog from Github.
   * @param {string} url - The url to the changelog.
   * @returns {Promise} - A promise that resolves with the changelog text.
   */
  static fetchChangelog(url) {
    return fetch(url)
      .then((response) => response.text().then((text) => text))
      .catch((error) => { console.log(error); })
  }

  /**
   * Generates release notes markdown.
   * @returns {string} - The generated markdown.
   */
  static generateMarkdown() {
    const logs = Markdown.logs();

    return Promise.all(logs).then(Markdown.format);
  }

  static format(logs) {
    let releases = {};
    let markdown = '# Terra Release Notes\n';

    for (let index = 0; index < logs.length; index += 1) {
      const { component, text } = logs[index];

      const lines = text.split('\n');
      let currentLine = lines.findIndex((line) => RELEASE_REGEX.test(line));

      let currentDate;

      if (currentLine >= 0) {
        while (currentLine < lines.length) {
          const line = lines[currentLine];

          if (RELEASE_REGEX.test(line)) {
            const version = line.split(' -')[0];
            currentDate = line.substring(line.indexOf('(') + 1, line.indexOf(')'));

            if (releases[currentDate] === undefined) {
              releases[currentDate] = `## ${currentDate}\n`;
            }

            releases[currentDate] += `### ${component} - ${version}\n`;
          } else if (line.indexOf('----') < 0) {
            releases[currentDate] += line.indexOf('#') === 0 ? `#${line}\n` : `${line}\n`;
          }

          currentLine += 1;
        }
      }
    }

    const sortedMarkdown = Object.keys(releases).sort((a, b) => () => new Date(a) - new Date(b));

    for (let index = 0; index < 5; index += 1) {
      markdown += releases[sortedMarkdown[index]];
    }

    return markdown;
  }
}

export default Markdown.generateMarkdown;
