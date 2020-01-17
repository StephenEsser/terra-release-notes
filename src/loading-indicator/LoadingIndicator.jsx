import React from 'react';
import classNames from 'classnames/bind';
import styles from './LoadingIndicator.module.scss';

const cx = classNames.bind(styles);

const LoadingIndicator = () => (
  <div className={cx('loading')}>
    Loading release notes...
  </div>
);

export default LoadingIndicator;
