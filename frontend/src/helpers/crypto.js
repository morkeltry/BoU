import { blake2AsHex } from '@polkadot/util-crypto';
import { JSEncrypt } from 'jsencrypt'
import { stringChop } from './index'

const pemPubkeyRegex = /-----BEGIN PUBLIC KEY-----\s([\S\s]*)\s-----END PUBLIC KEY-----/
const whitespaceRegex= new RegExp('\n','g');

// pubkey==null => passes verification!!
// passes => return the unencrypted object (for, eg, Promise chains)
// fail => throw
const verifyEncrypted= ({ unencrypted, encrypted, pubkey })=> {
  if (!pubkey)
    return unencrypted
  const newEncrypted = encrypt (unencrypted, pubkey);
  if (encrypted===newEncrypted)
    return unencrypted
}

const pubkeyFromPem = key=> {
  const matches= key.match(pemPubkeyRegex);
  if (!matches)
    throw new Error('Not in PEM format');
  return matches[1].replace(whitespaceRegex,'')
}

const encrypt = (cleartext, pubkey)=> {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(pubkey);
  const chunks= stringChop(JSON.stringify(cleartext),98);
  console.log(chunks.join('\n'), pubkey);
  const result = chunks.map(chunk=>encryptor.encrypt(chunk)).join();
  console.log(result);

  console.log(encryptor);
  return result
}

const hash = cleartext=> 
  blake2AsHex(cleartext, 256);

export { verifyEncrypted, pubkeyFromPem, encrypt, hash }
