const didBtcAddyReceiveXAmount = 
{
  "initiators": [
    {
        "type": "external",
        "params": {
            "name": "myexternalservice"
        }
    }
  ],
  "tasks": [
    {
      "type": "HTTPGet",
      "confirmations": 0,
      "params": { 
        "get": "https://chain.api.btc.com/v3/address/ADDRESS/tx",
        "useCorsAnywhere": false
      }
    },
    {
      "type": "Copy",
      "params": { "copyPath": "data.list" }
    },
    {
      "type": "Some",
      "params": { "which": 1 }
    },
    {
      "type": "Copy",
      "params": { "copyPath": "inputs" }
    },
    {
      "type": "FindSibling",
      "params": { 
        "childPath": "prev_value",
        "matches": [ ],
        "returnMany": true,
        "sibling": "prev_addresses"
      }
    }
  ],
  "startAt": null,
  "endAt": null,
  "minPayment": "1000000000000000000"
}

// const landRegProprietorLookup = 
// const chainalysisTaintedAddressCheck = 

const spoofClJsons= {
  '0x55081337': { error: 'No CL job JSON data available', output: 'String(255)' },
  '0x20025007': { error: 'No CL job JSON data available', output: 'String(255)' },

  '0xf00baba2': { jobJson: didBtcAddyReceiveXAmount, output: 'Array [BTCAddress]' },
  '0x87654321': { jobJson: didBtcAddyReceiveXAmount, output: 'Array [BTCAddress]' },
  '0x01010101': { jobJson: didBtcAddyReceiveXAmount, output: 'Array [BTCAddress]' },

  '0x001afecc': { error: 'No CL job JSON data available', output: 'Array [markerType]' },
}

const descriptions= {
  '0x55081337': '',
  '0x20025007': '',

  '0xf00baba2': '',
  '0x87654321': '',
  '0x01010101': '',

  '0x001afecc': '',
}



const getJsonFromWasmHash = (wasmHash, spoofDescriptionData)=> new Promise((resolve, reject)=> {
  if (spoofDescriptionData) {
    const { name, paramsRequired, paramsOptional } = spoofDescriptionData;
    const input = { paramsRequired };    
    if (paramsOptional.length)
      input.paramsOptional = paramsOptional; 
    if (descriptions[wasmHash])
      spoofClJsons[wasmHash].description = descriptions[wasmHash];
    if (name)
      spoofClJsons[wasmHash].name= name;
    resolve ({...spoofClJsons[wasmHash], input })
  } else {
    // Lookup, eg, on IPFS
    // Or, locally, in the Chainlink jobs JSONs in mnuchainV0/substrate-front-end-template/src/JSONs
    reject ( {error: 'Not implemented'} );
  }
})


  const readSelectedFile = ev=> new Promise ((resolve, reject)=>{
    console.log('readSalePanel called');
    let { files }= ev.target;
    files=files || ev.dataTransfer.files;

    const fileReader = new FileReader();
    fileReader.onloadend = content=> {
      const result = fileReader.result;
      console.log('Loaded');
      if (files[0].type==="application/json") {
        console.log('resolve json');
        try {
          console.log('will resolve json');
          resolve(JSON.parse(result));
        } catch(e) {
          console.log(e);
        }
      } else
        resolve(result);
    };
    fileReader.onerror = err=>{
      console.log(err);
      reject(err);
    }

    console.log(files);

    fileReader.readAsText(files[0]);
  })


  // NB currently returns nor resolves nothing. Cross fingers and hop for no errors!!
  const readAndprocessFiles = processors => ev => new Promise ((resolve, reject)=>{
    let { files }= ev.target;
    files=files || ev.dataTransfer.files;

    console.log(files);

    Array.from(files)
      .map(file=> ({
        target:{files:[file]},
        preventDefault: x=>null,
        extension: file.name.endsWith('.pem') ? 'pem' :  file.name.endsWith('.json') ? 'json' : ''
      }))
      .map(file=>
        readSelectedFile(file)
          .then(x=>{console.log(x); return x })
          .then(processors[file.extension] || (x=>x))
      )
  })

  let oddEven=1;
  // TODO: replace cheeky fakery with substrate TxButton !
  const verifyonChainHash = hash=> new Promise((resolve, reject)=> {
    setTimeout (
      ()=>{ resolve(Boolean(oddEven)) }
      , 750+Math.random()*(1-Math.random())*6000)

  })


export { getJsonFromWasmHash, readSelectedFile, readAndprocessFiles, verifyonChainHash }