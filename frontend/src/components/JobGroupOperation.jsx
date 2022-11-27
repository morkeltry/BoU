import React from 'react';
import cN from 'classnames';

// simple visual component
// May render:
// A single, set op with no params
// A single set op with params (THRESHOLD) - currently implemented outside of this component
// One of a row of unset ops
// The 'RESULT' icon, which will have an onClick attached to ins parent span outside of this component
const JobGroupOperation = ({ op, unset, params }) => (
  <div className={ cN('button', 'button__small-text', op==='RESULT' && 'jgop__result-button')}>
    { op }
  </div>
);

export default JobGroupOperation;
