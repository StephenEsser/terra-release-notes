import React from 'react';
import IconSpinner from 'terra-icon/lib/icon/IconSpinner';
import classNames from 'classnames/bind';
import styles from './LoadingIndicator.module.scss';

const cx = classNames.bind(styles);

const LoadingIndicator = () => (
  <div className={cx('loading')}>
    <div>
      <IconSpinner className={cx('spinner')} isSpin height="36" width="36" />
      <span className={cx('message')}>
        Loading release notes...
      </span>
    </div>
  </div>
);

export default LoadingIndicator;
