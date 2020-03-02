/* eslint-disable import/no-extraneous-dependencies */
const fetch = require('node-fetch');
const catalog = require('../../src/static/catalog.json');

const RELEASE_REGEX = /^[0-9]+.[0-9]+.[0-9]+\s+-\s+\(.*\)$/;

class Changelog {
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
   * Retrieves the commit history url for a release.
   * Note: Passing a repo and a component assumes monorepo directory structure.
   * @param {string} repo - The repo.
   * @param {string} component - The component.
   * @param {string} tag - The released version tag.
   * @returns {string} - A URL to the commit history of the release for the provided tag.
   */
  static history(repo, component, tag) {
    if (component) {
      return `https://github.com/cerner/${repo}/commits/${component}%40${tag}/packages/${component}/`;
    }

    return `https://github.com/cerner/${repo}/commits/v${tag}/`;
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
        { repo, component, url: Changelog.changelogURL(repo, component) }
      ));

      changelogs.push(...logs);
    });

    // Iterate the individual project changelogs.
    for (let index = 0; index < repos.length; index += 1) {
      changelogs.push({ repo: repos[index], url: Changelog.changelogURL(repos[index]) });
    }

    const promises = changelogs.map(({ repo, component, url }) => (
      Changelog.fetchChangelog(url).then((changelog) => ({ repo, component, changelog }))
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
   * Generates changelog release notes by date.
   * @returns {string} - The generated release notes.
   */
  static generateReleases() {
    return Changelog.changelogs().then(Changelog.format);
  }

  /**
   * Splices an array of changelogs into formatted release notes sorted by date.
   * @param {array<Object>} changelogs - An array of changelogs.
   * @returns {array} - An array of sorted release notes.
   */
  static format(changelogs) {
    const releases = {};

    for (let index = 0; index < changelogs.length; index += 1) {
      const { repo, component, changelog } = changelogs[index];

      const lines = changelog.split('\n');

      let currentDate;
      let currentLine = 0;
      let currentSection;

      while (currentLine < lines.length) {
        const line = lines[currentLine].trim();

        if (line.indexOf('-----') >= 0 || line.length === 0) {
          // Skip horizontal markdown lines.
        } else if (RELEASE_REGEX.test(line)) {
          const version = line.split(' -')[0];

          currentDate = Changelog.formatDate(line);
          currentSection = undefined; // Clear the current section.

          // Create a release date entry if one does not already exist.
          if (releases[currentDate] === undefined) {
            releases[currentDate] = {};
          }

          // Append the component release information.
          releases[currentDate][component || repo] = {
            component,
            link: Changelog.history(repo, component, version),
            notes: {},
            repo,
            version,
          };
        } else if (currentDate && line.indexOf('#') === 0) {
          currentSection = line.replace(/#/gi, '').trim();
          releases[currentDate][component || repo].notes[currentSection] = [];
        } else if (currentDate && line.length > 0) {
          // Default a section if necessary. Sometimes developers forget to add one to the changelog.
          if (!currentSection) {
            currentSection = 'Changed';
            releases[currentDate][component || repo].notes[currentSection] = [];
          }

          const trimmedLine = line.replace(/^\*|-/, '').trim();
          releases[currentDate][component || repo].notes[currentSection].push(trimmedLine);
        }

        currentLine += 1;
      }
    }

    // Sort the releases by date.
    return Object.keys(releases)
      .sort((a, b) => (new Date(b) - new Date(a)))
      .map((date) => ({ date, notes: Object.keys(releases[date]).sort().map((key) => releases[date][key]) }));
  }

  /**
   * Parses and formats a date from a changelog release entry.
   * @param {string} string - A released changelog entry string.
   * @returns {string} - A valid date string.
   */
  static formatDate(string) {
    const date = string.substring(string.indexOf('(') + 1, string.indexOf(')'));

    // Check if the date is valid without any alterations.
    if (`${new Date(date)}` !== 'Invalid Date' && !Number.isNaN(new Date(date))) {
      return date;
    }

    const [month, day, year] = date.split(' ');

    // A few changelog dates are formatted incorrectly. Strip any day modifiers. (nd and th) 2nd, 4th, etc..
    return `${month} ${day.replace(/\D/g, '')}, ${year}`;
  }
}

module.exports = Changelog;
