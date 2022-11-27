use serde::{Serialize, Deserialize};

use crate::contracts;
use crate::types::TxRef;
use crate::TransactionStatus;
use crate::contracts::AccountIdWrapper;

use crate::std::collections::BTreeMap;
use crate::std::string::String;


#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Details {
    counter: u32,
    note: String,
}

/*
impl Details {
    pub fn new() -> Self {
        Default::default()
    }
}
*/

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct HelloWorld {
    details: Details,
    account_details: BTreeMap<AccountIdWrapper, Details>,
}

/// The commands that the contract accepts from the blockchain. Also called transactions.
/// Commands are supposed to update the states of the contract.
#[derive(Serialize, Deserialize, Debug)]
pub enum Command {
    /// Increments the counter in the contract by some number
    IncrementCounter {
        value: u32,
    },
    DecrementCounter {
        value: u32
    },
    AddNote {
        value: String,
    },
    DeleteNote {},
    IncrementAccountCounter {
        value: u32,
    },
    DecrementAccountCounter {
        value: u32
    },
    AddAccountNote {
        value: String,
    },
    DeleteAccountNote {},
}

#[derive(Serialize, Deserialize, Debug)]
pub enum Error {
    NotAuthorized,
    SomeOtherError,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Request {
    GetCounter,
    GetNote,
    GetDetails,
    GetAccountCounter,
    GetAccountNote,
    GetAccountDetails,
    // GetSomeoneElseNote { // need identifier
    // 
    // }
}

#[derive(Serialize, Deserialize, Debug)]
pub enum Response {
    GetCounter {
        counter: u32,
    },
    GetNote {
        note: String,
    },
    GetDetails {
        details: Details,
    },
    GetAccountCounter {
        counter: u32,
    },
    GetAccountNote {
        note: String,
    },
    GetAccountDetails {
        details: Details,
    },    
    NoAccount,
    AccountHasNoDetails,
    Error(Error),
}

impl HelloWorld {
    pub fn new() -> Self {
        Default::default()
    }
}

impl contracts::Contract<Command, Request, Response> for HelloWorld {


    // Returns the contract id
    
    fn id(&self) -> contracts::ContractId { contracts::HELLO_WORLD }


    // Commands
    // i.e. extrinsics (transactions)
    
    fn handle_command(&mut self, origin: &chain::AccountId, _txref: &TxRef, cmd: Command) -> TransactionStatus {
        match cmd {
        
            // global
            Command::IncrementCounter { value } => {
                self.details.counter += value;
                return TransactionStatus::Ok;
            },
            Command::DecrementCounter { value } => {
                self.details.counter -= value;
                return TransactionStatus::Ok;
            },
            Command::AddNote { value } => {
                self.details.note = value;
                return TransactionStatus::Ok;
            },
            Command::DeleteNote {} => {
                self.details.note = String::from("");
                return TransactionStatus::Ok;
            },

            //personal account
            Command::IncrementAccountCounter { value } => {
                let current_user = AccountIdWrapper(origin.clone());
                if self.account_details.contains_key(&current_user) {
                    let mut new_counter = self.account_details[&current_user].counter;
                    new_counter += value;                    
                    let note = self.account_details[&current_user].note.clone();
                    let account_details = Details { 
                        counter: new_counter,
                        note: note,
                    };
                    self.account_details.insert(current_user, account_details);
                } else {
                    let account_details = Details { 
                        counter: value,
                        note: String::from("")
                    };
                    self.account_details.insert(current_user, account_details);
                }
                return TransactionStatus::Ok;
            },
            Command::DecrementAccountCounter { value } => {
                let current_user = AccountIdWrapper(origin.clone());
                if self.account_details.contains_key(&current_user) {
                    let mut new_counter = self.account_details[&current_user].counter;
                    new_counter -= value;                    
                    let note = self.account_details[&current_user].note.clone();
                    let account_details = Details { 
                        counter: new_counter,
                        note: note,
                    };
                    self.account_details.insert(current_user, account_details);
                } else {
                    let account_details = Details { 
                        counter: 0,
                        note: String::from("")
                    };
                    self.account_details.insert(current_user, account_details);
                }
                return TransactionStatus::Ok;                
            },
            Command::AddAccountNote { value } => {
                let current_user = AccountIdWrapper(origin.clone());
                if self.account_details.contains_key(&current_user) {
                    let account_details = Details { 
                        counter: self.account_details[&current_user].counter,
                        note: value,
                    };
                    self.account_details.insert(current_user, account_details);
                } else {
                    let account_details = Details { 
                        counter: 0,
                        note: value
                    };
                    self.account_details.insert(current_user, account_details);
                }
                return TransactionStatus::Ok;
            },
            Command::DeleteAccountNote {} => {
                let current_user = AccountIdWrapper(origin.clone());
                if self.account_details.contains_key(&current_user) {
                    let account_details = Details { 
                        counter: self.account_details[&current_user].counter,
                        note: String::from(""),
                    };
                    self.account_details.insert(current_user, account_details);
                } else {
                    let account_details = Details { 
                        counter: 0,
                        note: String::from("")
                    };
                    self.account_details.insert(current_user, account_details);
                }
                return TransactionStatus::Ok;
            },
        }
    }


    // Queries
    
    fn handle_query(&mut self, origin: Option<&chain::AccountId>, req: Request) -> Response {

        let inner = || -> Result<Response, Error> {
            match req {
                Request::GetCounter => {
                    return Ok(Response::GetCounter {
                        counter: self.details.counter.clone()
                    });
                },
                Request::GetNote => {
                    return Ok(Response::GetNote {
                        note: self.details.note.clone()
                    });
                },
                Request::GetDetails => {
                    return Ok(Response::GetDetails {
                        details: self.details.clone()
                    });
                },
                Request::GetAccountCounter => {
                    match origin {
                        Some(some_origin) => {
                            let current_user = AccountIdWrapper(some_origin.clone());
                            if self.account_details.contains_key(&current_user) {
                                let response = Response::GetAccountCounter {
                                    counter: self.account_details[&current_user].counter
                                };
                                return Ok(response);
                            } else {
                                return Ok(Response::AccountHasNoDetails);
                            }
                        },
                        None => {
                            return Ok(Response::NoAccount);
                        }
                    }
                },
                Request::GetAccountNote => {
                    match origin {
                        Some(some_origin) => {
                            let current_user = AccountIdWrapper(some_origin.clone());
                            if self.account_details.contains_key(&current_user) {
                                let response = Response::GetAccountNote {
                                    note: self.account_details[&current_user].note.clone()
                                };
                                return Ok(response);
                            } else {
                                return Ok(Response::AccountHasNoDetails);
                            }
                        },
                        None => {
                            return Ok(Response::NoAccount);
                        }
                    }
                },
                Request::GetAccountDetails => {
                    match origin {
                        Some(some_origin) => {
                            let current_user = AccountIdWrapper(some_origin.clone());
                            if self.account_details.contains_key(&current_user) {
                                let response = Response::GetAccountDetails {
                                    details: self.account_details[&current_user].clone()
                                };
                                return Ok(response);
                            } else {
                                return Ok(Response::AccountHasNoDetails);
                            }
                        },
                        None => {
                            return Ok(Response::NoAccount);
                        }
                    }
                },
            }
        };
        match inner() {
            Err(error) => Response::Error(error),
            Ok(resp) => resp
        }
    }
}

