import marked from 'marked';
import catalog from './catalog.json';

const RELEASE_REGEX = /^[0-9]+.[0-9]+.[0-9]+\s-\s\(.*\)$/;

class Markdown {
  /**
   * Retrieves the changelog url.
   * Note: Passing a repo and a component assumes monorepo directory structure.
   * @param {string} repo - The repo.
   * @param {string} component - The component to fetch the changelog for.
   * @returns {string} - A URL to the changelog.
   */
  static changelogURL(repo, component) {
    if (component) {
      return `https://raw.githubusercontent.com/cerner/${repo}/master/packages/${component}/CHANGELOG.md`;
    }

    return `https://raw.githubusercontent.com/cerner/${repo}/master/CHANGELOG.md`;
  }

  /**
   * Retrieves all changelogs for the packages defined in the catalog.
   * @returns {array<Promise>} - An array of promises that resolve with the raw markdown text of the changelog.
   */
  static changelogs() {
    const { monorepos, repos } = catalog;

    const changelogs = [];

    // Iterate the monorepo component changelogs.
    Object.keys(monorepos).forEach((repo) => {
      const logs = monorepos[repo].map((component) => (
        { repo, component, url: Markdown.changelogURL(repo, component) }
      ));

      changelogs.push(...logs);
    });

    // Iterate the individual project changelogs.
    for (let index = 0; index < repos.length; index += 1) {
      const repo = repos[index];

      changelogs.push({ repo, component: repo, url: Markdown.changelogURL(repo) });
    }

    const promises = changelogs.map(({ repo, component, url }) => (
      Markdown.fetchChangelog(url).then((changelog) => ({ repo, component, changelog }))
    ));

    return Promise.all(promises);
  }

  /**
   * Fetches the requested changelog from Github.
   * @param {string} url - The url to the changelog.
   * @returns {Promise} - A promise that resolves with the changelog text.
   */
  static fetchChangelog(url) {
    return fetch(url)
      .then((response) => response.text().then((text) => text))
      .catch((error) => { console.log(error); });
  }

  /**
   * Generates release notes markdown.
   * @returns {string} - The generated markdown.
   */
  static generateMarkdown() {
    return Markdown.changelogs().then(Markdown.format);
  }

  static format(changelogs) {
    const releases = {};

    for (let index = 0; index < changelogs.length; index += 1) {
      const { component, changelog } = changelogs[index];

      const lines = changelog.split('\n');
      let currentLine = lines.findIndex((line) => RELEASE_REGEX.test(line));

      let currentDate;

      if (currentLine >= 0) {
        while (currentLine < lines.length) {
          const line = lines[currentLine];

          if (RELEASE_REGEX.test(line)) {
            const version = line.split(' -')[0];
            currentDate = line.substring(line.indexOf('(') + 1, line.indexOf(')'));

            if (releases[currentDate] === undefined) {
              releases[currentDate] = `# ${currentDate}\n`;
            }

            releases[currentDate] += `## ${component} (${version})\n`;
          } else if (line.indexOf('----') < 0) {
            releases[currentDate] += `${line}\n`;
          }

          currentLine += 1;
        }
      }
    }

    return Object.keys(releases).sort((a, b) => new Date(b) - new Date(a)).map((date) => marked(releases[date]));
  }
}

export default Markdown.generateMarkdown;
