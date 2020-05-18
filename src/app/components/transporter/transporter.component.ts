import { Component, OnInit, ViewChild } from '@angular/core';
import { EthcontractService } from 'src/app/ethcontract.service';
import * as RawMaterials from 'src/app/components/Contracts/RawMaterials.json';
import * as Madicine from 'src/app/components/Contracts/Madicine.json';

@Component({
  selector: 'app-transporter',
  templateUrl: './transporter.component.html',
  styleUrls: ['./transporter.component.css']
})
export class TransporterComponent implements OnInit {
  cid:any;
  transType:number = 0;
  web3: any;
  rawMatContract: any;
  Contract: any;
  AdminAddress: string;
  transAddress: any;
  userRole: any;
  transLocation: any;
  transName: any;
  transBalance: any;
  packageId: any;
  packageStatus = {
    0: "not yet picked from supplier",
    1: "picked for manufacturer",
    2: "delivered to manufacturer"
  }
  prodStatus = {
    0: "at Manufacturer",
    1: "picked for Wholesaler",
    2: "picked for Distributer",    
    3: "delivered to Wholesaler",
    4: "delivered to Distributer",
    5: "picked for Retail Store",
    6: "delivered at Retail Store"
  }
  matstat: boolean;
  getStatus: any;
  packageID: any;

  supplierAddress: any;
  prodID: any;
  prodId: any;
  prodContract: any;
  manuAddress: any;
  matstattwo: boolean;
  pUID: any;
  conID: any;
  con2ID: any;
  p2UID: any;
  constructor(private ethcontractService: EthcontractService) {
     }

  async ngOnInit(){
    this.web3 = await this.ethcontractService.getWeb3();

    this.Contract = await this.InitContract();
    this.getTransporterDetails();
  }

  public async InitContract(){
    const contract = await this.ethcontractService.getContract();
    // console.log('Inside InitContract');
    // console.log('getting out of InitContract');
    return contract
  }


  public async getTransporterDetails(){
    var accounts = await this.web3.eth.getAccounts();
    // console.log(accounts);
    this.transAddress =accounts[0];
    const info = await this.Contract.methods.getUserInfo(this.transAddress).call();
    var jsonres = {
        "Name": this.web3.utils.toAscii(info[0].replace(/0+\b/, "")),
        "Location": this.web3.utils.toAscii(info[1].replace(/0+\b/, "")),
        "EthAddress": info[2],
        "Role": JSON.parse(info[3])
      }
    const balwei = await this.web3.eth.getBalance(this.transAddress);
    this.transBalance = await this.web3.utils.fromWei(balwei, "ether");
    this.transName = jsonres.Name;
    this.transLocation = jsonres.Location;
    this.userRole = jsonres.Role;
    console.log('user details obtained');
    console.log(this.transAddress);
    console.log(this.transName);
  }


                                                // SUPPLIER TO MANUFACTURER

  public async pickpackageSM(){
  //create new intsance of RawMaterials contract for corresponding batchId
    this.rawMatContract = new this.web3.eth.Contract(RawMaterials.abi,this.packageID, {
    from: this.supplierAddress});
    console.log(this.rawMatContract);

    //find status of package
    let statusNo = await this.rawMatContract.methods.getRawMatrialsStatus().call();
    console.log(this.packageStatus[statusNo]);
    const pick  =  await this.rawMatContract.methods.pickPackage(this.transAddress).send({from : this.transAddress});
    console.log(pick);
    statusNo = await this.rawMatContract.methods.getRawMatrialsStatus().call();
    console.log(this.packageStatus[statusNo]);         
  }
  public async getrawMaterialStatusOne(){
    this.matstat = true;
    this.rawMatContract = new this.web3.eth.Contract(RawMaterials.abi,this.packageId,{from:this.supplierAddress});
    const statno = await this.rawMatContract.methods.getRawMatrialsStatus().call();
    console.log(statno);
    this.getStatus = 'Package ' + this.packageStatus[statno] +' !';
    console.log(this.getStatus);
  }
  // public async getProdCount(){
  //   this.Contract.methods.getC
  // }


    // MANUFACTURER TO WHOLESALER

    public async pickpackageMW(){
      this.prodContract = new this.web3.eth.Contract(Madicine.abi,this.prodID,{from:this.manuAddress});
      const pick = await this.prodContract.methods.pickPackage(this.transAddress).send({from : this.transAddress});
      console.log(pick);
      }
      public async getrawMaterialStatusTwo(){
        this.matstattwo = true;
        this.prodContract = new this.web3.eth.Contract(Madicine.abi,this.prodId,{from:this.manuAddress});
        console.log(this.prodContract);
        const statno = await this.prodContract.methods.getBatchIDStatus().call({from:this.manuAddress});
        this.getStatus = 'Package ' + this.prodStatus[statno] +' !';
        console.log(this.getStatus);
      }

                      // Wholesaler to Retailer
      public async pickPackageWD(){
        const load = await this.Contract.methods.loadConsingment(this.pUID,3,this.conID).send({from:this.transAddress});
        console.log('load');
        console.log(load);
      }
            // Distributer to Store
      public async pickPackageDR(){
        const load = await this.Contract.methods.loadConsingment(this.p2UID,4,this.con2ID).send({from:this.transAddress});
        console.log('load');
        console.log(load);
      }

}
