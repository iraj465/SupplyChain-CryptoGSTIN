import { Injectable } from '@angular/core';
const Web3 = require("web3");
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import * as SupplyChain from './shared/Contracts/SupplyChain.json';
import * as RawMatrials from './shared/Contracts/RawMatrials.json';
import * as Madicine from './shared/Contracts/Madicine.json';
import * as MadicineD_P from './shared/Contracts/MadicineD_P.json';
import * as MadicineW_D from './shared/Contracts/MadicineW_D.json';
import { Admin } from './components/admin/admin.model';

declare let require: any;
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class EthcontractService {
  private messageResult: any;

  /************************************************* Variables *************************************/
  private web3: any;
  private web3Provider: null;
  private account:any;
  private balance:any;
  // private contracts: any;
  private coinbase: "0x0000000000000000000000000000000000000000";
  public AdminAccount:any;
  public AdminBalance:any;
  private AdminDetails:Admin;
  public contract:any;
  contracts_SupplyChain: any;
  private contracts_RawMatrials: any;
  private contracts_MedicineW_D: any;
  private contracts_MedicineD_P: any;
  private contracts_Medicine: any;
  private contract_SupplyChain : any;
  private contract_RawMatrials: any;
  private contract_Medicine: any;
  private contract_MedicineW_D: any;
  private contract_MedicineD_P: any;
  private contractAddress_SupplyChain: "0x0000000000000000000000000000";


  /************************************************* Constructor ***********************************/
  constructor(private router: Router) {
    this.initAndDisplayAccount();
  }


  public checkAndInstantiateWeb3() {
     return new Promise((resolve, reject) => {
      let account_address = "";
          // let ethereum = window.ethereum;
          // let web3 = window.web3;
          // if(typeof ethereum !== 'undefined'){
          //   console.log('eth web3 found');
          //   await ethereum.enable();
          //   web3 = new Web3(ethereum);
          //   const accounts = await ethereum.enable();
          //   account_address = accounts[0];
          // }
          if (typeof window.web3 !== 'undefined') {
            console.log('metamask web3 instance found');
            window.web3 = new Web3(window.web3.currentProvider);
          } else {
            console.log('localhost web3 found');
            window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
          }
          this.web3 = window.web3;
          // console.log(this.web3);
          this.web3.eth.getAccounts((error, accounts) => {
            account_address = accounts[0];
            resolve(account_address);
          });
    })
    .then(function(result){
      return result
    })
  }

  public async getContract() {
    return new Promise((resolve) => {
      // let account_address = "";
      // console.log(this.web3);
      console.log('inside getContract');
      let networkId;
      this.web3.eth.net.getId()
        .then((netId: any) => {
          networkId = netId;
          const networkAddress = SupplyChain.networks[networkId].address;
          const contract = new this.web3.eth.Contract(SupplyChain.abi, networkAddress);
          resolve(contract);
        });

    //   setTimeout(() => { 
    //     resolve(this.contracts_SupplyChain);
    // }, 1000); 
    })
    .then(function(result){
      return result
    })
  }

  public async initAndDisplayAccount(){
    console.log('Web3 init');
    await this.checkAndInstantiateWeb3()
    .then((res: any) => {
      console.log("current address");
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
    this.getContract()
    .then(async (contract:any) => {
      this.contract = contract;
     this.AdminAccount = await this.contract.methods.Owner().call()
      .then(function(address:any){
       //owner address assigned to Adminaccount
        return address;
        // console.log(this.AdminAccount);
      });
      console.log('contract obtained');
      console.log('Admin address');
      console.log(this.AdminAccount);

    })
    .catch((err) => {
      console.log(err);
    });
    console.log('there goes the contract');
    // console.log(this.contract);
    
    var arr =  this.getOwner()
    .then(function (acctInfo:any) {
      if (acctInfo[2] == 'Success') {
        return acctInfo;
      } else {
        this.router.navigate(['/']);
      }
    }).catch((error) => {
      console.log(error);
      this.router.navigate(['/']);
    });
   //set admin creds
   this.AdminAccount = arr[0];
   this.AdminBalance = arr[1];
  }

  /************************************************* Basic *****************************************/
  public async getcoinbase() {
      window.web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        this.coinbase = account;
      }
    });
  }

  public async getAccountInfo() {
    return new Promise((resolve, reject) => {
      var account = "";
      this.web3.eth.getAccounts((error, accounts) => {
        account = accounts[0];
      });
          this.web3.eth.getBalance(account, function (err, balance) {
            if (err === null) {
              return resolve({ Account: account, Balance: this.web3.fromWei(balance, "ether") });
            } else {
              return reject("error!");
            }
          });
    });
  }

  /************************************************* Admin *****************************************/
