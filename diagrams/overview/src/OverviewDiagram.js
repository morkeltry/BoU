import React from 'react';
import Diagram, { useSchema, createSchema } from './beautiful-react-diagrams';
import './App.css';

const SomeLongAssString = `'Crynyd zann mace zeltron ruurian mustafar karrde iktotchi. Latter qui-gon kessel moore disra droid. Ishi shi'ido jettster muzzer gunray naberrie zeltron. Golda snivvian elom k-3po jubnuk vratix. Ors cornelius polis echani panaka. Skirata gonk san bel unu sanyassan kast yuzzum tenel. Orrin kendal b'omarr gamorr. Cordé quermian anthos needa porkins luke. Kalee cordé salacious ongree jaina antilles ord medon. Shmi geonosis rieekan allana ord trandoshan mccool ansion gorog. Windu charal rugor falleen windu.'`;
  // Raynar calrissian gricho huk bail. Naberrie skywalker gungan iblis medon. Mimbanite latter unduli moddell d8. Er'kit nadd wessell nass meridian gorith jawa gossam. Senex kamino gev gonk darth maarek. Yavin leia croke kael hutt moff whaladon rahn. Bimm x2 wookiee noa taung c'baoth durron ortolan. Derek tahiri var frozian ben b'omarr hutta cracken shi'ido. Tarkin zam chiss kitonak kuat corellia darth sikan bertroff. Anzati falleen lars selkath leia shawda. Atrivis anomid polis d8 celegian gado jango gwurran.'

const ColouredBox = props => (
  <div style={{border: '3px solid magenta'}} >
    Wooooorrds
  </div>
)

const ColouredBoxStatic = <div style={{border: '3px solid red'}} >    Wooooorrds </div>



const Actor = (props)=> {
  if (typeof props==='string')
    props = {content: props};
  return (
    <div className='custom-node actor'>
      {props.content}
    </div>
  )
}

const WrappedCoin = (props)=> {
  if (typeof props==='string')
    props = {content: props};
  return (
    <div className='custom-node coin'>
      {props.content}
    </div>
  )
}

const Contract = (props)=> {
  if (typeof props==='string')
    props = {content: props};
  return (
    <div className='custom-node contract'>
      {props.content}
    </div>
  )
}

const Encrypt = (props)=> {
  if (typeof props==='string')
    props = {content: props};
  return (
    <div className='custom-node encrypt'>
      {props.content}
    </div>
  )
}

const JsonStructure = (props)=> {
  if (typeof props==='string')
    props = {content: props};
  return (
    <div className='custom-node json-struct'>
      {props.content}
    </div>
  )
}

const ExternalApi = (props)=> {
  if (typeof props==='string')
    props = {content: props};
  return (
    <div className='custom-node external-api'>
      {props.content}
    </div>
  )
}

const OracleNode = (props)=> {
  if (typeof props==='string')
    props = {content: props};
  return (
    <div className='custom-node oracle-node'>
      {props.content}
    </div>
  )
}

const ReqRes = (props)=> {
  if (typeof props==='string')
    props = {content: props};
  return (
    <div className='custom-node reqres'>
      {props.content}
    </div>
  )
}

const Action = (props)=> {
  if ((typeof props==='string'))
    props = {content: props};
  return (
    <div className='custom-node action'>
      {props.content}
    </div>
  )
}

const Narration = (props)=> {
  if ((typeof props==='string'))
    props = {content: props};
  return (
    <div className='custom-node narration'>
      {props.content}
    </div>
  )
}

// const Encrypt = (props)=> {
//   if ((typeof props==='string'))
//     props = {content: props};
//   return (
//     <div className='custom-node actor'>
//       {props.content}
//     </div>
//   )
// }

const answersGroup = [690,705];
const [aGx, aGy] = answersGroup;
const paymentReleaseGroup = [840, 400];
const [pRGx, pRGy] = paymentReleaseGroup;

const narrations= {
  start : 'Buyer registers acceptance and specifies the identifier of the payment asset',
  transfer : 
  `Seller:
    - has now performed the offchain transfer\n
    - verifies that API result passes the WASM acceptance specs
    - updates Oracle Answers
    - requests full or partial payment release
       by speficying the amount of the locked asset /not/ to release
    - uses token when they choose
  `
}


