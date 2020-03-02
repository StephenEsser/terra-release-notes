import React, { useState } from 'react';
import Button from 'terra-button';
import classNames from 'classnames/bind';
import Timeline from '../timeline/Timeline';
import Notes from '../notes/Notes';
import releases from '../../static/releases.json';
import styles from './ReleaseNotes.module.scss';

const cx = classNames.bind(styles);

const ReleaseNotes = () => {
  const [pageCount, setPageCount] = useState(3);

  const releaseNotes = [];
  for (let index = 0; index < pageCount; index += 1) {
    const { date, notes } = releases[index];

    const componentNotes = notes.map((release) => {
      const { component, repo } = release;
      return <Notes key={`${date}-${component || repo}`} {...release} />;
    });

    releaseNotes.push({ date, notes: componentNotes });
  }

  function incrementPageCount() {
    setPageCount(Math.min(pageCount + 5, releases.length));
  }

  return (
    <div className={cx('release-notes')}>
      <div className={cx('title')}>
        Terra Release Notes
        <a title="Github Homepage" href="https://github.com/StephenEsser/terra-release-notes" className={cx('homepage')}>
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" height="1.25em" width="1.25em">
            <title>GitHub icon</title>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </a>
      </div>
      <Timeline releaseNotes={releaseNotes} />
      <div className={cx('footer')}>
        {(pageCount < releases.length) && <Button isBlock text="Load More" onClick={incrementPageCount} />}
      </div>
    </div>
  );
};

export default ReleaseNotes;
