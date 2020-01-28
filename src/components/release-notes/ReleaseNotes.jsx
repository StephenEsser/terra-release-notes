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

  useLayoutEffect(() => {
    // Reset the scroll position when changing pages.
    scroll.current.scrollTop = 0;
  });

  return (
    <ContentContainer
      fill
      scrollRefCallback={(ref) => { scroll.current = ref; }}
      className={cx('release-notes', 'markdown-body')}
      header={<h1 className={cx('header')}>Terra Release Notes</h1>}
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
      <div dangerouslySetInnerHTML={{ __html: marked(releases[index - 1]) }} />
    </ContentContainer>
  );
};

export default ReleaseNotes;
