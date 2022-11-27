import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';

import Routes from './Routes';

import 'semantic-ui-css/semantic.min.css';
import './react-fullpage-accordion/react-fullpage-accordion.css';

import vousSortez from './assets/vous_sortez-old-2592x1680.jpg';
import titlePng from './assets/title-uppercase.png';
import { titleLowercaseBase64, titleUppercaseBase64, titleAllCapsBase64 } from './assets/titlesBase64.js';
console.log(typeof titleAllCapsBase64, titleAllCapsBase64.length);
import './style.css';



const App = () => (
  <BrowserRouter>
    <main className="container"
    
          style={{ backgroundImage: `url("${vousSortez}")` }}
    >
      <div className="titlebar">
        {/* <img src={ titlePng } /> */}
        <div className="titlebar-image-spacer" />
        <img 
          className="center-margin-auto"
          style={{ width: '60%' }}
          src={ "data:image;base64,"+titleAllCapsBase64 } 
        />
        <ul className="left titlebar">
          <li>
            <Link to="/register">Seller Flow (register offer)</Link>
          </li>
          <li>
            <Link to="/buyer">Buyer Flow</Link>
          </li>
          <li>
            <Link to="/claim">Seller Flow (claim payment)</Link>
          </li>
        </ul>
        <Routes />
        {/* <div className="titlebar-image-spacer"></div> */}
      </div>
    </main>
  </BrowserRouter>
);

export default App;
