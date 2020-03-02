import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Timeline.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * An array of release notes sorted by date.
   */
  releaseNotes: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * The date of the release.
       */
      date: PropTypes.string,
      /**
       * The release notes for the date.
       */
      notes: PropTypes.node,
    }),
  ),
};

const Timeline = (props) => {
  const { releaseNotes } = props;

  return releaseNotes.map(({ date, notes }) => (
    <div className={cx('release')} key={date}>
      <div className={cx('date')}>
        {date}
      </div>
      <div className={cx('notes')}>
        {notes}
      </div>
    </div>
  ));
};

Timeline.propTypes = propTypes;

export default Timeline;
