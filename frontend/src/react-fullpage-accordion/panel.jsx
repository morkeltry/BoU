/* eslint-disable import/no-unresolved, no-unused-vars, import/extensions */
import React, { useContext } from 'react';
import cN from 'classnames';
import PanelContext from './panel-context';

const border = borderStyle => {
  let cssBorderStyle;

  switch (borderStyle) {
    case '1' : {
      cssBorderStyle = { border: '3px solid magenta', borderRadius: '10px' };
      break
    } 
    default : {
      cssBorderStyle = { border: '3px solid #d4d4', borderRadius: '10px' };      
    }
  }
  // return undefined if no styles to be added
  return Object.keys(cssBorderStyle) && cssBorderStyle

}


const Panel = ({
  children,
  background,
  itemId,
  flexWidthActive,
  flexWidthInactive,
  className,
  borderStyle,

}) => {
  const { activePanel, panelClick } = useContext(PanelContext);

  return (
    <div
      id={itemId}
      data-testid="panel"
      className={ cN( 'panel', activePanel === itemId && 'open open-active', className )}
      style={{
        ...{
          backgroundImage: `url("${background}")`,
          flex: activePanel ? flexWidthActive : flexWidthInactive,
        },
        ...border(borderStyle)
      }}
      onClick={() => panelClick(itemId)}
      onKeyDown={() => panelClick(itemId)}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
};

export default Panel;
