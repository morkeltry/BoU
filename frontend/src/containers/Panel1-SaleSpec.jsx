import React, { useState, useContext, createRef, useRef }  from 'react';
import cN from 'classnames';
import { Panel } from '../react-fullpage-accordion';
import DownloadLink from "react-download-link";
import PanelContext from '../react-fullpage-accordion/panel-context';
import ModalContext from './ModalContext';
import OfferContext from './OfferContext';

import JobGroupOperation from '../components/JobGroupOperation';
import CircleButton from '../components/CircleButton';

// import vousSortez from '../assets/vous_sortez-old-2592x1680.jpg';
import yellowBrickRoad from '../assets/yellow-brick-bay-bridge-3.jpeg';

import { emptyCurve } from '../helpers';

const defaultThreshold = total=>
  total 
    ? Math.floor(100*(total-1)/total)/100
    : 1;

const SaleSpecJob = ({ jgIdx, readOnly })=> {
  const { offer, setOffer } = useContext(OfferContext);
  const { modal, setModal } = useContext(ModalContext);
  const { jobType, wasmHash, params, paramsRequired=[], paramsOptional=[], oracles, threshold } = offer[jgIdx];
  //NB VV for faking jgOperator='THEN' for demo, so as not to mess up on bad file
  let { jgOperator } = offer[jgIdx];

  // NB dummy functionality- threshold in state is passed around but not actually used
  const [thresh, setThresh] = useState(defaultThreshold(oracles.length));

  console.log('offer', offer);
  console.log(`offer[${jgIdx}] has ${offer[jgIdx].oracles.length} oracles`, offer[jgIdx]);
  console.log(`offer[${jgIdx}].oracles:`,offer[jgIdx].oracles);
  console.log('oracles',oracles);
  return (
    <div className="jobgroup">
    <div className="jobgroup__top">
      <div className="params-box">
        <h4> { jobType } ({ wasmHash }) </h4>
        { 
              <span
                className={ cN( 'abs-top-right', readOnly && 'hidden' ) }
                onClick={ ()=>{ 
                  console.log('offer.length', offer.length);
                  const state=[...offer]; setOffer( state.slice(0,jgIdx).concat(state.slice(jgIdx+1)) ); 
                  console.log((state.slice(0,jgIdx).concat(state.slice(jgIdx+1))).length);
                  } }

              >  
                <CircleButton 
                  size='3rem'
                  logo='remove' 
                />
              </span>
        }
        <span className="">params: </span>
        { Object.keys(params).map(key=>(
          <div className="params-child" > 
            <span className="params-child-left" key={`paramName:${key}`}>
            { `${key}: ` }
            </span>
            <span className="params-child-right" key={`paramVal:${key}`}>
            { `${params[key]}` }
            </span>
          </div>
        )) } 
      </div>


      { oracles.length      
        ? oracles.map((oracle, idx)=> (
          <div className="grid-5-1 oracle" key={ oracle+idx }>
            <span className="">  
            { oracle.name } { oracle.jobId } { console.log(oracle, oracle.name,oracle.jobId) }
            </span>
            <span
              className={ cN('abs-right', readOnly && 'hidden' ) }
              // remove just this oracle within the current jobGroup and update context state
              onClick={ readOnly ||
                (()=>{ 
                  const state=[...offer];
                  const newOracles = oracles.slice(0,idx).concat(oracles.slice(idx+1)) ;
                  state[jgIdx].oracles = newOracles;
                  // You could remove empty jobGroup here - but then you;d lose all your config :/
                  // if (!oracles.length)
                  //   state = state.slice(0,jgIdx).concat(state.slice(jgIdx+1)) ;
                  setOffer(state);
              }) }
            >  
              <CircleButton 
                logo="remove" 
                shiftClass="button-padding-compensate"
              />
            </span>
            <span>  
            </span>
          </div>
        )) 
        : <div>NO ORACLES CHOSEN - This { jobType } job will have no effect. </div>
      }
      </div>
      <div className={ cN('jgops-row') }>   
         <> { // No operators required on final job
          console.log(jgIdx, offer.length, jgIdx === offer.length) || 
          (jgIdx === offer.length-1)
          ? <span 
              className={"jgop__selected" }
              // If unset, set on click, else
              onClick={()=> { 
                console.log('TODO: This will launch Try Job');
              }}
            >
              <JobGroupOperation 
                unset= { !jgOperator }
                op="RESULT"
                params={ {/* Jobs also take their own params, eg API_KEY */} }
              />
            </span>


            // Show either current selected opearator or list of all possible
            // NB only an invalid offer (eg loaded from bad file) should get to the state where
            // readOnly && !jgOperator, but this state would cause unexpected results, so assume (and assign) jgOperator=='THEN'
          : ( (jgOperator || (readOnly && (jgOperator='THEN'))) 
            ? [ jgOperator ]
            : ['AND', 'OR', 'THEN', 'THRESHOLD']
            )
              .map(op=> 
                <span 
                  className={ jgOperator && 'jgop__selected' }
                  key={ op }
                  // If unset, set on click, else
                  onClick={()=> { 
                    const state=[ ...offer ];
                    state[jgIdx].jgOperator= jgOperator ? null : op; 
                    setOffer(state);                    
                  }}
                >
                  <JobGroupOperation 
                    unset= { !jgOperator }
                    op={ op }
                    params={ jgOperator === 'THRESHOLD' && { threshold } }
                  />
                  { jgOperator &&
                    <CircleButton 
                      logo="downarrow"
                      shiftClass="jgop__join-arrow z-index-5"
                      size="3rem"
                    />
                  }
                </span> 
              )
            }{ jgOperator === 'THRESHOLD' &&
              <span>
                <input 
                  className="jgop__threshold-input"
                  type="number"
                  size="5"

                  step="0.05"
                  min="0"
                  max="1"
                  defaultValue={ Math.floor(100*(oracles.length-1)/oracles.length)/100 }
                  // setThreshold etc.
                />

                
              </span>
            }</>
      </div>
    </div>  
)}


