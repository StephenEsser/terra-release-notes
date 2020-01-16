import catalog from './catalog.json';

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
        Markdown.fetchChangelog(Markdown.changelogURL(repo, component))
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

    return Promise.all(logs).then((results) => results.join('\n'));
  }
}

export default Markdown.generateMarkdown;
