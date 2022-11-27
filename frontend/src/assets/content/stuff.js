const oracleMork = { name: 'Mystic Mork', nodeName: 'LR Proprietor lookup', nodeId: '5CwXfXU7zayJHNJkC9mfT2waDoY48MU4gNtQWtU7ThRnqEz2', jobId: '9adf89a689154509a053d6e3383304b5' };

const oracles = {
  default : {
    name: 'Mystic Mork', nodeName: 'LR Proprietor lookup', nodeId: '5CwXfXU7zayJHNJkC9mfT2waDoY48MU4gNtQWtU7ThRnqEz2', jobId: '9adf89a689154509a053d6e3383304b5', 
  },
}

oracles[undefined] = oracles.default;

const wasmHashes = {
  'UK Land Reg. Proprietor lookup': 
    [ '0x55081337', '0x20025007' ],
  
  
  '0x55081337':
    { name: '1337: get proprietor 12/20 (UKLR)', 
      oracles: {
        'abcd': { name: 'UK Land Reg 1st party', jobId: '31415' }, 
        'efgh': { name: 'PropTech Oracle', jobId: '10101' } 
      },
      paramsRequired: ['Title Number'],
      paramsOptional: [],
    }, 
  '0x20025007':
    { name: '5007: get proprietor 04/20 (UKLR)', 
      oracles: {
        'abcd': { name: 'UK Land Reg 1st party', jobId: '00000' }, 
        'efgh': { name: 'PropTech Oracle', jobId: '11111' } 
      },
      paramsRequired: ['Title Number'],
      paramsOptional: [],
    },    

  'BTC get input addy from tx amount': 
    ['0xf00baba2'],
  '0xf00baba2':
    { name: 'aba2: BTC input addys (blockchain.info)', 
      oracles: {
        'abcd': { name: 'Anyblock', jobId: '11111' }, 
        'abcd': { name: '01Node', jobId: '22222' }, 
        'efgh': { name: 'oracleMork', jobId: '33333' } 
      },
      paramsRequired: ['outputAmount'],
      paramsOptional: ['outputAddy'],
    }, 
  '0x87654321':
    { name: '4321: BTC input addys (blockchain.info)', 
      oracles: {
        'abcd': { name: 'Anyblock', jobId: '44444' }, 
        'efgh': { name: 'oracleMork', jobId: '55555' } 
      },
      paramsRequired: ['outputAmount'],
      paramsOptional: ['outputAddy'],
    }, 
  '0x01010101':
    { name: '0101: BTC input addys (blockchain.info)', 
      oracles: {
        'abcd': { name: 'Anyblock', jobId: '66666' }, 
        'efgh': { name: 'oracleMork', jobId: '77777' } 
      }  ,
      paramsRequired: ['outputAmount'],
      paramsOptional: ['outputAddy'],
    },

  'Chainalysis is it dutty?': 
    ['0x001afecc'],
  '0x001afecc':
    { name: 'fecc: multiple address taint check (Chainalysis)', 
      oracles: {
        'abcd': { name: 'oracleMork', jobId: '88888' }, 
        'efgh': { name: 'Chainalysis', jobId: '99999' } 
      } ,
      paramsRequired: ['addresses'],
      paramsOptional: ['markerWhitelist', 'markerBlacklist'],
    }, 
}

const knownJobTypes = [
  'UK Land Reg. Proprietor lookup', 
  'BTC get input addy from tx amount', 
  'Chainalysis is it dutty?'
];


const wrappedAssets = [
  'ETH'
];



export { oracles, wasmHashes, wrappedAssets, knownJobTypes }