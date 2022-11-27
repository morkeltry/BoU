import React from 'react';

const AddOracleButton = ({ onClick, disabled })=>(
  <CircleButton
    onClick={ ()=> {} }
    disabled={ disabled }
    hover="Add this oracle to the sale spec"
  >
    +
  </CircleButton>
);

export default AddOracleButton;
