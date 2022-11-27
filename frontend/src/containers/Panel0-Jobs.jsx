import React, { useState, useEffect, useContext } from 'react';
import { Panel } from '../react-fullpage-accordion';
import PanelContext from '../react-fullpage-accordion/panel-context';

import OfferContext from './OfferContext';
import ModalContext from './ModalContext';

// WOW!!! semantic-ui wants to make life hard!
// Note the casing - Dropdown in the filename (which, incidentally, you have to link the path all the way to like it's the 90's)
// filename: Dropdown (/index.js) ; Component name: DropDown
import DropDown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import CircleButton from '../components/CircleButton';
import ParamInput from '../components/ParamInput';

import munchkins from '../assets/3munchkins.jpg';
import cityOfOz from '../assets/oz-city-limits.jpg';

import { emptyCurve, nowt, fakeWait, paramOrEmptyArr  } from '../helpers';
import { oracles, wasmHashes, knownJobTypes } from '../assets/content/stuff';
import { getJsonFromWasmHash } from '../helpers/asyncRequests';

const JobsPanel = () => {
  const { offer, setOffer } = useContext(OfferContext);
  const { modal, setModal } = useContext(ModalContext);
  const { panelClick } = useContext(PanelContext);

  const [jobType, setJobType]= useState();
  const [wasmHash, setWasmHash]= useState();
  const [knownJobWasms, setKnownJobWasms]= useState({});
  const [wasmAudit, setWasmAudit]= useState();
  const [params, setParams]= useState({});
  const [suiBugOverride, setSuiBugOverride]= useState(new Array(10).fill());
  // const [suiBugOverride, setSuiBugOverride]= useState([undefined]);
  // const [suiBugOverride, setSuiBugOverride]= useState(undefined);
  // const [, ]= useState();
  // const [, ]= useState();
  // const [, ]= useState();
  // const [, ]= useState();
  // const [, ]= useState();
  // const [, ]= useState();
  // const [, ]= useState();

  
// Semantic UI DropDown/ DropDown.Menu  props be like:
// <DropDown
//   placeholder=""
//   clearable={ true }
//   search={ true }
//   onChange={ summat }
//   text={  }
//   value={  }
//   onSearchChange={ summat }
// >
//   <DropDown.Menu>
//     { .map(option => (
//       <DropDown.Item 
//         key={ option } 
//         text={ option } 
//         value={ option } 
//         { ...option } 
//         onClick={  } 
//       />
//     ))}
//   </DropDown.Menu>

//   </DropDown>

useEffect(()=>{
  // populateArbitrarily();
}, [])


const someAudit = {date: '2020.12.12', auditor: 'Bob'};
const someOracle = {name: 'Own CL node', link: 'localhost:/oracle'};


const manuallySetBrokenSuiDropdown= (idxs, newState)=> {
  const state=[...suiBugOverride];
  idxs.forEach(idx=> state[idx]=newState);
  setSuiBugOverride(state);
}

// prevent annoying empty state errors
const wasms= wasmHash=> (
  (knownJobWasms[wasmHash] && knownJobWasms[wasmHash].name && true && true)
    ? knownJobWasms[wasmHash]
    : knownJobWasms[wasmHash] 
      ? { name: wasmHash, oracles: [], knownAudits: [someAudit], ... knownJobWasms[wasmHash] }      
      : { name: wasmHash, oracles: [], knownAudits: [someAudit] }
)


const logAnd=x => {
  console.log(x);
  return x
}

const summat=(e, d)=> { console.log('selected:', d.value); }


const populateArbitrarily= ()=>{
  const gwa = getWasmsAvailable();
  // console.log('getWasmsAvailable', gwa, gwa.then(rv=>{console.log('rv', rv);}));
  setOffer([{"wasmHash":"0x55081337","jobType":"UK Land Reg. Proprietor lookup","params":{"Title Number":"TGL7770888"},"paramsRequired":[],"oracles":[{"nodeId":"abcd","name":"oracleMork","jobId":"31415"},{"nodeId":"efgh","name":"oracleMork","jobId":"10101"}]},{"wasmHash":"0x001afecc","jobType":"Chainalysis is it dutty?","params":{"addresses":"1Q7tyhdblah","markerWhitelist":"mixer"},"paramsRequired":[],"oracles":[{"nodeId":"efgh","name":"Chainalysis","jobId":"99999"}]}]);
}

const getWasmsAvailable= (jobName)=> {
  return Object.keys(knownJobWasms).length
    ? Promise.resolve(knownJobWasms)
    : fakeWait(1, ()=>{
        console.log('setting setKnownJobWasms using',wasmHashes);
        // You could filter by wasmHash.name===jobName here, but why bother?
        // In demo, just fetch the known set of wasmHashes once.
        setKnownJobWasms({
          ...knownJobWasms,
          ...wasmHashes
        });
        return { 
          ...knownJobWasms,
          ...wasmHashes
        }
    })
}

// returns a Promise which will resolve with one wasmHash's worth of oracles (which will also be added to state)
const getOraclesAvailable= wasmHash=> {
  return fakeWait(1, ()=>{
    let oraclesState;
    let state=[ ...knownJobWasms ];
    console.log(state);
    console.log(wasmHash);
    if (!state[wasmHash])
      console.log('May throw - trying to populate oracles onto a wasmHash unknown to state');
    state[wasmHash].oracles = oracles[wasmHash];
    // NB erases old known oracles rather than concatenating.
    state[wasmHash].oracles = oracles[wasmHash];
    if (state[wasmHash].niceName && !state[state[wasmHash].niceName])
      state[state[wasmHash].niceName] = [wasmHash];
    if (!state[wasmHash].niceName.includes(wasmHash))
      state[wasmHash].niceName.push(wasmHash);
    setKnownJobWasms(state);
    return oraclesState.oracles
  })
}


const errorToast= err=> {
  console.log(err.message || err);
}

// oracle={{
//   ...oracle,
//   name: oracle.name,
//   jobType,
//   oracleJobName: wasms(wasmHash).name,
//   wasmHash,
const addToJobSpec = ({ wasmHash, jobType, nodeId, name, jobId, params, paramsRequired, paramsOptional, ...oracle}) => {
console.log({ wasmHash, jobType, nodeId, name, jobId, params, paramsRequired, paramsOptional, ...oracle} );

  // create new empty jobGroup, with oracles array unpopulated
  let newTail={ wasmHash, jobType, params, paramsRequired, paramsOptional, oracles:[] };

  if (missingParams(paramsRequired, params)) {
    throw new Error(`Required params: ${paramsRequired.join(', ')}`);
  }

  // in almost any case, push this new empty group onto offer. 
  // If the wasmHashes and params match, though, reuse the existing last
  // ( unless the oracle nodeId/ jobId also match- in which case fail).
  if (offer.length){
    // tail = {...offer[offer.length-1], oracles: [...tail.oracles]};
    // old structure- assumes oracles are indexed by nodeId
    // if (tail.oracles && tail.oracles.nodeId && tail.oracles.nodeId === oracle.nodeId && tail.oracles.nodeId.jobId === oracle.jobId) {
    // new structure- oracles are an array
    const oldTail = offer[offer.length-1];
    if (offer[offer.length-1].oracles.find(el=> el.nodeId===nodeId && el.jobId===jobId)) {
      throw new Error(`Job ${jobId} on node ${nodeId} already included in last job.`);
      throw new Error(`Job ${jobId} on node ${nodeId} with params ${Object.values(params).join(',')} already included in last job.`);
      // NB ^^ will fail in some legit cases, ie where a second job with different params to be made to same oracles.
      // TODO: In which case, jump across and add result processing step first.

    }
    // If wasmHash and params match exactly (we already know nodeId & jobId don't)
    if (
        oldTail.wasmHash === newTail.wasmHash 
        && JSON.stringify(oldTail.params) === JSON.stringify(newTail.params)
      ) {
      setOffer(offer=>{ 
        const clone=[...offer];
        // NB use fresh offer from state for purity & maintainability, even though we have already taken oldTail in parent scope
        const [oldTail]=clone.splice(clone.length-1); 
        newTail=oldTail;
        return clone 
      });
      // console.log(`Current job matches last job exactly, but for the node. 
      //               Offer (should have) been now temporarily truncated in state.
      //                Appending to that last jobs group before reading it.`);
      // ^^ What the console.log sez
      // console.log('Truncated offer (eager):', JSON.stringify(JSON.parse(offer)));
     // but if they don't match exactly, use the  
    }// else newTail=newTail
  }// else newTail=newTail;
    // ^^ no job groups existing in state. Create a new one.

  // We now have an object 'newTail' which is either new, with form state added, all except the oracle,
  // OR.. it is the old previous last object 'oldTail' (temporarily removed from offer), complete, but 
  // without this form's new oracle.
  // and so...
  newTail.oracles.push({ nodeId, name, jobId });
  setOffer(offer=> offer.concat(newTail));

  return offer;
}

// TODO : rewrite properly!!
// return true if the set of non-compliant params is non-empty
const missingParams = (paramsRequired, params)=> {
  let previousJobGroup=[];
  // const previousJobGroupsReturnVals=offer.map(group=>wasm=>ReturnVals)
  let missing= paramsRequired
    .filter (paramName=>
      // NB mismatched data structure!!! (.content matches offer, not params as passed)
      !params.paramName.content && 
      !(params.paramName.takeFromPrevious && previousJobGroup.includes(params.paramName.type))
    )
  if (missing.length)
    return missing
}


// test component to pass to as prop to Dropdown.Menuitem
const Element=(p, ...d)=> { 
  return (
    <div style={{ border: '2px solid blue', backgroundColor: '#00bd' }}>
      Niiice ;) props: {Object.keys({...d, ...p}).join(', ')} 
    </div>  
    ||
    <div>    
      <span width="85%" id="woohoo" > {item} </span>
      <AddOracleButton 
        oracle={ item } 
        addOracle={ addOracle }
      />              
    </div>
  )
}

