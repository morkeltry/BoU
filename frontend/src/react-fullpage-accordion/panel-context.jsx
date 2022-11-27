/* eslint-disable react/forbid-prop-types, no-unused-vars, import/no-unresolved, import/extensions */
import React, { useState } from 'react';

const PanelContext = React.createContext({
  activePanel: '',
  panelClick: (itemId) => null,
});

let surpress=0;

export const PanelContextProvider = ({
  children,
}) => {
  const [activePanel, setActivePanel] = useState('jobs-panel');
  const [supressPanelClickUntil, setSupressPanelClickUntil] = useState(0);

  const panelClick = (itemId, opts={} ) => {
    // fold back active panel if clicked
    // const value = itemId === activePanel ? '-1' : itemId;
    // or don't
    console.log(itemId,'click at:',Date.now(),'suppress before:',supressPanelClickUntil,'or',surpress);
    if (opts.force || Date.now()>supressPanelClickUntil && Date.now()>surpress) {
      const value = itemId;
      setActivePanel(value);
      setSupressPanelClickUntil(Date.now()+50);
      surpress=Date.now()+50
      console.log(itemId,'at:',Date.now(), ' click suppression requested of setState until',Date.now()+50);

      console.log(`panelClick${itemId}`);
    } else {
      console.log('panelClick supressed at ', Date.now());
    }
    return null;
  };

  return (
    <PanelContext.Provider
      value={{
        panelClick,
        activePanel,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
};

export default PanelContext;
