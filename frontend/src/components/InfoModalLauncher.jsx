import React, { useContext } from 'react';
import ModalContext from '../containers/ModalContext';
import cN from 'classnames';

import CircleButton from '../components/CircleButton';

const InfoModalLauncher = ({ type, title, content, shiftClassName, modalClassName }) =>{
  const { modal, setModal } = useContext(ModalContext);

 return (
  <span className={ cN('modal-launcher right', shiftClassName) }
    onClick={ ()=>{ setModal({
        type: 'info',
        title,
        content,
        className: modalClassName,
      }); 
        console.log('setModal:',{ type, title, content, shiftClassName, modalClassName } );
      }
    }
  >  
    <CircleButton 
      logo='info'
      size="1.5rem"
      shiftclass='info__shift'
    />
  </span>
)}

export default InfoModalLauncher;
