import React from 'react';
import cN from 'classnames';

const blocktime = 6000;
const days= (24*60*60*1000)/blocktime;


const offsetClass= {
  hovered: 'curve-demo__above-left'
}


const bezier= ({ a=0, b=0, c=0 })=> {
  console.log({ a,b,c },'=>');
  const f= x=> a*x*x + b*x + c;

  const x1 = -10, y1 = f(x1);
  const x2 = 10, y2 = f(x2);
  const cx = b? -b/(2*a) : 0;
  const cy = y1 + (cx - x1)*(2*a*x1 + b);

  console.log(x1,x2);
  console.log(y1,y2);
  console.log(cx,cy);
  
  const pathData = 'M ' + x1 + ' ' + y1 + ' Q ' + cx + ' ' + cy + ' ' +x2 + ' ' + y2;
  console.log({ a,b,c },'=>',pathData);
  return pathData
}

const CurveDemo = ({ hoverish, curve, buyPrice, offset, staticOnly, size='14rem' })=> {
console.log(staticOnly);
  return (
    <div className={ cN('curve-demo', hoverish&&'curve-demo__hoverish', offsetClass[offset]) }>    
      <svg height={ size } width={ size } x="0px" y="0px" viewBox="-15 -15 15 15" enableBackground="new -15 -15 15 15" >
        <path 
          d={ bezier(curve) } 
          stroke='black' strokeWidth='0.5' fill='none'
        />
      </svg>
      <h2>Curve looks like this</h2>
    </div>
  )}

export default CurveDemo;
