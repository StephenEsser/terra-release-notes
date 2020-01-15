import fetch from 'node-fetch';
import catalog from '../terra-component-catalog.json';

class FetchMarkdown {
  static logs() {
    const { repos } = catalog;

    const logs = Object.keys(repos).reduce((arr, repo) => {
      return arr.concat(repos[repo].map((component) => `https://github.com/cerner/${repo}/blob/master/packages/${component}/CHANGELOG.md?raw=true`));
    }, []);

    return logs;
  }

  static fetch(url) {
    return fetch(url)
      .then((response) => response.text().then((text) => text))
      .catch((error) => {
        console.log(error);
      })
  }

  static fetchMarkdown() {
    const logs = FetchMarkdown.logs();

    const promises = [];
    for (let index = 0; index < logs.length; index += 1) {
      promises.push(FetchMarkdown.fetch(logs[index]));
    }

    return Promise.all(promises).then((result) => {
      return result.join('');
    });
  }
}

export default FetchMarkdown.fetchMarkdown;

// const { repos } = require('./terra-component-config.json');

// const changelogs = Object.keys(repos).reduce((arr, repo) =>
//   arr.concat(repos[repo].map((package) => `https://github.com/cerner/${repo}/blob/master/packages/${package}/CHANGELOG.md?raw=true`)), []
// );

// const fetchMarkdown = (url) => {
//   return fetch(url)
//     .then((response) => {
//       console.log(response);
//       return response.text().then((text) => {
//         return text;
//       });
//     })
//     .catch((error) => {
//       console.log('Ouch', error);
//     })
// }

// const promises = [];
// for (let index = 0; index < changelogs.length; index += 1) {
//   promises.push(fetchMarkdown(changelogs[index]));
// }

// Promise.all(promises).then((result) => {
//   // console.log(result);
// })
