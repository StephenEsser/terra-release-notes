import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import ContentContainer from 'terra-content-container';
import Paginator from 'terra-paginator/lib/ControlledPaginator';
import LoadingIndicator from '../loading-indicator/LoadingIndicator';
import fetchMarkdown from '../fetch-markdown/fetch-markdown';
import styles from './ReleaseNotes.module.scss';

const cx = classNames.bind(styles);

const ReleaseNotes = () => {
  const markdown = useRef();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetchMarkdown().then((result) => {
      markdown.current = result;
      setIndex(1);
    });
  }, []);

  return (
    <ContentContainer
      fill
      className={cx('release-notes', 'markdown-body')}
      header={<h1 className={cx('header')}>Terra Release Notes</h1>}
      footer={(
        <div className={cx('footer')}>
          <Paginator
            onPageChange={setIndex}
            selectedPage={index}
            totalCount={markdown.current ? markdown.current.length : 0}
            itemCountPerPage={1}
          />
        </div>
      )}
    >
      {markdown.current && <div dangerouslySetInnerHTML={{ __html: markdown.current[index - 1] }} />}
      {!markdown.current && <LoadingIndicator />}
    </ContentContainer>
  );
};

export default ReleaseNotes;
