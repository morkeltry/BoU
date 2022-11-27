


Bridge of Unity is designed from the outset to be interoperable witth different networks each 'doing one thing well'. It is also designed from the outset to (where possible) generalise it's communication with those networks, in order that similar networks can be used instead. For example, we generalise communication with oracles by treating different oracle networks as 'compilation targets'. As we begin with Chainlink, the largest oracle network, our intermediate compilation target is an extension of Chainlinks Job Sepecification JSON.

Where generalising is not possible, we take design decisions from the outset to reduce the complexity in modularising access to those networks. For example, though Phala is a blockchain using private, contract-based state and it's state can suit our needs, we instead use a stateless system of tokens for controlling funds and keep the minimal state that we need (the registration of offers and of oracle answers) in simple registries. This will allow us to offer the choice of a privacy layer based on a very dissimilar technology, zk-STARKS, in future (as pure functions on either Phala or a zk network such as Starks Network can simply make statements about inputs, instead of co-ordinating state with other networks).

#### Chainlink JSON extension and 'compilation targets'

Chainlink is currently technically capable of doing all the we need, including returning arbitrary length answers, and accepting parameters to jobs.
However, these currently need to be done using unwieldy and expensive hacks. In particular, input parameters need to be separately uploaded to some trustworthy location (ie a blockchain) and then accessed using an external adapter implemented on the oracle node.
While transaction cost is a problem with multiple solutions in progress, the code complexity of this solution makes inappropriate for general use.

This is one example of where Bridge of Unity will extend Chainlink functionality (by providing infrastructure to do this), and generalise its communication with oracles (by defining an API to pass params to an 'extended Chainlink' job. Though the implementation may be inefficient on Chainlink itself, newer oracle networks or version of Chainlink will be additional 'compilation targets' for this standardised language).

#### A standard language for oracle jobs

In the case of params in vanilla-Chainlink, the solution is to place the problematic, variable part (the params) on a layer capable of dealing with them (a separate blockchain accessed with an external adapter) and then wrap the entirety in a language (ie 'extended Chainlink JSON', which allows for params with no fuss) which abstracts away the difference between the layers.

Other tricky cases require solutions on other layers. In particular, API keys for web 2.0 APIs cannot be shared between oracle nodes, and with their customers. They essentially need to be added to each request on a case by case basis, meaning that whether defined in Chainlink Job Spec JSON, or 'extended Chainlink JSON', each node is running a different job spec, even to do the same thing.

We propose, again, abstracting the tricky part to a different layer, in this case a purely logical layer: a pure function (which we are calling 'a WASM') which, given a valid API key, will return a JSON job spec which will succesfully run the job. Passing in input params can also be trivially abstracted up to this layer.

With the node-specific factors such as authorisation (API keys) and implementation details removed to this layer, we gain the ability to audit specific WASMs as open-source code able to produce reproducible results. We therefore can treat oracles as dumb conduits of information which allows for the behaviour of the oracles to be easily verified if malicious or malfunctioning. The increased simplicity will also reduce the aggregate threat surface for attacks over multiple oracles nodes, which is important if we are dealing (as Bridge of Unity does) with niche data which cannot be as effectively decentralised.
