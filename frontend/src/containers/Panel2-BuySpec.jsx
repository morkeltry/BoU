import React, { useState, useContext } from 'react';
import { JSEncrypt } from 'jsencrypt'
import cN from 'classnames';

import { Panel } from '../react-fullpage-accordion';
import DownloadLink from "react-download-link";
import OfferContext from './OfferContext';
import ModalContext from './ModalContext';
import PanelContext from '../react-fullpage-accordion/panel-context';

import CurvesSection from './CurvesSection';

import  AssetLogo from '../components/AssetLogo';
import  { CurveDefiner, paramsList } from '../components/CurveDefiner';
import  CurveDefaults from '../components/CurveDefaults';
import  CircleButton from '../components/CircleButton';
import  InfoModalLauncher from '../components/InfoModalLauncher';

// WOW!!! semantic-ui wants to make life hard!
// Note the casing - Dropdown in the filename (which, incidentally, you have to link the path all the way to like it's the 90's)
// filename: Dropdown (/index.js) ; Component name: DropDown
import DropDown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';

import munchkins from '../assets/3munchkins.jpg';
import dollarMunchkin from '../assets/mnuchin-dollars.jpg';
import cityOfOz from '../assets/oz-city-limits.jpg';
import curvyBridge from '../assets/curvy-bridge-3.jpeg';
import curves from '../assets/curves-music-1.jpeg';
import logoEth from '../assets/ETH.svg';
import logoKycoin from '../assets/kycoin.svg';

import { verifyEncrypted, pubkeyFromPem, encrypt, hash } from '../helpers/crypto';
import { readSelectedFile } from '../helpers/asyncRequests';
import { emptyCurve, nowt, safeNewVal } from '../helpers';
import { wrappedAssets } from '../assets/content/stuff';

const assets=[
  { name:'Wrapped ETH', logo: logoEth },
  { name:'KYC token', logo: logoKycoin }
]

