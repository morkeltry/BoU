<p align="center">
  <img width="2560" src="https://github.com/morkeltry/mnuchain/raw/main/shared_assets/brucke-der-einheit-banner.png">
</p>

# Bridge of Unity

Bridge of Unity is a substrate-based chain which uses any supported oracle to facilitate the transfer of wrapped cryptocurrencies, conditional upon events which are verifiable from trusted APIs.

### Mnuchain?
Bridge of Unity's development title was Mnuchain, after the guy that inspired it ( ͡° ͜ʖ ͡°)

##  [Structure of contracts](https://github.com/morkeltry/mnuchain/blob/main/structure_overview.md)

##  [Protocol overview](https://github.com/morkeltry/mnuchain/blob/main/protocol_overview.md)

## Use cases

### Registrable assets
#### Sale between untrusted parties
In many jurisdictions, certain classes of assets (eg real estate) are not legally complete until registered with a government agency. This is often backed by a provision in law eg [\(in the UK\)](https://www.legislation.gov.uk/ukpga/Geo5/15-16/21/section/69/enacted) that the government's register is the primary source of truth in cases of ownership disputes. (In the UK the accuracy of the land register is also [guaranteed](https://www.legislation.gov.uk/ukpga/Geo5/15-16/21/section/83/enacted)).

Registration can take some time and may be subject to delays around the seller's identity and right to sell, so buyers and seller usually use a middleman such as a solicitor. Where no regulated middleman is involved, the period of transfer is one of uncertainy where one or both party has to place their trust in the other to complete the transaction.
Bridge of Unity in this case is the blockchain equivalent of escrow. The buyer must wrap and lock the funds for the transaction and these will only be released either by mutual agreement, by dispute arbitration, or by the seller proving the completeness of transfer using results from authoratiative APIs.

#### Lease agreements
Bridge of Unity uses time-curve based incentivisation to hedge against the risk of a 'griefing' buyer of seller, or against the seller being slow.
The seller's funds are effectively locked for the duration of the transfer, which creates an opportunity cost. The seller can opt to charge 'rent' accordng to an agreed curve to hedge this cost, which will be refunded or offset when the transfer is complete. For example, if a transfer is expected to take six weeks, the price of the Opportunity Cost Rent Curve over six weeks can be added to the original offer price. If the transfer instead takes nine weeks, then the seller will still receive the increased price including the compensation for six weeks 'rent', but will need to top their deposit up to pay for nine weeks of the rent curve in order to release their payment.

Where no guarantees such as those provided by the UK government for land transfer are available, the buyer and seller can agree a Payment Release Curve for the payment to provide a degree of finality for the buyer by waiting out the period for dispute periods provided by the external authority.


If this period is long, the arrangement could be considered a lease, which could be useful for sellers who are taxed less on income than on capital gains.
The downside of a lease like this is that the buyer would need to wrap and lock the full price over the life of the transfer. In future, we will add functionality to the escrow contract to allow functions of the locked wrapped assets like staking to be composed with other defi protocols.


#### Tokenisation
It is inherent to the design of Mnuchain that we include wrapping contracts for pre-existing digital assets.
There is nothing to prevent, however, a digital asset being designed to be backed by non-digital assets held by a legal custodian. If there is no requirement for confidentiality in the actual issue and mining of the digital assets, then both fungible and non-fungible tokenised assets could be wrapped (or mined) on Mnuchain in order to automate the custody process. 

Mnuchain does not solve the legal issues around tokenisation, but could provide a step towards automation of taking custody of assets. If the custodian has AML/ KYC requirements, these could be fulfilled either by wrapping tokens from a compliant tokenisation platform such as DMM, or by requiring an equivalent jurisdiction-based 'right-to-transact' NFT without monetary value to be transferred in addition to the valuable real-world asset.


### Assignment of risk
#### A Glienicke bridge
As the world's financial authorities coalesce to demanding KYC all over the crypto ecosystem, holders of crypto assets which have some kind of 'taint' in their history are at risk of being locked out of the systems, such as exchanges and CBDCs, which are within reach of those authorities.
Bridge of Unity allows as much of this risk as can be defined programmatically using APIs to be externalised to the asset seller. This extends to crypto assets and CBDCs just as for cars and houses. A buyer and seller can agree that the transfer of a crypto asset will only be only complete if an AML API such as Coinfirm has cleared the asset as non risky. In future, there will no doubt be similar APIs to confirm assets comply with the FATF travel rule.

As Bridge of Unity allows confidential exchange, its wrapped payment assets may in future be seen as a privacy coin, non-compliant with the travel rule. 
Since the _exchange_ of assets is confidential (unlike the _transfer_ of the bought assset), the bought asset will not be associated with Bridge of Unity and cannot be subjected to programmatic transaction censorship.

#### Insurance
Insurance could be defined as the paying out of claims on an undercollateralised pool, conditional on certain events occurring.
Bridge of Unity will accept any wrapped asset visible to chains in the Polkadot network, and pays claims based on events verifiable over web 2.0 APIs.
Events which can be unambiguously verified by APIs are suitable to be insured aginst using Bridge of Unity and a wrapped token representing claims on an insurer's pool of reserves.


## How to use Bridge of Unity

#### Agree a sale
Buyer and seller agree, out of band, the _sale_ of any asset whose transfer can be verified programmatically using APIs supported by Mnuchain-compatible oracles, for which the buyer will _pay_ in any crypto asset which can be wrapped by Mnuchain.
The price is defined by a wrapped asset class ID plus the amount (of that asset).

The sale asset is defined by: a set of oracle job groups, joined by rules such as 'THRESHOLD' to specify consensus between a threshold of the oracles in the group, or 'THEN', to specify passing the output of the group conensus through to the next oracle job group.
Each job group consists of a WASM hash corresponding to a particular WASM function which is implemented by the Node ID / Job ID pairs in the group; those Node ID / Job ID pairs; the parameters to pass to the job; optionally the time range over which its output must be polled to be valid.

At the outset, considerations such as the Opportunity Cost Rent Curve, Payment Release Curve, Asset Interest Curve, Asset Interest Deposit and dispute mechanism should be agreed.


#### Agree a key
Buyer and seller agree a single shared keypair with which to encrypt the Offer (Sr25519 for SubstraTEE, RSA for Phala)


#### Wrap
The buyer creates the payment asset either by splitting an existing wrapped asset, or by wrapping an external crypto asset.
The wrapped assets may represent either fungible or non-fingible crypto assets, or a combination.
If the seller will leave a deposit, they do the same with the deposit.


#### Register the offer
The seller creates an Offer using the previously agreed details, encrypts with their shared key, takes the Blake2_256 hash of this encrypted blob and registered the hash in against the offers registration contract, which stores only a hash, but emits the full encrypted offer as an event. If the seller agreed to pay a deposit, this will be paid at the same time or later and registered against the stored hash. The deposit curve is stored as a separate object encrypted with the same shared key (so that it can be separately verified).

The seller may transfer the deposit (if any) to the registration contract either at the same time or later after the buyer has had a chance to verify the Offer.

The seller may share the offer (as cleartext or encrypted) with the buyer or the buyer may retreive the Offer by decrypting the ciphertext contained in the event emitted at registration.


#### Lock funds
The seller transfers ownership of any specified wrapped asset (deposit asset) into the Escrow contract if a deposit was agreed.

Once they have done (or if they don't need to), the buyer transfers ownership of the specified wrapped asset (payment asset) to the Escrow contract.

#### Offchain transfer
Once the buyer deposits the payment asset, the clock starts on the asset interest payable by the seller.

The seller should therefore 1) begin the offchain transfer of the assets as soon as possible and 2) pay attention to the verification API/s to ensure they can register completion as soon as possible (it is envisioned that the seller would employ a watcher to regularly run the jobs that will be run by the oracles).