// Different shape from the one in BuyPanel
const OracleDropdownItem= ({ oracle, type })=> (
  <div className="item grid-5-1 " role="option">
    <span className="text" style={{ maxWidth:'100%' }}>
      { oracle.name }
    </span>
    <span 
      className="whysobig"
      onClick={ ()=>{ 
        switch (type) {
          case 'oracles' :
            // console.log('ODItem passes ', oracle,' to addToJobSpec');
            try {addToJobSpec(oracle)} catch(e) {errorToast(e)} 
          case 'audits' :
            console.log('audits launcher should be caught by launcher component :/');
          default :
            console.log('Click. type:', type);
        }
      } }    
    >
      { type==='oracles'
          ? <CircleButton 
              logo='add' 

            />
          : type==='audits'
            ? <span> </span> 
            : null
      }
    </span>
  
  </div>
)



return (
    <Panel 
      itemId="jobs-panel" 
      background={ cityOfOz }
      className= "dark-text"
    >
        <h2 className="section-title">Find your Oracle</h2>
        
        <section id="job-types">
          <DropDown id="job-types-dropdown"
            placeholder="Choose a type of oracle job"
            clearable={ true }
            closeOnChange={ true }
            open={ suiBugOverride[0] }
            search={ true }
            onChange={ nowt }
            onOpen={ ()=>{ manuallySetBrokenSuiDropdown([0], true); } }
            text={ jobType }
            // onSearchChange={ nowt }
            onSelect = { (e,d)=>{ console.log(e,d, e.target)} }
          >
            <DropDown.Menu>
              { knownJobTypes
                .map(jobName=>( 
                  <DropDown.Item 
                    key={ jobName } 
                    text={ jobName } 
                    value={ jobName } 
                    // onClick={ (ev, data)=>{ getWasmsAvailable(data.value); setJobType(data.value); manuallySetBrokenSuiDropdown(0, false); } } 
                    onClick={ ()=>{ 
                      getWasmsAvailable(jobName); 
                      if (jobName!==jobType) {
                        setWasmHash(null); 
                        setWasmAudit(null);
                        setJobType(jobName); 
                        setParams({});
                      }
                      manuallySetBrokenSuiDropdown([0,1,2,3], false); 
                    } } 
                  />
                ))
              }
            </DropDown.Menu>
          </DropDown>
        </section>
        
        <section id="wasms-available" className="">

          <DropDown id="wasms-dropdown"
            placeholder={ `Choose a wasm hash (version number) for your job${jobType ? `:\n${jobType}` :'\n' }` }
            clearable={ true }
            search={ true }
            text={ wasms(wasmHash).name }
            fakeprop={ Object.keys(knownJobWasms[jobType] || []) }
            fakeprop2={ knownJobWasms[jobType] }
            open={ suiBugOverride[1] }
            onOpen={ ()=>{ manuallySetBrokenSuiDropdown([1], true); } }
          >
            <DropDown.Menu>
              { (knownJobWasms[jobType] || [])
                .map(wasmHash=>( logAnd(wasmHash)&&
                  <DropDown.Item 
                    key={ wasmHash }                     
                    text={ wasms(wasmHash).name }
                    value={ wasmHash } 
                    // onClick={ (ev, data)=>{ getOraclesAvailable(data.value); setWasmHash(data.value); manuallySetBrokenSuiDropdown([1,2,3], false); } } 
                    onClick={ ()=>{ 
                      setWasmAudit(null); 
                      setWasmHash(wasmHash); 
                      manuallySetBrokenSuiDropdown([1,2,3], false); 
                    } } 
                  />                  
                ))
              }
            </DropDown.Menu>
          </DropDown>

          <div style={{height:"10%", maxWidth:'100% '}} className="option__info-container grid-2-1 ">
            <span className="width-two-thirds">
              <DropDown id="audits-dropdown"
                placeholder={ 'View audits' }
                text={ `View audits ${wasms(wasmHash).name ? `for \n${wasms(wasmHash).name}` : '' }` }
                clearable={ true }
                search={ true }
                open={ suiBugOverride[2] }
                // as = { OracleDropdownItem }
                onOpen={ ()=>{ console.log('open'); manuallySetBrokenSuiDropdown([2], true); } }
                // text={ wasmAudit }
                disabled= { !(wasms(wasmHash).name && wasms(wasmHash).knownAudits) }
              >
                <DropDown.Menu>
                  { ((wasms(wasmHash) || {}).knownAudits || []).map( audit => ( logAnd(audit)&&
                    <DropDown.Item 
                      key={ `${audit.date}: ${audit.auditor}` } 
                      text={ `${audit.date}: ${audit.auditor}` } 
                      value={ audit.date } 
                      { ...audit } 
                      onClick={ (ev, data)=>{ 
                        setWasmAudit(data.value); 
                        manuallySetBrokenSuiDropdown([2], false); 
                      } } 
                    />
                  ))}
                </DropDown.Menu>
              </DropDown>            
            </span>
            <span  
              className="width-one-third" 
              style={{ width:"32%", constantHeight:true, flexDirection:"row" }}
            >
              <div 
                className= "modal-launcher z-index-2"
                onClick={ ()=>{ 
                  console.log('click:', wasmHash);
                  if (wasmHash) 
                    getJsonFromWasmHash(wasmHash, wasms(wasmHash))
                      .then(data=>({
                        type: 'json',
                        title: data.name ,
                        content: data
                      }))
                      .then(setModal);
                  }
                } 
              >
                { wasmHash ? `JSON for\n${wasmHash}` : `(no audit selected)               ` }
              </div>
              <div>
                <a href="{wasmAudit.auditor.href}">
                  { null && wasmAudit.auditor.name }
                </a>
              </div>
            </span>
          </div>
        </section>
        
        
        <section id="job-params-signature">
          { 
          // console.log( paramOrEmptyArr(wasms(wasmHash), 'paramsRequired') ) ||
            paramOrEmptyArr(wasms(wasmHash), 'paramsRequired')   
              .concat(paramOrEmptyArr(wasms(wasmHash), 'paramsOptional'))
              .map( (param, idx)=> 
                <ParamInput                
                  key={ `param: ${param}` }
                  paramName={ param }
                  required={ idx<paramOrEmptyArr(wasms(wasmHash), 'paramsRequired').length }
                  type= { 'not implemented' }
                  value= { params[param] }
                  setParam= { newVal=>{ params[param]=newVal; setParams(params) } }
                />
              )            
          }
        </section>


        <section id="oracles-available">
          <DropDown id="oracles-dropdown"
            placeholder={ `Choose an oracle${ wasmHash ? ` for ${wasmHash}` : '' }` }
            clearable={ true }
            search={ true }
            open={ suiBugOverride[3] }
            onOpen={ ()=>{ manuallySetBrokenSuiDropdown([3], true); } }
            onClick={ ()=>{ manuallySetBrokenSuiDropdown([3], false); } }   
            disabled={ !wasmHash }
          >
            <DropDown.Menu>
              { console.log('#',wasmHash,wasms(wasmHash)) ||
               Object.keys(wasms(wasmHash).oracles)
                .map (key=> ({ ...wasms(wasmHash).oracles[key], nodeId: key }))
                  .map(oracle=> (
                    <DropDown.Item 
                      key={ oracle.nodeId } 
                      text={ oracle.name } 
                      value={ oracle.nodeId } 
                      oracle={{
                        ...oracle,
                        name: oracle.name,
                        jobType,
                        oracleJobName: wasms(wasmHash).name,
                        wasmHash,
                        paramsRequired: [],
                        params,
                      }}
                      type='oracles'
                      // NB={ the Compomnent passed to as will receive all of the properties of .Item _except_ for the useful ones, which .Item understands and keeps for itself } 
                      as = { OracleDropdownItem }
                      // { ...wasm } 
                      onClick={ ()=>{ manuallySetBrokenSuiDropdown([3], false); } } 
                    />
                  ))
              }
            </DropDown.Menu>
          </DropDown>
        </section>
{/* missingParams(paramsRequired, params) */}
        <div className="full-width-next"
            disabled={ !offer || !Object.keys(offer).length }
            onClick={ !offer || !Object.keys(offer).length 
              ? ()=>{ console.log('Job spec is not finished!'); }
              : ()=>{ panelClick('sale-definition-panel', {force:true} ); }
            }        
        >
          <CircleButton
            logo='next' 
            // onClick={ ()=> panelClick('sale-definition-panel', {force:true}) }
            disabled={ !offer || !Object.keys(offer).length } 
            
          />
        </div>

        
        <section id="audit-notes">
          { wasmAudit && wasmAudit.auditor && <>
              // notes on currently selected wasmAudit
              <div>
                { wasmAudit.notes }        
              </div>
              <div>
                <a href="{wasmAudit.auditor.href}">
                  { wasmAudit.auditor.name }
                </a>
              </div>
            </> }
            {/* setWasmAudit( wasms[wasmHash].auditnotes [wasms[wasmHash].auditnotes.length-1] ) */}          
        </section>



    </Panel>
)};

export default JobsPanel;
