import React from 'react';
import cN from 'classnames';

const circleFill= {
  add : '#2d6',
  remove: '#f22', 
  next: '#8d7b', 
  info: '#4dfd',
  downarrow: '#828d',
  close: '#f40',
  locked: '#ad8',
  unlocked: '#ea2',
}

const iconPath= {
  add : 'M10,5 v10 M5,10 h10',
  remove: 'M5,10 h10', 
  next: 'M7,7.5 L15,10 L7,12.5 M7,6 L15,10 L7,14', 
  nextGreyed: 'M7,7.5 L15,10 L7,12.5 M7,6 L15,10 L7,14', 
  info: 'M10,8 v8 M11,5 L9,7',
  downarrow: 'M10,5 v10 M10,15 l2.5,-2.5 M10,15 l-2.5,-2.5',
  close: 'M6,6 L14,14 M6,14 L14,6',
  locked: 'M6,9.5 h8 v5 h-8 v-5 M7 9.5V6a2.5 2.5 0 0 1 5.4 3', 
  unlocked: 'M6,9.5 h8 v5 h-8 v-5 M7 9.5V5.5a2.5 2.5 0 0 1 5.4 1',
}

const paler= color=> {
  switch (color) {
    case 'black': return '#8888';
    case '#2d6': return '#5b8a'
  }
}

const CircleButton = ( { logo, size="2rem", shiftClass, disabled } ) => (
  <span 
     className={ cN(shiftClass) }
    style={{ height: size, width: size }}
  >
    <svg height={ size } viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" stroke={ disabled? paler("black") : "black"} strokeWidth="1.5" fill= { disabled? paler(circleFill[logo]) : circleFill[logo] } />
      <path d={ iconPath[logo] }  stroke={ disabled? paler("black") : "black"} strokeWidth="1.5" fill="none"/>
    </svg> 
  </span>
);

export default CircleButton;
