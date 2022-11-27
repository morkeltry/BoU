/* eslint-disable react/forbid-prop-types, no-unused-vars, import/no-unresolved, import/extensions */
import React, { useState, useContext } from 'react';
import cN from 'classnames';
// import 'normalize.css';
import { PanelContextProvider } from './panel-context';
import ModalContext from '../containers/ModalContext';


const FullpageAccordion = ({
  children,
  height,
}) => {
  const { offScreenPanels, setOffScreenPanels } = useContext(ModalContext);

  return (
    <PanelContextProvider>
      <div
        className={ cN('panels', offScreenPanels && 'transition-off-top') }
        data-testid="panels"
        style={{ height: height || '100vh' }}
      >
        {children}
      </div>
        {/* <div className="button" onClick={()=> setOffScreenPanels(false)}>BRING IT BACK</div> */}
    </PanelContextProvider>
  );
};

export default FullpageAccordion;
