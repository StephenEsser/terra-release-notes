import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Notes.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The component name.
   */
  component: PropTypes.string,
  /**
   * A link to the commit history for the release notes.
   */
  link: PropTypes.string,
  /**
   * An Array of release notes.
   */
  notes: PropTypes.object,
  /**
   * The repository.
   */
  repo: PropTypes.string,
  /**
   * The released version.
   */
  version: PropTypes.string,
};

const Notes = (props) => {
  const { component, link, notes, repo, version } = props;

  const releaseNotes = Object.keys(notes).map((heading) => (
    notes[heading].map((note) => (
      <div key={note} className={cx('note')}>
        <div className={cx('note-container')}>
          <strong className={cx('heading')}>{heading}</strong>
          <span>{` - ${note}`}</span>
        </div>
      </div>
    ))
  ));

  return (
    <div className={cx('notes')}>
      <div className={cx('title')}>
        <a href={link} className={cx('link')}>{`${component || repo} v${version}`}</a>
      </div>
      <div className={cx('release-notes')}>
        {releaseNotes}
      </div>
    </div>
  );
};

Notes.propTypes = propTypes;

export default Notes;
