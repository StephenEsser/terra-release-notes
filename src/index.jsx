import React from 'react';
import ReactDOM from 'react-dom';
import Base from 'terra-base';
import ReleaseNotes from './components/release-notes/ReleaseNotes';
import './index.module.scss';

ReactDOM.render(<Base locale="en"><ReleaseNotes /></Base>, document.getElementById('root'));
