import React from 'react';
import logoETH from '../assets/ETH.svg';

const logos={
  'Wrapped ETH' : size=>
    <svg height={ size } width={ size } x="0px" y="0px" viewBox="0 0 1920 1920" enableBackground="new 0 0 1920 1920" >
      <g>
        <circle cx="960" cy="960" r="912"stroke="white" strokeWidth="96" fill="transparent" />
        <circle cx="960" cy="960" r="864" fill="#cdfb" />
        <polygon fill="#8A92B2" points="959.8,80.7 420.1,976.3 959.8,731  "/>
        <polygon fill="#62688F" points="959.8,731 420.1,976.3 959.8,1295.4  "/>
        <polygon fill="#62688F" points="1499.6,976.3 959.8,80.7 959.8,731  "/>
        <polygon fill="#454A75" points="959.8,1295.4 1499.6,976.3 959.8,731  "/>
        <polygon fill="#8A92B2" points="420.1,1078.7 959.8,1839.3 959.8,1397.6  "/>
        <polygon fill="#62688F" points="959.8,1397.6 959.8,1839.3 1499.9,1078.7  "/>
      </g>
    </svg> ,

  'KYC token' : size=>
    <svg height={ size } width={ size }  viewBox="200 345 484 445" preserveAspectRatio="none" version="1.1">
      <g id="surface1" transform="translate(150,150)">
      <circle cx="342" cy="395" r="170" stroke="white" strokeWidth="10" fill="transparent" />
      <circle cx="342" cy="395" r="160" stroke="black" strokeWidth="10" fill="#effe" />
      <path stroke ="none" fillRule="evenodd" fill="rgb(0%,0%,36%)" fillOpacity="1" 
        d="M 216 362.8 L 229.4 362.9 L 229.4 392.2 
        L 230.1 392.2 L 269.6 362.8 L 290 362.7 
        L 244.4 395.0 L 290.2 429 L 269.9 429 
        L 230.2 399.7 L 229.4 399.7 L 229.3 429 
        L 216 429 L 216 362.8 "/>
      <path stroke ="none" fillRule="evenodd" fill="rgb(0%,0%,36%)" fillOpacity="1"  
        d="M 343.6 387.4 L 375.5 362.8 L 396 362.7 
        L 350.1 396.1 L 350.1 429 L 336.8 429 
        L 336.8 396.1 L 291 362.7 L 311.4 362.8 
        L 343.6 387.4 "/>
      <path stroke ="none" fillRule="evenodd" fill="rgb(0%,0%,36%)" fillOpacity="1"  
        d="M 468 387 A 50 35 0 1 0 468 413
          L 455 413 A 37 28.5 0 1 1 455 387
          L 468 387" />
      <path stroke ="none" fillRule="evenodd" fill="rgb(86.3%,0%,0.4%)" fillOpacity="1"  
        d="M 311.1 395.2 L 291.6 409.3 L 272 395.2 
        L 291.6 381 L 311.1 395.2 "/>
      <ellipse stroke ="none" fillRule="evenodd" fill="rgb(86.3%,0%,0.4%)" fillOpacity="1" 
        cx="423" cy="400" rx="17.5" ry="12.5" />
      </g>
    </svg>
}


const AssetLogo = ({ asset, size='2rem' }) => (
  <span
    style={{ margin: '0.5rem', position: 'relative', top: '0.35rem' }}
  >
    { logos[asset](size) }
  </span>
);

export default AssetLogo;
