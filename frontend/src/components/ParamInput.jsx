import React from 'react';

const ParamInput = ({ paramName, required, type, value, setParam }) => (
  <div className="inputs-set">
    <div className="params-child grid-40-60"> 
      <span 
        className="params-child-left" 
        style={{ width:'100%' }}
        key={`paramName:${paramName}`}
      >
      { `${paramName}: ` }
      </span>
      <input 
        type="text"
        size="50"
        // value={ value }
        onChange={ ev=>{ setParam(ev.target.value); } }
      />

    </div>
  </div>
);

export default ParamInput;
