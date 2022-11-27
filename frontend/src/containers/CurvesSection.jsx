import React, { useState, useContext } from 'react';
import cN from 'classnames';
import OfferContext from './OfferContext';
import ModalContext from './ModalContext';

import  { CurveDefiner, paramsList } from '../components/CurveDefiner';
import  CurveDefaults from '../components/CurveDefaults';
import  CurveDemo from '../components/CurveDemo';
import  InfoModalLauncher from '../components/InfoModalLauncher';
import { emptyCurve, curveString } from '../helpers';

import FoldSvg from '../components/FoldSvg';

const CurvesSection= ({ readOnly, asFullPage, activePanel, getters, setters=[] })=> {
  const { buyPriceSpec, setBuyPriceSpec } = useContext(OfferContext);
  const { modal, setModal } = useContext(ModalContext);

  // // NB ||[] below allows section to silently fail to output anything relevant - it could be worse ;)
  // let [
  //   depositCurve = emptyCurve(), 
  //   oppCostCurve = emptyCurve(), 
  //   assetInterestCurve = emptyCurve(), 
  //   releaseCurve = emptyCurve()  
  // ] = getters ||[];
  // const [setDepositCurve, setOppCostCurve, setAssetInterestCurve, setReleaseCurve] = setters;

  const [foldLevel, setFoldLevel] = useState(2);
  const setOneCurve = curveJsonName => update=> {
    const newState={ ...buyPriceSpec };
    newState[curveJsonName]=update;
    setBuyPriceSpec(newState);
  }
  const setDepositCurve = setOneCurve('sellerDepositCurve');  
  const setOppCostCurve = setOneCurve('opportunityCostCurve');  
  const setAssetInterestCurve = setOneCurve('buyerAssetInterestCurve');  
  const setReleaseCurve = setOneCurve('paymentReleaseCurve');

  ['sellerDepositCurve', 'opportunityCostCurve', 'buyerAssetInterestCurve', 'paymentReleaseCurve',]
    .forEach (curve=>{
      buyPriceSpec[curve]=buyPriceSpec[curve] || emptyCurve();
    });    

  return (
    <section id="curves-section">
      <span 
        className="abs-top-right__but-down-some"
        onClick={ ()=>{ setFoldLevel(!foldLevel); } }
      >

        { activePanel && <FoldSvg size="5rem"/> }
      </span>

      <div id="seller-deposit-curve" className={ cN('subsection', foldLevel && 'subsection__folded') }>
        <div>
          <div className={ cN('curve-subsection__header', foldLevel && 'curve-subsection__header__folded')}>
            <span className="h2-span-text"> Seller Deposit Curve             </span>
            <InfoModalLauncher
              className="left"
              type="info"
              title="Seller Deposit Curve"
              content={`       
                -optional
                -seller pays a deposit to prevent their walking away.
                -deposit may be significant - it should approximately equal buyer's lost interest if transaction fails.
                -curve drops quickly to zero but deposit is made before then, while curve amount is significant
                -the amount the seller pays may decrease with time or may remain constant and then drop to zero
                -time begins when the seller deposits and ends at the block where the buyer deposits a wrapped asset
                 (just like the seller opportunity cost curve)
                -after the buyer deposits the wrapped asset, the deposit may not be reclaimed until completion
                -deposit is refunded separately after completion or expiry
              `}
              />
          </div>
        </div>

        { readOnly
          ? <div>
              <h3>
                { Object.values(buyPriceSpec.sellerDepositCurve)
                    .some(x=> x)
                  && foldLevel
                  && <CurveDemo
                      curve={ buyPriceSpec.sellerDepositCurve } 
                      buyPrice={ buyPriceSpec.amount }                
                    />
                }
                { curveString(buyPriceSpec.sellerDepositCurve) }            
              </h3>
          </div>
          : !foldLevel && <>
              <CurveDefaults
                type="seller-deposit"
                buyPrice={ buyPriceSpec.amount }
                curve={ buyPriceSpec.sellerDepositCurve }
                setCurve={ setDepositCurve }
                hover= { ()=>{} }
              />
              <CurveDefiner
                type="seller-deposit"          
                curve={ buyPriceSpec.sellerDepositCurve }
                setCurve={ setDepositCurve }
              />
            </> }
      </div>
    
      <div id="opportunity-cost-curve" className={ cN('subsection', foldLevel && 'subsection__folded') }>
        <div>
          <div className={ cN('curve-subsection__header', foldLevel && 'curve-subsection__header__folded')}>
            <span className="h2-span-text">Seller's Opportunity Cost Curve      </span>
            <InfoModalLauncher
              className="left"
              type="info"
              title="Seller's Opportunity Cost Curve"
              content=  {`     
                -optional 
                -incentivises the buyer to deposit quickly
                -small bonus, added to the amount reclaimable by the seller on completion
                -the bonus for the seller increases with time
                -time  starts when the seller pays a deposit (or no deposit) and stops when the buyer deposits the asset
                 (just like the seller deposit curve)
                -may include a quadratic term so that extreme lateness carries a large penalty
                -has a maximum which defaults to amount of seller's deposit.
                -if this bonus swallows the seller's deposit, the transaction is effectively cancelled
              `}
            />
          </div>
        </div>

        { readOnly
          ? <div>
              <h3>
                { Object.values(buyPriceSpec.opportunityCostCurve)
                    .some(x=> x)
                  && <CurveDemo
                      curve={ buyPriceSpec.opportunityCostCurve } 
                      buyPrice={ buyPriceSpec.amount }                
                    />
                }
                { curveString(buyPriceSpec.opportunityCostCurve) }            
              </h3>
          </div>
        : !foldLevel && <>
            <CurveDefaults
              type="sellers-opp-cost"
              buyPrice={ buyPriceSpec.amount }
              curve={ buyPriceSpec.opportunityCostCurve }
              setCurve={ setOppCostCurve }
              hover= { ()=>{} }
            />
            <CurveDefiner
              type="sellers-opp-cost"
              curve={ buyPriceSpec.opportunityCostCurve }
              setCurve={ setOppCostCurve }
            />
          </> }
      </div>

      <div id="rent-curve" className={ cN('subsection', foldLevel && 'subsection__folded') }>
        <div>
          <div className={ cN('curve-subsection__header', foldLevel && 'curve-subsection__header__folded')}>
            <span className="h2-span-text">Asset Interest Curve     </span>            
              <InfoModalLauncher
                className="left"
                type="info"
                title="Asset Interest ('Rent') Curve"
                content={`        
                  -optional 
                  -incentivises the seller to complete transfer quickly
                  -significant cost-per-time for exceeding expected transfer time
                  -amount deducted from sale price on release, up to the full sale price (so that seller would receive nothing)
                  -time starts when the buyer deposits payment asset and stops when the seller registers completion successfully
                  -oracle answers include a timestamp, being the time of completion of transaction. Therefore the seller should use the earliest successful oracle answer to release payment
                  -may include a quadratic term used for specifying the point at which a late or walkaway seller's fee heads to zero.
                  -no maximum, since  ...
                  -if this bonus swallows the seller's deposit, the transaction is effectively cancelled
                `}
              />
          </div>
        </div>

        { readOnly
          ? <div>
              <h3>
                { Object.values(buyPriceSpec.buyerAssetInterestCurve)
                    .some(x=> x)
                  && <CurveDemo
                      curve={ buyPriceSpec.buyerAssetInterestCurve } 
                      buyPrice={ buyPriceSpec.amount }                
                    />
                }
                { curveString(buyPriceSpec.buyerAssetInterestCurve) }            
              </h3>
          </div>
        : !foldLevel && <>
            <CurveDefaults
              type="buyers-asset-interest"
              buyPrice={ buyPriceSpec.amount }
              curve={ buyPriceSpec.buyerAssetInterestCurve }
              setCurve={ setAssetInterestCurve }
              hover= { ()=>{} }
            />
            <CurveDefiner
              type="buyers-asset-interest"
              curve={ buyPriceSpec.buyerAssetInterestCurve }
              setCurve={ setAssetInterestCurve }
            />
          </> }
      </div>

      <div id="payment-release-curve" className={ cN('subsection', foldLevel && 'subsection__folded') }>
        <div>
          <div className={ cN('curve-subsection__header', foldLevel && 'curve-subsection__header__folded')}>
            <span className="h2-span-text ">Payment Release Curve   </span>
            <InfoModalLauncher
              className="left"
              type="info"
              title="Payment Release Curve"
              content={`
                -optional
                -provides some protection against bait-and-switch
                -delays release of funds even after successful completion to allow buyer time to activate dispute
                -time begins when the seller registers sucessful completion
                -the amount withheld from the seller should decrease to zero
              `}
            />
          </div>
        </div>

        { readOnly
          ? <div>
              <h3>
                { Object.values(buyPriceSpec.paymentReleaseCurve)
                    .some(x=> x)
                  && <CurveDemo
                      curve={ buyPriceSpec.paymentReleaseCurve } 
                      buyPrice={ buyPriceSpec.amount }                
                    />
                }
                { curveString(buyPriceSpec.paymentReleaseCurve) }            
              </h3>
          </div>
        : !foldLevel && <>
            <CurveDefaults
              type="payment-release"
              buyPrice={ buyPriceSpec.amount }
              curve={ buyPriceSpec.paymentReleaseCurve }
              setCurve={ setReleaseCurve }
              hover= { ()=>{} }
            />
            <CurveDefiner
              type="payment-release"
              curve={ buyPriceSpec.paymentReleaseCurve }
              setCurve={ setReleaseCurve }
            />
          </> }
      </div>
    </section>
)}

export default CurvesSection;
