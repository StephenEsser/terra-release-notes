import React, { useState, useEffect } from 'react';
import marked from 'marked';
import classNames from 'classnames/bind';
import releaseNotes from './ReleaseNotes.md';
import styles from './ReleaseNotes.module.scss';

const cx = classNames.bind(styles);

const ReleaseNotes = () => {
  const [markdown, setMarkdown] = useState();

  useEffect(() => {
    fetch(releaseNotes).then(response => response.text()).then((text) => {
      setMarkdown(marked(text));
    })
  }, []);

  if (markdown) {
    return <div className={cx('release-notes', 'markdown-body')} dangerouslySetInnerHTML={{ __html: markdown }} />;
  }

  return (
    <div className={cx('loading')}>
      Loading release notes...
    </div>
  )

};

export default ReleaseNotes;