// TODO: define setJobGroup! (will need to be a wrapper)
const SaleSpecPanel = ({ offerId, asFullPage, readOnly, isBuyer, isSeller }) => {
  const { panelClick } = useContext(PanelContext);
  const { offer, setOffer } = useContext(OfferContext);

  const [depositCurve, setDepositCurve]= useState(emptyCurve());
  const [oppCostCurve, setOppCostCurve]= useState(emptyCurve());
  const [releaseCurve, setReleaseCurve]= useState(emptyCurve());

  const fileInput = useRef(null);

    const saveSalePanel = ()=>{

  }

  const dummyRunSalePanel = ()=>{

  }
  
  const Content = ({ offerId })=>    
      <>
        <h2 className="section-title dark-text">
          { `Sale Asset\n Specifcation ${ offerId ? '\n'+offerId : '' }` }
        
        </h2>

        <section id="sale-definition">

          { //job&& allows quick refresh with shallow copy by inserting 0
          offer.map((jobGroup, jgIdx)=>( jobGroup&& <>   
            <div className="job-group" key={ `Group ${jgIdx}` }>
              <SaleSpecJob
                readOnly={ readOnly }
                jgIdx={ jgIdx }
                jg={ offer[jgIdx] }
              />
            </div>
          </>))
          }
        </section>

        <section className="complete-sale-panel grid-2-1">
          <span style={ {width:'not85%'} }>
            { readOnly
              ? <div>
              
                </div>
              : <div 
                  className="button next-button left"
                  onClick={ saveSalePanel }
                >
                  <DownloadLink
                    label="Save Locally (incomplete offer)"
                    filename="offer.json"
                    exportFile={() => JSON.stringify(offer)}
                  />
                  
                </div>
            }
              <div 
                className="button next-button right"
                onClick={ 
                  
                  dummyRunSalePanel

                    // (event)=> {
                    //   event.persist();
                    //   event.preventDefault();

                    //   function magicDownload(text, fileName) {
                    //     const blob = new Blob([text], {
                    //       type: "text/csv;charset=utf8;"
                    //     });

                    //     // create hidden link
                    //     const element = document.createElement("a");
                    //     document.body.appendChild(element);
                    //     element.setAttribute("href", window.URL.createObjectURL(blob));
                    //     element.setAttribute("download", fileName);
                    //     element.style.display = "";

                    //     element.click();

                    //     document.body.removeChild(element);
                    //     event.stopPropagation();
                    //   }

                    //   const fileType = event.target.innerText;
                    //   const text = this.props.exportFile(fileType);

                    //   if (text instanceof Promise) {
                    //     text.then(result => magicDownload(result, this.props.filename));
                    //   } else {
                    //     magicDownload(text, this.props.filename);
                    //   }
                    // }
                  
                  }
              >
            
            <span 
              onClick={ ()=>{} }
            >
            Try Jobs
            </span>
          </div>
          </span>
          { asFullPage
            ? <></>
            : <span
                onClick={ ()=> !asFullPage && panelClick('buyspec-definition-panel', {force:true}) }
                disabled={ !offer || !offer.length }
              >              
                <CircleButton
                  logo="next"  
                  size="50"
                />
              </span>
          }        
        </section>
    </>

  return asFullPage 
    ? <div className="">
        <div className="center-margin-auto max-width-60vw">
          <Content isBuyer={ isBuyer } isBuyer={ isSeller } offerId={ offerId } />      
        </div>
      </div>
        : <Panel 
      itemId="sale-definition-panel"
      background={ yellowBrickRoad }>
        <Content isBuyer={ isBuyer } isBuyer={ isSeller } offerId={ offerId }/>
    </Panel>
  
};

export default SaleSpecPanel;
