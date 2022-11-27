import React, { useState, useEffect, useContext, createRef, useRef }  from 'react';
import cN from 'classnames';
import DownloadLink from "react-download-link";
import OfferContext from './OfferContext';
import ModalContext from './ModalContext';

import SellSpecPanel from './Panel1-SaleSpec';
import BuySpecPanel from './Panel2-BuySpec';
import CurvesSection from './CurvesSection';

import Modal from '../components/Modal';
import JobGroupOperation from '../components/JobGroupOperation';
import CircleButton from '../components/CircleButton';
import { emptyCurve } from '../helpers';
import { shorten } from '../helpers';
import { verifyEncrypted, pubkeyFromPem, encrypt, hash } from '../helpers/crypto';
import { readSelectedFile, readAndprocessFiles, verifyonChainHash } from '../helpers/asyncRequests';

import vousSortez from '../assets/vous_sortez-old-2592x1680.jpg';
import lookingAtBanks from '../assets/looking-at-banks-2.jpeg';


const BuyerPage = () => {  
  const [offer, setOffer] = useState([]);
  const [buyPriceSpec, setBuyPriceSpec] = useState({});
  const [offerId, setOfferId] = useState(null);
  const [pubkey, setPubkey] = useState(null)
  const [encrypted, setEncrypted] = useState(null)
  const [acalaWallet, setAcalaWallet] = useState(null)
  
  const [modal, setModal] = useState(null);

  const ref = useRef(null);

  useEffect(function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Bridge of Unity';
  }, []);

  // const readSalePanel = ev=> new Promise ((resolve, reject)=>{
  //   console.log('readSalePanel called');
  //   let { files }= ev.target;
  //   files=files || ev.dataTransfer.files;

  //   const fileReader = new FileReader();
  //   fileReader.onloadend = content=> {
  //     const result = fileReader.result;
  //     console.log('Loaded');
  //     if (files[0].type==="application/json") {
  //       console.log('resolve json');
  //       try {
  //         console.log('will resolve json');
  //         resolve(JSON.parse(result));
  //       } catch(e) {
  //         console.log(e);
  //       }
  //     } else
  //       resolve(result);
  //   };
  //   fileReader.onerror = err=>{
  //     console.log(err);
  //     reject(err);
  //   }

  //   console.log(files);

  //   fileReader.readAsText(files[0]);
  // })

  const offerValid = ()=>
    offer.length && buyPriceSpec.assetName && buyPriceSpec.amount
    || console.log(offer.length, buyPriceSpec, buyPriceSpec.assetName, buyPriceSpec.amount, offer.length && buyPriceSpec.assetName && buyPriceSpec.amount);

  const setIngestedState=({ id, unencrypted, encrypted, buyPriceSpec })=> {
    console.log('to set:',{ id, unencrypted, encrypted, buyPriceSpec });
    setBuyPriceSpec(buyPriceSpec);
    // TODO: offerId, but sanity check it later
    // setOfferId(id);
    setOffer(unencrypted);
    setEncrypted(encrypted);
    try {
      verifyEncrypted({ unencrypted, encrypted, pubkey });
    } catch(e) {
      console.log(e);
    }
  }

  const doEncrypt = (pubkey, offer, buyPriceSpec)=> {
    const encrypted = encrypt(JSON.stringify({
      unencrypted: offer,
      buyPriceSpec 
    }), pubkey);
    setEncrypted(encrypted);
    setOfferId(hash(encrypted));
    console.log(hash(encrypted));
  }

  const nada = ()=> ev=> {
    ev.preventDefault();
    ev.stopPropagation();
  };

  let [handleDragOver ,handleDragEnter ,handleDragLeave ] = [nada(),nada(),nada(),nada()];
  const handleDrop = ev => {
    ev.preventDefault();
    ev.stopPropagation();
    readAndprocessFiles({
      'pem': pubkey=> { 
        setPubkey(pubkeyFromPem(pubkey)); 
        if (offerValid()) 
          doEncrypt(pubkeyFromPem(pubkey), offer, buyPriceSpec) 
      },
      'json': json=> { 
        setIngestedState(json); 
        if (pubkey) 
          doEncrypt(pubkey, json.unencrypted, json.buyPriceSpec) 
      },
    }) (ev);
  }


  return (
    <ModalContext.Provider value={{ modal, setModal }} >
      <OfferContext.Provider value={{ offer, setOffer, buyPriceSpec, setBuyPriceSpec }} >
        { 
        
          <div 
            className="buyer-page__main" 
            // ref={ref}

            onDrop={ handleDrop }
            onDragOver={ handleDragOver }
            onDragEnter={ handleDragEnter }
            onDragLeave={ handleDragLeave }       

          >
            { (offer && offer.length)
              ? <>
                  <SellSpecPanel 
                      offerId={ shorten(offerId, 22) }
                      asFullPage={ true } 
                      readOnly={ true }
                      maxWidth={ true }
                    />
                  
                  <div className="buyer-page__buy-spec-bg">
                    <div className="center-margin-auto max-width-60vw">

                      <div className="titlebar-image-spacer"></div>
                      <h2 className="section-title">Buy Price Spec</h2>
                      <div>
                        <div className="h2-span-text">
                          <span>
                            BASE PRICE: { buyPriceSpec.amount }{ buyPriceSpec.assetName }
                          </span>
                          <div className="titlebar-image-spacer" />
                        </div>
                      </div>                

                      <CurvesSection
                        readOnly={ true }
                        // asFullPage={ true }                    
                      />


                      <div>
                        <span 
                          className={ cN('button', !offerId && 'button__disabled')}
                          onClick={ offerId && (()=>{ 
                            const modalData={
                                type: 'result',
                                title:  offerId,
                                content: 'waiting...'
                            }
                            setModal(modalData);
                            verifyonChainHash(offerId) 
                              .then(data=>({
                                ...modalData,
                                content: data
                                  ? `${shorten(offerId)} is NOT registered.\n You can safely wrap your assets but DO NOT DEPOSIT assets in the escrow contract yet`
                                  : `${shorten(offerId)} is registered. Since the hash matches 
                                    \nyou can be sure that the registered offer matches the one shown exactly.
                                    \nWhen you deposit assets, ensure the amounts and types match exactly those specified in the offer.`
                              }))
                              .then(setModal);                              
                            })
                          }
                        >
                          Verify offer { offerId ? shorten(offerId) : '' } onchain
                        </span>
                      </div>

                      {/* buncha hacky styling! */}
                      <div className="spacer__2-thick-buttons"
                      >
                      <span
                        className="bottom-left"
                      >
                      <div
                        className=
                      "large-nav-icon">
                        {/* <div className="page-bottom-spacer"></div> */}

                        <div className="abs-bottom button__z2-bottom">
                          <div 
                            className={ cN('button', 'button__acala', !acalaWallet && 'button__acala__disabled') }
                            onClick={ ()=>{ /*TODO! */} }
                          >
                            {`Pay with ${ buyPriceSpec.amount } ${ buyPriceSpec.assetName }\n${ acalaWallet ? '' : '(first connect a wrapper)' }`}
                          </div>
                          <div 
                            className="button button__acala"
                            onClick={ ()=>{ window.location.href='https://apps.acala.network/' } }
                          >
                            {`My wrapped assets \n( Acala )`}
                          </div>
                        </div>
                        <div className="page-bottom-spacer"></div>

                      {/* hacky styling end ;) */}
                      </div>
                      </span>
                      </div>

                    </div>
                  </div>
                </>
              : <div className="buyer-page__main__input">        
                  <input                    
                    type="file"
                    onChange={ (ev)=>{ 
                      readSelectedFile(ev)                    
                      .then(setIngestedState) 
                    } }

                    id="upload" 
                    style={{display:'none'}}
                  />
                  <label 
                    htmlFor="upload"
                    className="button"
                  >
                    Load a Seller's Offer file
                  </label>
                </div>   
            }    
          </div>
        
        }
        <Modal 
          modal={ modal }
        />
      </OfferContext.Provider>
    </ModalContext.Provider>
  )
};

export default BuyerPage;
