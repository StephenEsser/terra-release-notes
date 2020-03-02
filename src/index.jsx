import React from 'react';
import ReactDOM from 'react-dom';
import Base from 'terra-base';
import ReleaseNotes from './components/release-notes/ReleaseNotes';

import './index.module.scss';

const Application = () => (
  <Base locale="en">
    <ReleaseNotes />
  </Base>
);

ReactDOM.render(<Application />, document.getElementById('root'));
