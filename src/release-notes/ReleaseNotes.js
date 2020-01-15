import React from 'react';
import marked from 'marked';
import classNames from 'classnames/bind';
import styles from './ReleaseNotes.module.scss';

const cx = classNames.bind(styles);

const ReleaseNotes = () => {
  return (
    <div className={cx('release-notes', 'markdown-body')} dangerouslySetInnerHTML={{ __html: marked('# Terra Release Notes') }} />
  )
}

export default ReleaseNotes;
