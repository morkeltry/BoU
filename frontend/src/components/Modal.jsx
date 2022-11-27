import React, { useContext } from 'react';
import cN from 'classnames';
import ModalContext from '../containers/ModalContext';

import CircleButton from './CircleButton';

const formatJson = json=> {
  return (Object.keys(json)
    .map(key=> `${key}:${JSON.stringify(json[key])}`)
    .join('\n')
  )
}


const Modal = () =>{
  const { modal, setModal } = useContext(ModalContext);
  const { type, title, content, className } = modal || {};

  console.log(cN('modal', className ));

  return (
    <div className="modal-container">
      { modal &&
        <div className={ cN('modal', className ) }>
          <section className="modal-title">
            { title }
          </section>
          <section>
            { 
              (type==='json')
              ? formatJson(content)
              : (type==='json')
                ? content
                : content 
            }
          </section>
          <span 
            className="abs-top-right"
            onClick={ ()=>{ setModal(null); } }  
          >
            <CircleButton logo="close" />      
          </span>
        </div>   
      }
    </div>
)}

export default Modal;
