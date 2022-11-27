<p align="center">
  <img width="2560" src="https://github.com/morkeltry/mnuchain/raw/main/shared_assets/plan%20v1.jpg">
</p>

## The (substrate) contracts

### Wrapper contract

##### (externally provided)

The wrapper contract mints wrapped assets corresponding to assets on chains which it can verify, or burns those wrapped assets when a message or authorisation is generated to release the asset on its native chain.

Each native asset type corresponds to a contract on its native chain, handling the holding and release of native assets when the wrapper mints or burns.

The wrapper contract can also transfer ownership of wrapped assets to the registration contract.

Assets may be fungible, non fungible, or fungible but indexed by a unique ID (rather than by owner's address), to allow for remainder-based withdrawal.

Any wrapper contract depends on trusted parties. Different networks such as Kyber or Republic Protocol (REN) guarantee this trust in different ways. Separately from the different trust models, in every case the security of the network increases with the number of (distinct) trusted nodes. It is recommended, therefore, to use the largest and most used wrapper network available (which currently is REN).

### Registration (and escrow) contract

##### (Bridge of Unity substrate chain)

The reg contract is the most complex and (along with the oracle jobs) deals with the business logic of transactions.
It registers offers of sale. These offers are complex and exact (as they are hashed) and so currently must pre-agreed. There will be future use cases, though, where offers may instead be open.

The registration contract acts upon instructions received by way of release tokens from the verifier contract. Every deposited payment asset is deposited against and stored against a hash derived from a specific offer specification. Therefore assets can only ever be released from the offer with which they are associated. Other than the amount of asset remaining, there is no accounting required by this contract. It is minimally stateful, maintaining only the offer hash, the seller deposit and the amount of the payment asset remaining.

#### Offers

Offers are not live code but are a specifcation, containing details of the wrapped asset and the conditions required for it to be transferred. The seller (of the non-chain asset) initiates the offer, specifying conditions which define the sale asset.

To maintain the incentivisation to progress transactions, an offer also includes parameters for two curves (of order <=2) defining dynamic transation costs between buyer and seller. These curves allow not only buyers, but also a griefing seller to incur a cost, in which case a seller needs to place a deposit to register an offer.

Offers contain some of the logic which define whether a transfer has taken place (some is contained in the oracle job). Offers contain all of the parameters (except timestamps) needed for the verification contract to ascertain buyer-seller transaction costs.

In this proof-of-concept, the transfer logic is simple, consisting of a list of oracle jobs (and their parameters) and a threshold specifying the number of jobs which must report success (or pass through non-boolean results as params to the next oracle job). Note that in this simplified logic, oracle jobs may only report success or failure or pass forward results, so comparisons must be performed by adapters to the oracle job, given parameters which are specified in the offer and passed to the oracles.

In future versions, offers will contain simple declarative code consisting of `{}`,`AND`, `OR()`, `<`, `>`, `=` to allow the use of more general purpose public oracle jobs. See [logic V0, V1, V2](#) 

#### Asset release

The registration contract allows part or all of the wrapped assets attached to an offer to be released. If transfer of the sale asset was successful, this will be on production of an authorisation token generated for the seller by the verification contract and signed by it's secure enclave. If transfer did not take place (or is late), the buyer (who deposited the wrapped asset) may release part of their asset, according to what the future successful seller would never be able to claim - as defined by the asset interest curve. A asset interest curve should be quadratic (in time) in order to increase the refundable part of the buyer's asset quickly after the point at which it is unlikely that transfer will take place. 

#### Opportunity Cost Curve and Asset Interest Curve
Since it is the buyer who deposits a liquid asset for potentially a long time, the seller's opportunity cost curve guards only against a buyer who delays in depositing the wrapped asset and so would usually be small. The curve would usually be constant, only covering the seller's transaction fees, or it may be linear to incentivise the buyer to act fast.
Once the buyer has deposited the wrapped asset against the registration contract, she does not need to do anything more. The sale asset will be transferred or, if it is not or it is late, the seller's 'rent' on the buyers asset (or the entire buyer's asset) will be waiting in the registration contract when she returns.

The seller should act quickly and the asset interest curve should incentivise this. Both curves are defined in terms of a constant-time block number, acting as a timestamp. The asset interest curve may have a cutoff point, before which if the transfer is completed and registered in the answers contract the seller incurs no fees. After this, the seller incurs fees to the buyer as defined by the parameters of the (linear or quadratic) rent curve. The rent curve should be quadratic and increase after a certain time in order to allow for a refund to the buyer if the seller becomes non-cooperative.
Warning: In the current version of Bridge of Unity, this circumstance will sacrifice privacy, as since the curve is punitive to a seller who does not register completion quickly, the seller is incentivised to stop the clock on the asset interest curve as soon as possible, thus allowing the possibility of a timing attack where an eavesdropper can link the offer ID (and therefore the encrypted offer and deposited asset) to the oracle runs (and therefore the real-world asset). The parties should therefore agree beforehand whether they are happy to sacrifice this privacy for the benefit of a gradual asset interest curve. The alternative is to set an asset interest curve which remains at zero until time `aStart` and then increases sharply. The seller would then have the freedom to stop the clock on the asset interest curve at any point between transaction completion and time `aStart` without fees.
When Bridge of Unity builds in cross-chain lookups between the verifier and answers contract, the verifier can take care of this logic by checking, privately, for transaction completion.

The result of the seller's opportunity cost curve is calculated from number of blocks from the registration of the contract to the deposit of the wrapped asset in the reg contract. 
The rent curve is defined in terms of the number of blocks from the deposit of the wrapped asset into the reg contract, until the latest oracle answer relied upon in a verification. Note that the seller must therefore watch the same data sources as the oracles, in order to request oracle answers to be registered as early as possible. After oracle answers are registered, the seller may submit these answers for verification at any time and as many times as he wishes, with the buyer-seller transaction fees remaining the same.


#### Payment Release Curve
Payment Release Curves are future functionality, allowing the payment for an asset to be released gradually even after the transfer is complete. This is to prevent malicious sellers who may find an opportunity to exploit some state of the real-world/ APIs known only to them to be temporary, for example a compromised set of oracles; lag or uncertainty in real-world systems; or states, such as fraud or a 'clean' reference from, eg, Chainalysis which may be partly under the seller's control.

Payment Release Curves should work hand in hand with revocablity (according to terms predefined in the offer) in the answers contract.

<p align="center">
  <img width="2560" src="https://github.com/morkeltry/mnuchain/raw/main/curves_chronology.jpeg">
</p>


### Answers contract

##### (Bridge of Unity substrate chain)

The answers contract calls oracle jobs when requested and stores the results.
In V0, we use [a substrate external adapter and initator](https://github.com/smartcontractkit/chainlink-polkadot) for Chainlink. The principle of decentralisation applies to oracles networks as well as oracle nodes and Bridge of Unity should connect to multiple oracle networks in order to provide verification of, and a basis of comparison for auditing of, oracle results.

Since one offer may have multiple answers (even from the same job) stored, the answers are indexed by an arbitrary ID. This can be calcluated by encrypting the offer ID and a nonce with the buyer and seller's public key. This allows the buyer to search the registered answers if necessary (eg suspected manipulation).

A stored answer contains the oracle node ID, job ID, and the parameters it received (including the timestamp of the request, which is added to the request by the answers contract). The parameters to the oracle job are encrypted with the oracle node's own key so that the answers contract does not handle unencrypted details fo the request (except the timestamp, node ID and job ID). The oracle job encrypts the answer it returns to the answers contract with the buyer and seller's public key and this encrypted answer it what is stored. 

The answers contract will, given the (encrypted) ID, report any stored answer to anyone requesting it, including the verification contract. The answer will, however, be encrypted.

The answers contract will incur costs in dealing with requests for answer updates. It will therefore need to accept payment in tokens. This cost should be factored into the sale price by the seller.

Future functionality would allow answers to be 'revoked', or de-indexed given certain conditions (some form of external arbitration, or, via functions in the Bridge-of-Unity system, a threshold of contradictory later answers). If no indexed answers attest to the transfer, payment release will be frozen. In conjunction with an appropriate Payment Release Curve, this would prevent a bait-and-switch -ing seller from receiving payment.

### Verification (confidential) contract

The verification contract lives on the Phala blockchain (to make use of its secure enclave- the pRuntime) and will in future make cross chain calls to the Bridge of Unity chain using the cumulus pallet.
Currently signed stateless information passed between contracts in transactions takes the place of cross chain messaging.

It is called by the seller, as many times as he wishes, and on successful verification will provide signed release tokens authorising the release of some or all of the wrapped asset registered against an offer.

The seller will specify how much of the asset they wish to release. In order to reduce state checks in the system, however, the seller specifies the amount not by how much to release, but how much should remain with the registration contract after release. The tokens, therefore, are worthless to reuse (unless less than the full amount authorised was released). The tokens do not necessarily specify a beneficiary but are encrypted with the seller's chain ID or a public key which the seller may specify. The beneficiary is then determined by the user able decrypt the token.

To receive a token, the seller must provide the offer ID, a set of answer IDs satisfying the conditions the offer specifies, the cleartext of the offer and answers, the shared public key in order to recreate the encrypted offer and the oracle-signed answers. He also specifies an amount-remaining-after-release, optionally a recipient and optionally an public key with which to encrypt the token.

Verification takes place in pruntime.

In future versions, users will have a choice of TEE-based confidentiality (Phala) or zero-knowledge based (eg Starks Network), since:
(1.) the work of the confidential verifier consists of simple calculation upon inputs which may be hypothetical but are demonstrated not to be by signing by entities external to the verifier (ie oracle nodes. A zk-proof could as well verify suitable signatures.
(& 2.) the output of the confidential verifier is a token which is stateless (it does not directly alter the state of another contract or chain, and it is the external contract's balance, not the verifier, which changes state when tokens are applied).