public async getOwner() {
    return new Promise(async (resolve, reject) => {
      console.log('Inside getOwner');
      var acc ="";
      var contractOwner = this.contract;
      // console.log(this.contract);
      acc = await this.web3.eth.getAccounts((error, accounts) => {
        acc = accounts[0];
        return acc;
      });
      var account = acc.toString();
        console.log('current account');
        console.log(account);
        this.web3.eth.getBalance(this.AdminAccount,async function (err, balance) {
          if (err === null) {
            console.log(balance);
            console.log('separated');
            console.log(contractOwner);
            contractOwner.methods.Owner().call()            
                 .then(function (ownerAddress) {
                      if (ownerAddress == account) {
                  // that.contracts_SupplyChain.getUsersCount(function (error, userCount) {
                  // this.contracts_SupplyChain.getUsersCount(function (error, userCount) {
                  //   if (!error) {
                  //     resolve({ Account: account, Balance: this.web3.fromWei(balance, "ether"), Role: 'Success', contractAddress: this.contractAddress_SupplyChain, UserCount: JSON.parse(userCount) });
                  //   }
                  //   else
                  //     resolve({ Account: account, Balance: this.web3.fromWei(balance, "ether"), Role: 'Success', contractAddress: this.contractAddress_SupplyChain, UserCount: "Error" });
                  // })
                  console.log(account);
                  setTimeout(() => { 
                    resolve([account, balance, "Success"]); 
                }, 1000);
                  // resolve({ Account: account, Balance: balance, Role: 'Success' });
                }
                else {
                  resolve({ Account: account, Balance: this.web3.fromWei(balance, "ether"), Role: 'Success', contractAddress: this.contractAddress_SupplyChain });
                }
              })
            .catch((err) => {
              console.log(err);
            });
          } else {
            return reject("error!");
          }
        })

      
      }).then(function(result){
          return result;
        });
  }
  public getAdminDetails():Observable<any>{
    this.AdminDetails =
      {
        AdminAccount:this.AdminAccount,
        AdminBalance:this.AdminBalance
      };
    console.log('In get adminDetails');
    console.log(this.AdminDetails);
    return of(this.AdminDetails);
    
  }

  registerNewUser = (formdata) => {
    let that = this;
    formdata.Name = that.web3.padRight(that.web3.fromAscii(formdata.Name), 34);
    formdata.Location = that.web3.padRight(that.web3.fromAscii(formdata.Location), 34);

    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {

          // that.contracts_SupplyChain.registerUser(formdata.EthAddress, formdata.Name, formdata.Location, formdata.Role, {
          that.contracts_SupplyChain.registerUser(formdata.EthAddress, formdata.Name, formdata.Location, formdata.Role, {
            from: account
          }, function (error, result) {
            if (!error)
              resolve(result)
            else
              reject(error);
          });
        }
      });
    });
  }

  /************************************************* Users *****************************************/
  getRole = () => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.web3.eth.getBalance(account, function (err, balance) {
            if (err === null) {
              // that.contracts_SupplyChain.getUserInfo(
              that.contracts_SupplyChain.getUserInfo(
                account,
                {
                  from: account
                }, function (error, res) {
                  if (res) {
                    // console.log(res[0].substring(0,34))
                    var jsonres = {
                      "Name": that.web3.toAscii(res[0].replace(/0+\b/, "")),
                      "Location": that.web3.toAscii(res[1].replace(/0+\b/, "")),
                      "EthAddress": res[2],
                      "Role": JSON.parse(res[3])
                    }
                    return resolve({ Account: account, Balance: that.web3.fromWei(balance, "ether"), Role: jsonres });
                  }
                  else {
                    return reject(error);
                  }
                });
            } else {
              return reject(err);
            }
          });
        } else {
          return reject(err);
        }
      });
    });
  }

  getUserCount = () => {
    let that = this;
    return new Promise((resolve, reject) => {
      // that.contracts_SupplyChain.getUsersCount(function (error, userCount) {
      that.contracts_SupplyChain.getUsersCount(function (error, userCount) {
        if (!error) {
          return resolve({ UserCount: JSON.parse(userCount) });
        }
        else
          return reject(error);
      });
    });
  }

  getUserProfile = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      // that.contracts_SupplyChain.getUserbyIndex(index, {
      that.contracts_SupplyChain.getUserbyIndex(formdata.Index, {
        from: that.coinbase
      }, function (error, uinfo) {
        if (!error) {
          var jsonres = {
            "Name": that.web3.toAscii(uinfo[0].replace(/0+\b/, "")),
            "Location": that.web3.toAscii(uinfo[1].replace(/0+\b/, "")),
            "EthAddress": uinfo[2],
            "Role": JSON.parse(uinfo[3])
          }
          console.log(jsonres);
          resolve({ result: jsonres });
        }
        else
          reject(error);
      })
    });
  }

  getUsers = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      // that.contracts_SupplyChain.getUserInfo(account,
      that.contracts_SupplyChain.getUserInfo(formdata.AccountAddress,
        function (error, uinfo) {
          if (!error) {
            var jsonres = {
              "Name": that.web3.toAscii(uinfo[0].replace(/0+\b/, "")),
              "Location": that.web3.toAscii(uinfo[1].replace(/0+\b/, "")),
              "EthAddress": uinfo[2],
              "Role": JSON.parse(uinfo[3])
            }
            console.log(jsonres);
            resolve({ result: jsonres });
          }
          else
            reject(error);
        });
    });
  }
  /************************************************* Supplier *************************************/

  createRawPackage = (formdata) => {
    let that = this;
    formdata.Description = that.web3.padRight(that.web3.fromAscii(formdata.Description), 34);
    formdata.FarmerName = that.web3.padRight(that.web3.fromAscii(formdata.FarmerName), 34);
    formdata.Location = that.web3.padRight(that.web3.fromAscii(formdata.Location), 34);

    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          // that.contracts_SupplyChain.supplyRaw(formdata.Description, formdata.FarmerName, formdata.Location, formdata.Quantity, formdata.Shipper, formdata.Receiver, {
          that.contracts_SupplyChain.createRawPackage(formdata.Description, formdata.FarmerName, formdata.Location, formdata.Quantity, formdata.Shipper, formdata.Receiver, {
            from: account
          }, function (error, result) {
            if (!error)
              resolve(result)
            else
              reject(error);
          })
        }
        else
          reject(err);
      });
    });
  }

  getPackageCount = () => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {

          // that.contracts_SupplyChain.getCountOfProducts({
          that.contracts_SupplyChain.getPackagesCountS({
            from: account
          }, function (error, result) {
            if (!error)
              resolve(JSON.parse(result));
            else
              reject(error);
          })
        }
      });
    });
  }

  getPackageBatchID = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          // that.contracts_SupplyChain.getProductIdByIndex(index, {
          that.contracts_SupplyChain.getPackageIdByIndexS(formdata.Index, {
            from: account
          }, function (error, result) {
            // console.log(result);
            if (!error)
              resolve(result);
            else
              reject(error);
          })
        }
      });
    });
  }

  getPackageBatchIDDetails = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          this.contracts_RawMatrials = that.web3.eth.contract(
            this.contract_RawMatrials.abi
          ).at(formdata.BatchID);
          this.contracts_RawMatrials.getSuppliedRawMatrials({
            from: account
          }, function (error, result) {
            if (!error) {
              this.contracts_RawMatrials.getRawMatrialsStatus(function (error, status) {
                if (!error) {
                  let jsonres = {
                    "Description": that.web3.toAscii(result[0].replace(/0+\b/, "")),
                    "FarmerName": that.web3.toAscii(result[1].replace(/0+\b/, "")),
                    "FarmLocation": that.web3.toAscii(result[2].replace(/0+\b/, "")),
                    "Quantity": JSON.parse(result[3]),
                    "Shipper": result[4],
                    "Receiver": result[5],
                    "Supplier": result[6],
                    "Status": JSON.parse(status)
                  }
                  resolve(jsonres);
                } else {
                  return reject(error);
                }
              });

            }
            else
              reject(error);
          })
        }
      });
    });
  }

  getRawMatrialStatus = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      this.contracts_RawMatrials = that.web3.eth.contract(
        this.contract_RawMatrials.abi
      ).at(formdata.BatchID);
      this.contracts_RawMatrials.getRawMatrialsStatus(function (error, result) {
        if (!error) {
          return resolve({ "Status": JSON.parse(result) });
        } else {
          return reject(error);
        }
      });
    });
  }



  /************************************************* Transporter *************************************/
  loadConsingment = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.loadConsingment(formdata.PackageID, formdata.TransporterType, formdata.SubContractID, {
            from: account
          }, function (error, result) {
            if (!error)
              resolve(result)
            else
              reject(error);
          });
        }
      });
    });
  }

  transportCount = () => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {

          // that.contracts_SupplyChain.getCountOfProducts({
          that.contracts_SupplyChain.transportCount({
            from: account
          }, function (error, result) {
            if (!error)
              resolve(JSON.parse(result));
            else
              reject(error);
          })
        }
      });
    });
  }

  getTransportBatchIdByIndex = (formdata) => {
    let that = this;
    console.log(formdata.Index)
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.getTransportBatchIdByIndex(formdata.Index, {
            from: account
          }, function (err, result) {
            console.log(err, result)

            if (!err) {
              return resolve({ "consignmentID": result[0], "tarnsType": JSON.parse(result[1]) });
            } else {
              return reject(err);
            }
          });
        }
      });
    });
  }
  /************************************************* Manufecturer *************************************/
  rawPackageReceived = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.rawPackageReceived(formdata.PackageID, {
            from: account
          }, function (error, result) {
            if (!error)
              resolve(result)
            else
              reject(error);
          });
        }
      });
    });
  }

  getPackagesCountM = () => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.getPackagesCountM({
            from: account
          }, function (error, result) {
            if (!error)
              resolve(JSON.parse(result));
            else
              reject(error);
          })
        }
      });
    });
  }

  getPackageIDByIndexM = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.getPackageIDByIndexM(formdata.Index, {
            from: account
          }, function (error, result) {
            // console.log(result);
            if (!error)
              resolve(result);
            else
              reject(error);
          })
        }
      });
    });
  }

  getRawPackageQunatity = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.getRawPackageQunatity(formdata.PackageID, {
            from: account
          }, function (error, result) {
            // console.log(result);
            if (!error)
              resolve(result);
            else
              reject(error);
          })
        }
      });
    });
  }
  useRawPackage = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.useRawPackage(formdata.PackageID, formdata.Quantity, {
            from: account
          }, function (error, result) {
            if (!error)
              resolve(result)
            else
              reject(error);
          });
        }
      });
    });
  }

  manufacturMedicine = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.manufacturMedicine(formdata.Description, formdata.RawMatrial, formdata.Quantity, formdata.Shipper, formdata.Receiver, formdata.ReceiverType, {
            from: account
          }, function (error, result) {
            if (!error)
              resolve(result)
            else
              reject(error);
          });
        }
      });
    });
  }
  getBatchesCountM = () => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {

          // that.contracts_SupplyChain.getCountOfProducts({
          that.contracts_SupplyChain.getBatchesCountM({
            from: account
          }, function (error, result) {
            if (!error)
              resolve(JSON.parse(result));
            else
              reject(error);
          })
        }
      });
    });
  }

  getBatchIdByIndexM = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.getBatchIdByIndexM(formdata.Index, {
            from: account
          }, function (error, result) {
            if (!error)
              resolve(result);
            else
              reject(error);
          })
        }
      });
    });
  }

  getMadicineBatchIDDetails = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          let contracts_Medicine = that.web3.eth.contract(
            this.contract_Medicine.abi
          ).at(formdata.BatchID);
          contracts_Medicine.getMedicineInfo({
            from: account
          }, function (error, result) {
            if (!error) {
              contracts_Medicine.getWDP(function (error, WDP) {
                if (!error) {
                  contracts_Medicine.getBatchIDStatus(function (error, status) {
                    if (!error) {
                      let jsonres = {
                        "Manufacturer": result[0],
                        "Description": that.web3.toAscii(result[1].replace(/0+\b/, "")),
                        "RawMatrial": that.web3.toAscii(result[2].replace(/0+\b/, "")),
                        "Quantity": JSON.parse(result[3]),
                        "Shipper": result[4],
                        "Status": JSON.parse(status),
                        "Wholesaler": WDP[0],
                        "Distributer": WDP[1],
                        "Pharma": WDP[2]
                      }
                      resolve(jsonres);
                    } else {
                      return reject(error);
                    }
                  });
                } else {
                  let jsonres = {
                    "Manufacturer": result[0],
                    "Description": that.web3.toAscii(result[1].replace(/0+\b/, "")),
                    "RawMatrial": that.web3.toAscii(result[2].replace(/0+\b/, "")),
                    "Quantity": JSON.parse(result[3]),
                    "Shipper": result[4],
                    "Status": JSON.parse(status)
                  }
                  resolve(jsonres);
                }
              });
            }
            else
              reject(error);
          })
        }
      });
    });
  }

  getMedicineStatus = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      let contracts_Medicine = that.web3.eth.contract(
        this.contract_Medicine.abi
      ).at(formdata.BatchID);
      contracts_Medicine.getBatchIDStatus(function (error, result) {
        if (!error) {
          return resolve({ "Status": JSON.parse(result) });
        } else {
          return reject(error);
        }
      });
    });
  }

  getMedicineWDP = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      let contracts_Medicine = that.web3.eth.contract(
        this.contract_Medicine.abi
      ).at(formdata.BatchID);
      contracts_Medicine.getWDP(function (error, WDP) {
        if (!error) {
          let jsonres = {
            "Wholesaler": WDP[0],
            "Distributer": WDP[1],
            "Pharma": WDP[2]
          }
          return resolve(jsonres);
        } else {
          return reject(error);
        }
      });
    });
  }

  /************************************************* Wholesaler *************************************/
  MedicineReceived = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.MedicineReceived(formdata.PackageID,formdata.SubContractID, {
            from: account
          }, function (error, result) {
            if (!error)
              resolve(result)
            else
              reject(error);
          });
        }
      });
    });
  }

  transferMedicineWtoD = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.transferMedicineWtoD(formdata.BatchID,formdata.Shipper,formdata.Receiver, {
            from: account
          }, function (error, result) {
            if (!error)
              resolve(result)
            else
              reject(error);
          });
        }
      });
    });
  }
  getBatchesCountWD = () => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {

          // that.contracts_SupplyChain.getCountOfProducts({
          that.contracts_SupplyChain.getBatchesCountWD({
            from: account
          }, function (error, result) {
            if (!error)
              resolve(JSON.parse(result));
            else
              reject(error);
          })
        }
      });
    });
  }
  getBatchIdByIndexWD = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.getBatchIdByIndexWD(formdata.Index, {
            from: account
          }, function (error, result) {
            // console.log(result);
            if (!error)
              resolve(result);
            else
              reject(error);
          })
        }
      });
    });
  }
  getSubContractWD = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.getSubContractWD(formdata.BatchID, {
            from: account
          }, function (error, result) {
            if (!error)

              resolve(result);
            else
              reject(error);
          })
        }
      });
    });
  }

  getSubContractStatusWD = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      let contracts_MedicineW_D = that.web3.eth.contract(
        this.contract_MedicineW_D.abi
      ).at(formdata.BatchID);
      contracts_MedicineW_D.getBatchIDStatus(function (error, result) {
        if (!error) {
          return resolve({ "Status": JSON.parse(result) });
        } else {
          return reject(error);
        }
      });
    });
  }

  /************************************************* Distributer *************************************/

  transferMedicineDtoP = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.transferMedicineDtoP(formdata.BatchID,formdata.Shipper,formdata.Receiver, {
            from: account
          }, function (error, result) {
            if (!error)
              resolve(result)
            else
              reject(error);
          });
        }
      });
    });
  }

  getBatchesCountDP = () => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {

          // that.contracts_SupplyChain.getCountOfProducts({
          that.contracts_SupplyChain.getBatchesCountDP({
            from: account
          }, function (error, result) {
            if (!error)
              resolve(JSON.parse(result));
            else
              reject(error);
          })
        }
      });
    });
  }
  getBatchIdByIndexDP = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.getBatchIdByIndexDP(formdata.Index, {
            from: account
          }, function (error, result) {
            // console.log(result);
            if (!error)
              resolve(result);
            else
              reject(error);
          })
        }
      });
    });
  }
  getSubContractDP = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.getSubContractDP(formdata.BatchID, {
            from: account
          }, function (error, result) {
            if (!error)

              resolve(result);
            else
              reject(error);
          })
        }
      });
    });
  }

  getSubContractStatusDP = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      let contracts_MedicineD_P = that.web3.eth.contract(
        this.contract_MedicineD_P.abi
      ).at(formdata.BatchID);
      contracts_MedicineD_P.getBatchIDStatus(function (error, result) {
        if (!error) {
          return resolve({ "Status": JSON.parse(result) });
        } else {
          return reject(error);
        }
      });
    });
  }

  /************************************************* Pharma *************************************/
  MedicineRecievedAtPharma = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.MedicineRecievedAtPharma(formdata.PackageID,formdata.SubContractID, {
            from: account
          }, function (error, result) {
            if (!error)
              resolve(result)
            else
              reject(error);
          });
        }
      });
    });
  }
  updateSaleStatus = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.updateSaleStatus(formdata.BatchID,formdata.Status, {
            from: account
          }, function (error, result) {
            if (!error)
              resolve(result)
            else
              reject(error);
          });
        }
      });
    });
  }
  salesInfo = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.salesInfo(formdata.BatchID, {
            from: account
          }, function (error, result) {
            if (!error)

              resolve(result);
            else
              reject(error);
          })
        }
      });
    });
  }

  getBatchesCountP = () => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {

          // that.contracts_SupplyChain.getCountOfProducts({
          that.contracts_SupplyChain.getBatchesCountP({
            from: account
          }, function (error, result) {
            if (!error)
              resolve(JSON.parse(result));
            else
              reject(error);
          })
        }
      });
    });
  }
  getBatchIdByIndexP = (formdata) => {
    let that = this;
    return new Promise((resolve, reject) => {
      that.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          that.contracts_SupplyChain.getBatchIdByIndexP(formdata.Index, {
            from: account
          }, function (error, result) {
            if (!error)
              resolve(result);
            else
              reject(error);
          })
        }
      });
    });
  }
}