If the seller is able (eg has appropriate API keys), they should emulate the oracle nodes by running the WASM specified by the hash in the Offer, with the same parameters.


#### Register completion
If the API appears to be confirming the successful transfer, the seller should request the Answers contract to update.

The request's parameters are: 1) The shared public key, 2) The Offer ID encrypted using the shared public key and 3) a set of triples where the oracle node ID and job ID (or WASM hash) on that node are in cleartext and a parameters object is encrypted using the node's public key. Each params object, as well as the node and job IDs, should match exactly those specified in the Offer.

The Answers contract encrypts the current timestamp and requests to each oracle node using:

1) The job ID; 2) the encrypted parameters; 3) The shared public key; 4) timestamp (at time of request); 5) a callback which is a closure of a function which updates its own index of answers, indexed by encrypted (Offer ID + nonce).

Each oracle node should support asymmetric encryption (RSA for a system with Phala confidentiality, but potentially SR25519 if using SubstraTEE) on the node. If the oracle is runing on Chainlink, this would be an 'adapter'. Each oracle job should, as the last task of its job, encrypt its answer with the key provided. Oracles should also implement a decrypt method to decrypt jobs which were encrypted by the node's own published private key

After this process completes and calls back, the Answers contract will take either the full encrypted answer set or a set of full encrypted answers and 1) emit this/these as an event/ events (or cause them to be stored on IPFS) and 2) add a storage entry indexed under a 32byte cast of the encrypted (Offer ID + nonce), containing a hash of the encrypted answer set (or a set of hashes of each encrypted oracle answers).

This leaves a record, viewable only to the buyer and seller (and locateable by each even if not disclosed), but verifiable by a third party to whom they choose to share the pubkey. This third party verification allows for: 1) a future arbitration layer and 2) for Payment Release Curves to add a payout delay allowing a window for some protection against bait-and-switch, by adding functionality to the answers contract to revoke answers based on conditions to be specified in an offer.


#### Authorise withdrawal
Using the shared key, the seller may decrypt as much of the Answers contract entry (at the index of their encrypted job ID) as is necessary to prove a claim consistent with the Offer.

Assuming their claim will be successful, the seller may make a Payment Release Request to the confidential contract. This request should result in a token, which the seller can choose to use or not and multiple requests can be made, as requests made at different times may authorise different amounts to be withdrawn (according to the agreed time-curves).

The request is encrypted in full with the contract's TEE key and consists of: 

1) The Claim, made up of: ID of the wrapped asset claimed, the amount of the asset _not_ to be claimed (ie the amount to leave in escrow for the time being) and the beneficiary of the claimed slice of the asset;

2) A proof, made up of: The Offer ID, a set of paths to the oracle answers in the Answers contract which will verify the claim and the shared private key to decrypt them;

3) A statement of timestamp (to be verified against the oracles answers), for the purposes of calculating eligibility under the Payment Release Curve, and rent under the Opportunity Cost Rent Curve.

4) Optionally, an account to whom payment should be restricted. In the case that none is provided, the release token will allow the beneficiary to be set by the token bearer.

If all is in order, the confidential contract returns the Claim, signed with its key in order to authorise it.


#### Claim payment

The token received by the seller allows the seller to reduce the balance of the asset held by the Escrow contract down to the balance specified. It can be used immediately, or later, or can be superceded by a more valuable token (specifying a lower balance) or one with a different beneficiary.

The token is submitted to the Escrow contract together with a requested new escrow balance of at least the amount specified by the token (this would normally be the amount specified by the token). The contract then slashes its held asset down to the new balance and mints a new wrapped asset, assigning ownership to the beneficiary.








