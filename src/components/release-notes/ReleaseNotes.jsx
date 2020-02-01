import React, { useState, useRef, useLayoutEffect } from 'react';
import marked from 'marked';
import classNames from 'classnames/bind';
import ContentContainer from 'terra-content-container';
import Paginator from 'terra-paginator/lib/ControlledPaginator';
import releases from '../../static/releases.json';
import styles from './ReleaseNotes.module.scss';

const cx = classNames.bind(styles);

const ReleaseNotes = () => {
  const scroll = useRef();
  const [index, setIndex] = useState(1);

  const { date, notes } = releases[index - 1];

  useLayoutEffect(() => {
    // Reset the scroll position when changing pages.
    scroll.current.scrollTop = 0;
  });

  return (
    <ContentContainer
      fill
      scrollRefCallback={(ref) => { scroll.current = ref; }}
      className={cx('release-notes', 'markdown-body')}
      header={(
        <h1>
          {`Terra Release Notes - ${date}`}
          <a title="Github Homepage" href="https://github.com/StephenEsser/terra-release-notes" className={cx('homepage')}>
            <img src="GitHub-Mark-32px.png" alt="github" />
          </a>
        </h1>
      )}
      footer={(
        <div className={cx('footer')}>
          <Paginator
            onPageChange={setIndex}
            selectedPage={index}
            totalCount={releases.length}
            itemCountPerPage={1}
          />
        </div>
      )}
    >
      <div dangerouslySetInnerHTML={{ __html: marked(notes) }} />
    </ContentContainer>
  );
};

export default ReleaseNotes;