const initialSchema = createSchema({
  nodes: [
    { id: 'buyer', content: Actor('Buyer'), coordinates: [20, 70], },
    { id: 'seller', content: Actor('Seller'), coordinates: [20, 200], },

    { id: 'assetwrapper', content: Contract('Asset Wrapper Contract'), coordinates: [110, 70], },
    { id: 'offersregistration', content: Contract('Offers Registration Contract'), coordinates: [190, 375], },
    { id: 'answers', content: Contract('Oracle Answers Contract'), coordinates: answersGroup, },
    { id: 'verifier', content: Contract('Confidential Verifier Contract'), coordinates: [1025, 270], },

    { id: 'wrappedasset', content: WrappedCoin('Wrapped Asset'), coordinates: [180, 150], },

    { id: 'acceptoffer', content: Action('Accept Offer'), coordinates: [300, 225], },
    { id: 'narratestart', content: Narration(narrations.start), coordinates: [490, 230], },
  
    { id: 'narratetransfer', content: Narration(narrations.transfer), coordinates: [490, 490], },
    { id: 'requestanswers', content: Action('Request Oracle Answers'), coordinates: [560, 620], },



    { id: 'requestpayment', content: Action('Request Payment Release'), coordinates: paymentReleaseGroup, },
    { id: 'paymentauthorisation1', content: 'Payment Authorisation Token', coordinates: [pRGx+225, pRGy+25], },
    { id: 'paymentauthorisation2', content: 'Payment Authorisation Token', coordinates: [pRGx+250, pRGy+100], },

    { id: 'node1', content: 'Node 1', coordinates: [aGx-50, aGy+120], },
    { id: 'node2', content: 'Node 2', coordinates: [aGx+50, aGy+75], },
    { id: 'node3', content: 'Node 3', coordinates: [aGx+150, aGy+75], },
    { id: 'node4', content: 'Node 4', coordinates: [aGx+250, aGy+120], },
    { id: 'api', content: 'Land Registry API', coordinates: [aGx+75, aGy+200], },

  ],
  links: [
    { input: 'buyer',  output: 'assetwrapper', label: '', readonly: true },
    { input: 'assetwrapper',  output: 'wrappedasset', label: '', readonly: true },
    { input: 'wrappedasset',  output: 'acceptoffer', label: '', readonly: true },
    { input: 'acceptoffer',  output: 'offersregistration', label: '', readonly: true },
    { input: 'seller',  output: 'offersregistration', label: 'registers offer of the sale asset (including opporunity rent cost and payment release curves', readonly: true },

    // { input: '',  output: '', label: '', readonly: true },
    { input: 'requestanswers',  output: 'answers', label: '', readonly: true },
    { input: 'requestpayment',  output: 'verifier', label: '', readonly: true },
    { input: 'verifier',  output: 'paymentauthorisation1', label: '', readonly: true },
    { input: 'verifier',  output: 'paymentauthorisation2', label: '', readonly: true },
    { input: 'paymentauthorisation1',  output: 'requestpayment', label: '', readonly: true },
    { input: 'paymentauthorisation2',  output: 'requestpayment', label: '', readonly: true },
    { input: 'requestpayment',  output: 'offersregistration', label: 'seller submits withdrawal token after timing delay', readonly: true },
    // // { input: '',  output: '', label: '', readonly: true },
    // // { input: '',  output: '', label: '', readonly: true },
    // // { input: '',  output: '', label: '', readonly: true },

    { input: 'answers',  output: 'node1', label: '', readonly: true },
    { input: 'answers',  output: 'node2', label: '', readonly: true },
    { input: 'answers',  output: 'node3', label: '', readonly: true },
    { input: 'answers',  output: 'node4', label: '', readonly: true },
    { input: 'node1',  output: 'api', label: '', readonly: true },
    { input: 'node2',  output: 'api', label: '', readonly: true },
    { input: 'node3',  output: 'api', label: '', readonly: true },
    { input: 'node4',  output: 'api', label: '', readonly: true },

    // { input: '',  output: '', label: '', readonly: true },
    // { input: '',  output: '', label: '', readonly: true },
    // { input: '',  output: '', label: '', readonly: true },
    // { input: '',  output: '', label: '', readonly: true },
    // { input: 'node-1',  output: 'node-4', label: 'Link 3', readonly: true, className: 'my-custom-link-class' },
  ]
});

const OverviewDiagram = () => {
  // create diagrams schema
  const [schema, { onChange }] = useSchema(initialSchema);

  return (
    <div style={{ height: '152.5rem' }}>
      <Diagram schema={schema} onChange={onChange} />
    </div>
  );
};

export default OverviewDiagram;
