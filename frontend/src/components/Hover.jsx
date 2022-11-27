import React from 'react';
import cN from 'classnames';

let HOVERS_DISABLED = true;
// HOVERS_DISABLED = false;


const Hover = ({ children, onHoverChildren, hideOriginal }) => (
    <span className="hover aaa">
        <span className={ cN(hideOriginal && 'hover__no-hover') }>
            { children }
        </span>
        { !HOVERS_DISABLED &&
            <span className="hover__hover bbb">  
                { onHoverChildren } 
            </span>
        }
    </span>
)

export default Hover;
