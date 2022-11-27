import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import OverviewDiagram from './OverviewDiagram';
// import Diagram, { useSchema, createSchema } from 'beautiful-react-diagrams';

import munchkins from './assets/mnuchin-dollars.jpg';


import Routes from './Routes';

import reactLogo from './assets/React-icon.png';

const App = () => (
  <BrowserRouter>
    <main className="container">
      <div className="bg-image" style={{backgroundImage: `url(${munchkins})`, minHeight: '35%' }}>
        <div className='spacer7rem' />
        <h1 className='diagram-header'> Mnuchain </h1>
        {/* <img className="container__image" alt="mnunchkin" src={mnuchain} /> */}
      </div>      
      <OverviewDiagram />
    </main>
  </BrowserRouter>
);

export default App;
