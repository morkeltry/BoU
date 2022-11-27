import React, { useState, useEffect, useContext, useRef } from 'react';
import { Panel, FullpageAccordion as Accordion } from '../react-fullpage-accordion';
import OfferContext from './OfferContext';
import ModalContext from './ModalContext';

import JobsPanel from './Panel0-Jobs';
import SellSpecPanel from './Panel1-SaleSpec';
import BuySpecPanel from './Panel2-BuySpec';

import Modal from '../components/Modal';

const RegisterPage = () => {
  const [offer, setOffer] = useState([]);
  const [buyPriceSpec, setBuyPriceSpec] = useState({});
  const [modal, setModal] = useState(null);
  const [offScreenPanels, setOffScreenPanels] = useState(false);

  const ref = useRef(null);

  useEffect(function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Bridge of Unity';
  }, []);

  return (
  <OfferContext.Provider value={{ offer, setOffer, buyPriceSpec, setBuyPriceSpec }} >
    <ModalContext.Provider value={{ modal, setModal, offScreenPanels, setOffScreenPanels }} >
      <Accordion
        ref={ref}      
      >
        <JobsPanel />
        <SellSpecPanel />
        <BuySpecPanel />
      </Accordion>
      <Modal 
        modal={ modal }
      />
    </ModalContext.Provider>
  </OfferContext.Provider>
)};

export default RegisterPage;
