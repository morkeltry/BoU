import React from 'react';
import Hover from './Hover';
import CurveDemo from './CurveDemo';

const blocktime = 6000;
const days= (24*60*60*1000)/blocktime;

const paramsList = type=>{
  let params;
  switch (type) {
    case 'seller-deposit':
      return ['b','c','expiry']
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

const optionsList = (type, buyPrice=1)=> {
  switch (type) {
    case 'seller-deposit':
      return [
        {
          name : 'No deposit',
          curve : emptyCurve(type)
        },
        {
          name : '10% deposit',
          curve : { ...emptyCurve(type), c:0.1*buyPrice }
        },
        {
          name : '20% deposit\npayment within 1 day',
          curve : { ...emptyCurve(type), c:0.2*buyPrice, expiry: 1*days }
        }
      ] ;
    case 'sellers-opp-cost':
      return [
        {
          name : 'No penalty for slow payment',
          curve : emptyCurve(type)
        },
        {
          name : 'no slow payment charge until 10 days\nthen quadratic: 0.2%-> 0.8%-> 1.8%',
          curve : { ...emptyCurve(type), a:0.002*buyPrice/(days*days) , aStart:10*days , aSteep:0 }
        },
        {
          name : '0.2% p.d. slow payment charge\n quadratic penalty after 10 days',
          curve : { ...emptyCurve(type), b:0.002*buyPrice/days , a:0.002*buyPrice/(days*days) , aStart:10*days , aSteep:0 }
        }
      ] ;
    case  'buyers-asset-interest':
      return [
        {
          name : 'No penalty for slow completion',
          curve : emptyCurve(type)
        },
        {
          name : '0.25% p.d. incentivisation',
          curve : { ...emptyCurve(type), b:0.0025*buyPrice/days }
        },
        {
          name : '0.05% p.d. incentivisation from 21 days\n quadratic penalty after 42 days',
          curve : { ...emptyCurve(type), b:0.0005*buyPrice/days , bStart:21*days, a:0.0005*buyPrice/(days*days) , aStart:42*days }
        }
      ] ;
    case  'payment-release':
      return [
        {
          name : 'Full payment release on completion',
          curve : emptyCurve(type)
        },
        {
          name : '7 day full lockup challenge period',
          curve : { ...emptyCurve(type), a:-999*buyPrice, aStart: 7*days }
        },
        {
          name : 'Linear payment release over 70 days',
          curve : { ...emptyCurve(type), b:buyPrice*(1-(1/70)/days) }
        }
      ] ;
      default:
        return [];
  }
}

const CurveDefaults = ({ curve={}, setCurve=()=>{}, type, buyPrice }) => (
  <div  className="row__standard-height row__force-narrow-children">
    { optionsList(type, buyPrice).map(option=>
      <span className="" key={ `${type}-${option.name}` }
      >
        <Hover
          onHoverChildren={ <CurveDemo staticOnly curve={ option.curve } offset="hovered" /> }
        >
          <div 
            className="button button__small-text button__very-small-text button__curves-button__shift-up"
            onClick={ ()=>{ setCurve(option.curve) } }  

          >
            { option.name }
          </div>
        </Hover>
      </span>
    
    )



    }
  </div>
);

export default CurveDefaults;