const BuySpecPanel = ({ readOnly }) => {

console.log('readOnly', readOnly);

  const [amount, setAmount]= useState('1.000');

  const [depositCurve, setDepositCurve]= useState(emptyCurve());
  const [oppCostCurve, setOppCostCurve]= useState(emptyCurve());
  const [assetInterestCurve, setAssetInterestCurve]= useState(emptyCurve());
  const [releaseCurve, setReleaseCurve]= useState(emptyCurve());

  const [pubkey, setPubkey]= useState(null);
  const [offerId, setOfferId] = useState(null);
  const [encrypted, setEncrypted] = useState(null)

  const { offer, setOffer, buyPriceSpec, setBuyPriceSpec } = useContext(OfferContext);
  const { modal, setModal, setOffScreenPanels } = useContext(ModalContext);
  const { activePanel } = useContext(PanelContext);


  const offerValid = ()=>
    offer.length && buyPriceSpec.assetName && buyPriceSpec.amount
    || console.log(offer.length, buyPriceSpec, buyPriceSpec.assetName, buyPriceSpec.amount, offer.length && buyPriceSpec.assetName && buyPriceSpec.amount);

  const doEncrypt = (pubkey, offer, buyPriceSpec)=> {
    const encrypted = encrypt(JSON.stringify({
      unencrypted: offer,
      buyPriceSpec 
    }), pubkey);
    setEncrypted(encrypted);
    setOfferId(hash(encrypted));
  }

  const nada = ()=> ev=> {
    ev.preventDefault();
    ev.stopPropagation();
  };

  // TODO: remove extr aimplementation in <input> file onClick
  let [handleDragOver ,handleDragEnter ,handleDragLeave ] = [nada(),nada(),nada(),nada()];
  const handleDrop = ev => {
    ev.preventDefault();
    ev.stopPropagation();
    console.log(arse);
    console.log('Got drop!');
    readAndprocessFiles({
      'pem': pubkey=> { 
        setPubkey(pubkeyFromPem(pubkey)); 
        if (offerValid()) 
          doEncrypt(pubkeyFromPem(pubkey), offer, buyPriceSpec) 
      }
    }) (ev);
  }




  const OracleDropdownItem= ({ children = ['Oh HAI'], asset, size='3rem', onClick })=> (
    <div 
      className="item grid-5-1 dropdown-item__size "
      role="option"
      onClick={ onClick }  
    >
      <span className="text" style={{ maxWidth:'100%' }}>
        { children }
      </span>
      {/* <span 
        className="abs-right"  
        style={{ minWidth:'3rem' , width:'3rem' }}
      > 
      </span> */}
      <span 
        className="abs-right"  
        style={{ minWidth:'3rem' }}
      >
        <AssetLogo asset={ asset.name } size={ size } /> 
      </span>
    
    </div>
  )

  return (<Panel 
    itemId="buyspec-definition-panel"
    background={ curves }>
      <h2 className="section-title dark-text">Payment Terms</h2>



      <section id="payment-asset">
        { readOnly
        ? <div>
            { [ assets.find(asset=> asset.name===buyPriceSpec.assetName) 
                || {name:' No Payment Asset specified :/', amount: 0}
              ].map( asset=>(
                <div>
                  { asset.logo && <img src={ asset.logo } /> }{ asset.name }{ asset.amount }
                </div>
              ))
            }        
          </div>
        : <>
            <DropDown text={ buyPriceSpec.assetName || 'Select wrapped assets' } >
              <DropDown.Menu>
                { assets.map((asset, idx)=>(
                  <DropDown.Item 
                    key={ idx } 
                    text={ asset.name } 
                    value={ asset.name } 
                    as = {()=> 
                      <OracleDropdownItem 
                        onClick={ ()=>{ 
                          console.log({ assetName:asset.name, amount });
                          setBuyPriceSpec(state=>({ ...state, assetName:asset.name }) );
                        } }
                        asset={ asset }
                      >
                        { asset.name }
                      </OracleDropdownItem>    
                    }
                    { ...asset } 
                    onClick={ ()=>{ //doesn't get touched
                      console.log({ assetName:asset.name, amount });
                      setBuyPriceSpec({ assetName: 'UNEXPECTEDLY passed thorough click from top layer!', amount });
                    } } 
                  />
                ))}
              </DropDown.Menu>
            </DropDown>
            <div
              style={{ padding: '0.5rem' }}
            >
              { buyPriceSpec.assetName && <AssetLogo asset={ buyPriceSpec.assetName }/> }

              <input type="number"
                className=""
                size="3"
                placeholder= "asset amount"
                value={ buyPriceSpec.amount === undefined ? 0 : buyPriceSpec.amount }
                onChange={ (newVal)=>{ 
                  let amount = safeNewVal(newVal);
                  if (isFinite(amount) && amount>=0) { console.log(amount, newVal); setBuyPriceSpec(state=>({ ...state, amount }) ); }} 
                }

                // onChange={ (amount)=>{ 
                //   console.log(amount); 
                //   setBuyPriceSpec(state=>({ ...state, amount }) ); 
                // } }              
              />
            </div>
          </>
        }
      </section>

      <CurvesSection
        readOnly={ readOnly }
        activePanel={ activePanel==='buyspec-definition-panel' }
        // asFullPage={ asFullPage }
        // getters={ [depositCurve, oppCostCurve, assetInterestCurve, releaseCurve] }
        // setters={ [setDepositCurve, setOppCostCurve, setAssetInterestCurve, setReleaseCurve] }
      />

      <section id="disputes-mechanism">
        <div>
            <span className="h2-span-text "> 
                Arbitrators 
            </span> 
            <span  className="width-one-third" style={{ constantHeight:true, marginLeft: '1rem' }}>
              <InfoModalLauncher
                className={ cN( pubkey && 'greyed') }
                type="info"
                title="Arbitration contract"
                content={`       
                  For high value transactions, a buyer should be aware that oracles may have vulnerabilities,
                  web 2.0 APIs may temporarily report incorrect states, and oracles job runs can be wrongly specified.
                  In order to plug in a third party dispute mechanism, first ensure that a Payment Release Curve is set, 
                  to provide a time window in which to challenge the sale completion after it is registered.
                `}
                
              />
            </span> 
          </div>
        <div
          className="info-blob "
        >
          Dispute mechanisms will be optional and based on allowing 
          a (possibly automated) third party access to the blockchain verifiable data on the transaction
        </div>
      
      </section>

      <section id="pack-and-send">
          {/* <div style={{ maxWidth:'100% '}} className="option__info-container grid-2-1 bordery"> */}
          <div 
            className={ cN('file-input-dragarea', encrypted && 'border__off') }

            onDrop={ handleDrop }
            onDragOver={ handleDragOver }
            onDragEnter={ handleDragEnter }
            onDragLeave={ handleDragLeave }                   
          >
            <span className="">    
              {/* <div  className=" bordery"> */}
                <input                    
                  type="file"
                  onChange={ (ev)=>{ 
                    readSelectedFile(ev)
                      .then(pubkeyFromPem) 
                      .then(pubkey=> {
                        setPubkey(pubkey);
                        const encrypted = encrypt(JSON.stringify({
                          unencrypted: offer,
                          buyPriceSpec 
                        }), pubkey);
                        setEncrypted(encrypted);
                        setOfferId(hash(encrypted));
                      })
                  } }
                  id="upload" 
                  style={{display:'none'}}
                />
                <label 
                  htmlFor="upload"
                  className={ cN('button', 'width-two-thirds', pubkey && 'greyed') }
                >
                  {'Upload Shared Public Key               '}
                </label>
              {/* </div>    */}
            <span  className="width-one-third" style={{ position: 'relative', zIndex:'4'}}>
              <InfoModalLauncher
                shiftClassName="margin-shift-left"
                modalClassName={ cN( pubkey && 'greyed') }
                type="info"
                title="Shared Public Key"
                content={`       
                  Your shared public and private key should be pre-agreed with your buyer.
                  Sharing this keypair means that seller and buyer can verify all aspects of the transaction yet no observers can.
                  To protect your buyer, they will need to use the shared key to sign the message accepting your offer.
                  You can save the offer data (and if you like, transmit it to the buyer) unencrypted, but you will need to encypt it in order to register the offer onchain.
                `}
                
              />
            </span>   
            </span>  
          </div> 

        <div style={{display: 'flex', flexDirection:'row'}} >

            <div className="">
              <span className=""> 
                <DownloadLink
                  className="button"
                  label="Save Cleartext          "
                  style={{
                    // explicitly pass style to override crap defaults on style props not mentioned
                    cursor: "pointer"
                  }}
                  filename="offer.json"
                  exportFile={() => JSON.stringify({
                      // NB [...offer] no longer necessary since now using JSON-compliant storage of offer (not an Array with props) 
                      id : offerId,
                      unencrypted: offer,
                      encrypted,
                      buyPriceSpec 
                    })
                  }
                />
              </span>
              <span className="button-svg-child__shift-up-right">
                <CircleButton
                  logo={ 0 ? 'locked' : 'unlocked'}
                />
              </span>
            </div>          
            
            <div className={ !encrypted && 'hidden' }>
              <span className=""> 
                <DownloadLink
                  className="button"
                  label="Save Encrypted            "
                  disabled={ true }
                  style={{
                    // explicitly pass style to override crap defaults on style props not mentioned
                    cursor: "pointer"
                  }}
                  filename="offer.json"
                  exportFile={() => JSON.stringify({
                      // NB [...offer] no longer necessary since now using JSON-compliant storage of offer (not an Array with props) 
                      id : offerId,
                      unencrypted: offer,
                      encrypted,
                      buyPriceSpec 
                    })
                  }
                />
              </span>
              <span className="button-svg-child__shift-up-right">
                <CircleButton
                  logo={ encrypted ? 'locked' : 'unlocked'}
                />
              </span>
            </div>

          </div>

          <div>
            <span 
              className={ cN('button', !(encrypted && offer.length && buyPriceSpec.assetName && buyPriceSpec.amount ) && 'button__disabled')}
              onClick={ ()=>'{ letsFlyBaby() }' }
            >
              Register offer onchain
            </span>
          </div>

          <div  className="width-one-third button__shift-way-down-stay-right" style={{ flexDirection:"row" }}>
            <div 
              className= "modal-launcher"
              disabled= { !(encrypted && offer.length && buyPriceSpec.assetName && buyPriceSpec.amount) }
              onClick={ ()=>{ 
                setOffScreenPanels(true); 
                setTimeout(()=>{ window.scrollTo({ top: 0, behavior: 'smooth' }); }, 1800);
                launchJsonModal({
                  asyncData: ()=>{  },
                  modal: PackAndSendModal,
                  nextButton: ()=>{

                  },
                }); 
              } }
            >
              <CircleButton
                logo="next"
              />
            </div>
          </div>


      </section>

  </Panel>
)};

export default BuySpecPanel;
