import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';

import Routes from '../Routes';
import OfferContext from './OfferContext';
import ModalContext from './ModalContext';

import Modal from '../components/Modal';

import lookingAtBanks from '../assets/looking-at-banks-2.jpeg';

const ClaimPage = () => {
  const ref = useRef(null);

  const [offer, setOffer] = useState([]);
  const [buyPriceSpec, setBuyPriceSpec] = useState({});
  const [modal, setModal] = useState(null);

  useEffect(function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Bridge of Unity';
  }, []);

  return (
    <ModalContext.Provider value={{ modal, setModal }} >
      <div 
        className="fullpage-bg top-at-vp-bottom"
        style={{ backgroundImage: `url("${lookingAtBanks}")` }}
        ref={ref}
      >

          <Link to="/register">
            <div className="button button__staid">
              {` GO TO OFFERS PAGE`}
            </div>
          </Link>
            <div className="button">
              {`Connect to Phala for payment release token`}
            </div>
            <div className="button">
              {`Send payment release token to substrate chain`}
            </div>

      </div>
      <Modal 
        modal={ modal }
      />
    </ModalContext.Provider>
)};

export default ClaimPage;
