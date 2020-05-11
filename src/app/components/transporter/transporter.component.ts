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
    0: "at creator",
    1: "picked4W",
    2: "picked4D",    
    3: "deliveredatW",
    4: "deliveredatD",
    5: "picked4P",
    6: "deliveredatP"
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
  constructor(private ethcontractService: EthcontractService) {
     }

  async ngOnInit(){
    this.web3 = await this.ethcontractService.getWeb3();

    this.Contract = await this.InitContract();
    this.AdminAddress = "0xd3832DD17DB191d545cFB829A796d8Ec87245172";
    this.Contract.options.from = this.AdminAddress;
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
  }


                                                // SUPPLIER TO MANUFACTURER

  public async pickpackageSM(){
  //create new intsance of RawMaterials contract for corresponding batchId
    this.rawMatContract = new this.web3.eth.Contract(RawMaterials.abi,this.packageID, {
    from: this.supplierAddress});

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
    const pick = await this.Contract.methods.loadConsingment(this.prodID,2,"none").send({from : this.transAddress});
    console.log('Manu to WHole');
    console.log(pick);

      }
      public async getrawMaterialStatusTwo(){
        this.matstattwo = true;
        this.prodContract = new this.web3.eth.Contract(Madicine.abi,this.prodId,{from:this.manuAddress});
        const statno = await this.prodContract.methods.getBatchIDStatus().call();
        console.log(statno);
        this.getStatus = 'Package ' + this.prodStatus[statno] +' !';
        console.log(this.getStatus);
      }
                                                

}
