import React, { useState } from 'react';
import cN from 'classnames';

import { safeNewVal } from '../helpers';

const paramsList = type=>{
  let params;
  switch (type) {
    case 'seller-deposit':
      return ['c','expiry']
    case 'sellers-opp-cost':
      return ['b','a','aStart','aSteep','max']
    case 'buyers-asset-interest':
      return ['b','bStart','a','aStart','aSteep']
    case 'payment-release':
      return ['c','b','a','aStart','aSteep']
    default:
      return ['a','b','c']
  }
}

const emptyCurve = type =>{
  const curve = {}; 
  paramsList(type).forEach(param=>{
    switch (param) {
      case 'max':
        return curve[param]=null    
      case 'aStart':
        return curve[param]=null    
      default:
        return curve[param]=0
    }
  })
  return curve  
}

const defaults = type=> params=> {
  const curve=emptyCurve(type);

  switch (type) {
    case 'seller-deposit':
      // Nothing to calculate. Just use provided or default values
      return ({ params })=>({
        ...curve,
        ...params
      })
    case 'sellers-opp-cost':
      // If aStart is numeric, then use either aSteep or expiry to calculate the other
      // (you will need b)
      return ({ b, a, aStart, aSteep, max, expiry , fullPrice })=>{
        
        return curve
      }
    case 'buyers-asset-interest':
      // calculate c=-b*bStart;
      // If aStart and fullPrice are numeric, then use either aSteep or expiry to calculate the other
      // (you will need b & c)
      return ({ c, b, a, aStart, aSteep, expiry, fullPrice})=>{
        
        return curve        
      }
    case 'payment-release':
      // c defaults to fullPrice if set;
      // If aStart is numeric, then use either aSteep or expiry to calculate the other
      // (you will need b & c)
      return ({ c, b, a, aStart, aSteep, expiry, fullPrice })=>{
        
        return curve        
      }
    default:
      return ({ params })=>({
        ...curve,
        ...params
      })
  }
}


      //     type="seller-deposit"       
      //   -optional
      //   -seller pays a deposit to prevent their walking away.
      //   -the amount the seller pays may decreases with time or may remain constant and then drop to zero
      //   -time begins when the seller deposits and ends at the block where the buyer deposits a wrapped asset
      //   -after the buyer deposits the wrapped asset, the deposit may not be reclaimed until completion
      //   -deposit is separately refunded after completion (or expiry)

      //     type="sellers-opp-cost"
      //   -optional 
      //   -incentivises the buyer to deposit quickly
      //   -bonus, added to the amount reclaimable by the seller on completion
      //   -the bonus for the seller increases with time
      //   -time  starts when the seller pays a deposit and stops when the buyer deposits the asset
      //   -may include a quadratic term so that extreme lateness carries a large penalty
      //   -alternatviely, may be swallow the seller's deposit so that the transaction is effectively cancelled

      //     type="buyers-asset-interest
      //   Asset Interest (Opportunity Cost) Curve
      //   -incentivises the seller to act quickly
      //   -subtracted from the amount reclaimable by the seller on completion
      //   -the amount subtracted from the seller's payment increases with time
      //   -time stops when the seller registers sucessful completion
      //   -should include a quadratic term so that extreme lateness carries a large penalty
      
      //     type="payment-release"          
      //   Payment Release Curve
      //   -optional
      //   -provides some protection against bait-and-switch
      //   -delays release of funds even after successful completion to allow buyer time to activate dispute
      //   -time begins when the seller registers sucessful completion
      //   -the amount withheld form the seller should decrease to zero


const curveIsUnset = (curve, type)=> {

  return !paramsList(type).some(param=>curve[param])
}

const InSpan = ({ children, notInSpan })=>
  notInSpan
    ? children
    : <div className="curve-subsection__bottom">
        { children }
      </div>


const CurveDefiner = ({ curve={}, setCurve=()=>{}, type }) => {
  const [showInputs, setShowInputs] = useState(false);
  
  const paramsLists=[];
  paramsLists[0]=[...paramsList(type)];
  paramsLists[1]=paramsLists[0].splice(3);
  const lastGroup= paramsLists[1].length? 1 : 0 ;
  // const lastGroup='supress';
  
  
  return ( <> 
    { [0,1].map(el=> paramsLists[el].length &&
      <InSpan
        notInSpan={ el!=lastGroup }
      >
        <span 
          className={ cN("row__standard-height curve-definer big-rl-margins", curveIsUnset(curve, type) && !showInputs && 'semitransparent') } 
          onClick={ ()=>{ console.log('clicky click');    setShowInputs(true); } }
        >
          { paramsLists[el].map(param=>
            <span className="" key={ type+param }
            >
              { param }      
              <input type="number"
                // size= { curve[param] && curve[param].toString().length>=4 ? Math.max(3+curve[param].toString().length/4, 8) : "3" }
                size= { curve[param] && curve[param].toString().length>=4 ? 8 : "3" }
                text={ curve[param] }
                value={ curve[param] }
                onChange={ (newVal)=> { 
                  let amount = safeNewVal(newVal);
                  if (isFinite(amount)) { 
                    const state={ ...curve }; 
                    state[param]=amount; 
                    setCurve(state);
                  }
                }}
              />
            </span>
          
          )



          }
        </span>
        { false &&  // can't get them to stay in one place!!
          el==lastGroup && !showInputs && curveIsUnset(curve, type) && 
          <div 
            className={ cN('button__z2-semitransparent', lastGroup&&'button__z2-semitransparent__higher' ) } 
            onClick={ ()=>{ console.log('clicky click');    setShowInputs(true); } }
          >
            SET CURVES
          </div>
        }
      </InSpan>
    )} 
    </>
)};

export { CurveDefiner, paramsList };
