### [Phala hello-world branch](https://github.com/Phala-Network/phala-blockchain)
(October 1st)

```
 git clone  https://github.com/Phala-Network/phala-blockchain.git
 cd phala-blockchain
 git checkout hello-world
 
 git clone https://github.com/paritytech/substrate.git
 cd substrate
 git checkout 2f3b20b727304a8d14b8f72
 cd ..
 
 rustup install nightly-2020-10-01-x86_64-unknown-linux-gnu
 rustup target add wasm32-unknown-unknown --toolchain nightly-2020-10-01
 nice -n 3 cargo +nightly-2020-10-01 build --release 

 
```

NB November 10th version (toolchain nightly-2020-11-10 ) was tried with commit 2f3b20b727304a8d14b8f72
but threw on 'accuracy must have a type' (possibly due to `ring` being updated in toolchain

### [Phala rococo / rococov1 branches ](https://github.com/Phala-Network/phala-blockchain/tree/rococov1)

```
 
 git clone  https://github.com/Phala-Network/phala-blockchain.git
 cd phala-blockchain
 git checkout rococo-v1
 
 git clone https://github.com/paritytech/polkadot.git
 cd polkadot
 git rev-parse --short HEAD
 ## expect: 08b217a06
 
 # If more than one chain will be attached to relay chain (eg chains talk to each other)
 # you will need to add validators here (see below)
 
 ## expect nightly-2020-10-02
 nice -n 3 cargo build --release --features=real-overseer
 
```
 
##### ^ Add more validators ^
 * `code node/service/src/chain_spec.rs`
 * CTRL-F for `rococo_local_testnet_genesis`
 * add: `get_authority_keys_from_seed("Charlie"),` 
  
  ([Explainer here](https://github.com/KILTprotocol/kilt-parachain))
  
##### Generate some authority keys

* For each identity, replace `Alizia` with, eg, `Alice` for well-known keys, or else identity name (or whatever you want)
```
  subkey -n polkadot inspect //Alizia//stash > Alizia-Account_and_ValidatorId
  subkey -n polkadot inspect //Alizia > Alizia-other_session_keys
  ## GRANDPA requires ed25519 (-e) not deafult sr25519
  subkey -n polkadot -e inspect //Alizia > Alizia-grandpa
  cat Alizia* Bobbi* Carlino*
```
  ([Explainer here](https://substrate.dev/docs/en/tutorials/start-a-private-network/keygen)
  
* output the rococo-local chainspec as JSON
  `./target/release/polkadot build-spec --chain rococo-local --disable-default-bootnode > rococo-custom.json`
* add public keys to the JSON file
  `code rococo-custom.json`

##### Run chain (3 validators)
```
 ./target/release/polkadot --validator --chain rococo-custom.json --tmp --rpc-cors all --ws-port 9944 --port 30333 --alice
 ./target/release/polkadot --validator --chain rococo-custom.json --tmp --rpc-cors all --ws-port 9955 --port 30334 --bob  --bootnodes /ip4/127.0.0.1/tcp/30333/p2p/<<ALICE NODE ID>>
 ./target/release/polkadot --validator --chain rococo-custom.json --tmp --rpc-cors all --ws-port 9966 --port 30335 --charlie  --bootnodes /ip4/127.0.0.1/tcp/30333/p2p/<<ALICE NODE ID>>  --bootnodes /ip4/127.0.0.1/tcp/30334/p2p/<<BOB NODE ID>>
```
NB for parsing errors refer [here](https://github.com/paritytech/cumulus/issues/126)


### [chainlink-polkadot using substrate 2.0](https://github.com/smartcontractkit/chainlink-polkadot)
(With many thanks to @LaurentTrk for solving the hard problems ;) )


```
 git clone https://github.com/smartcontractkit/chainlink-polkadot.git
 mv chainlink-polkadot chainlink-polkadot-official-2.0.0
 cd chainlink-polkadot-official-2.0.0/substrate-node-example
 rustup install nightly-2020-10-05
 nice -n 3 cargo +nightly-2020-10-05 build --release 
 cd ..

```
(before commit was [official](https://github.com/smartcontractkit/chainlink-polkadot/commits/338ecd4121e96d72446b58527d057221443b1a74), same but replace `smartcontractkit` with `mmagician`)


[Instructions](https://github.com/LaurentTrk/chainlink-polkadot/tree/substrate-2.0.0)

  [A note](https://youtu.be/uf1-oOZZNe0?t=753) on the use of 
   - Internal Initiators(IA) and 
   - External Adapters (EA) (eg substrate-adapter (SA)), specifically External Adapters that connect to a blockchain

  Repo uses `substrate-adapter` and `external-initiator` like this:
  <img width="500"  height="530" src="https://raw.githubusercontent.com/LaurentTrk/ki.dot/master/Ki.Dot.Components.png">


Clone and build these (or find a way to run them without docker!) :
```
 git clone https://github.com/LaurentTrk/substrate-adapter.git
 cd substrate-adapter
 docker build -t substrate-adapter .
 git checkout 296945b4
 ## NB October 8
 cd ..
 
 git clone https://github.com/LaurentTrk/external-initiator.git
 cd external-initiator
 docker build -t external-initiator .
 git checkout 3af59ef2
 ## NB November 2
 cd ..
 
```

substrate-adapter's Websocket :

The default endpoint hardcoded in `substrate-adapter` itself is `ws://127.0.0.1:9944`. For docker on Linux, this needs to be `ws://172.17.0.1:9944/` - pass it using `substrate-2.0.0/substrate-chainlink/docker-compose.yml`, `SA_ENDPOINT` envvar, or as first parameter to `./setup`, ie `./setup ws://172.17.0.1:9944/`.

`API-WS: disconnected from ws://localhost:9944: 1006:: connection failed` refers to the _substrate_ websocket ("disconnect" is misleading - it didn't connect!)

You will need to run a substrate chain with the chainlink pallet, which will also use port 9944, so maybe pass a different ws port then 9944 in commands above.
Get and run a a chainlink substrate chain by:
```
git clone https://github.com/smartcontractkit/chainlink-polkadot.git
cd chainlink-polkadot
rustup update
cd substrate-node-example
nice -n 3 cargo +nightly-2020-10-05 run --release -- --dev
## also accepts, eg: --ws-port 9977 but EI is likely set to look for port 9944.
```
substrate-adapter
(Untested docker version at https://github.com/LaurentTrk/chainlink-polkadot/tree/substrate-2.0.0 which contains a `scripts` folder)


Access it using the [Chainlink interface](http://localhost:6691) on [6691](http://localhost:6691)/[6692](http://localhost:6692)/[6693](http://localhost:6691) (U: notreal@fakeemail.ch P: twochains) and with the substrate frontend:
```
cd substrate-node-example/front-end
npm i
npm run start
```

TODO:

* How to set eth rpc chain id=3 to avoid `errVerbose=ethereum ChainID doesn't match chainlink config.ChainID: config ID=3, eth RPC ID=1` ?
* How to provide (EI?) keys to avoid `POST /v2/specs  ...  bad response '401 Unauthorized'` ?
* How did we get to: `Name test-ei already exists ... method=POST path=/v2/external_initiators` and `Bridge Type substrate already exists ... POST path=/v2/bridge_types` ?




