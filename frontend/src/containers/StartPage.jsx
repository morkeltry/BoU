import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';

import Routes from '../Routes';
import OfferContext from './OfferContext';
import ModalContext from './ModalContext';

import Modal from '../components/Modal';

import lookingAtBanks from '../assets/looking-at-banks-2.jpeg';
import excitingCryptos from '../assets/exciting-crypto-assets-1.jpg';
import boringAssFiat from '../assets/boring-irl-assets-2.svg';
// import boringAssFiat from '../assets/output-onlinejpgtools-2.png';
import FedSvg from '../components/FedSvg';

// const excitingDefiGemsPath='M7 11V7a5 5 0 0 1 10 0v4'

const StartPage = () => {
  const ref = useRef(null);

  const [offer, setOffer] = useState([]);
  const [buyPriceSpec, setBuyPriceSpec] = useState({});
  const [modal, setModal] = useState(null);

  useEffect(function () {
    ref.current.scrollIntoView();
    // ref.current.scrollTo(0, -1000);
    document.title = 'Bridge of Unity';
  }, []);

  const scrollOutOfView= ()=>{
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <ModalContext.Provider value={{ modal, setModal }} >
      <div 
        className="fullpage-bg top-at-vp-bottom"
        style={{ backgroundImage: `url("${lookingAtBanks}")` }}
        ref={ref}
      >
        <span
          className="bottom-left"
        >

          <img className="large-nav-icon" src={ excitingCryptos } />

          <div className="abs-bottom button__z2-bottom">
            <Link to="/buyer">
              <div 
                className="button"
              >
                {`Pay with my exciting crypto assets\n(upload Offer)`}
              </div>
            </Link>
            <div 
              className="button button__acala"
              onClick={ ()=>{ window.location.href='https://apps.acala.network/' } }
            >
              {`My wrapped assets \n( Acala )`}
            </div>
          </div>

        </span>

        <span
          className="bottom-right"
        >
          <Link to="/register">
            <FedSvg className="large-nav-icon"/>
            {/* <img className="large-nav-icon" src={ boringAssFiat } /> */}

            <div className="button button__staid">
              {`Sell my boring "real" world assets\n( create Offer )`}
            </div>
          </Link>
          <Link to="/claim">
            <div className="button">
              {`Claim crypto for a completed transaction`}
            </div>
          </Link>
        </span>

      </div>
      <Modal 
        modal={ modal }
      />
    </ModalContext.Provider>
)};

export default StartPage;
