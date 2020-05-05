import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ViewHub } from './fe/ViewHub';
import { ErrorBoundary } from './fe/ErrorBoundary';

ReactDOM.render(
  <ErrorBoundary>
    <ViewHub />
  </ErrorBoundary>,
  document.getElementById('root')
);
