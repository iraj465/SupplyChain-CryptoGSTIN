import { Component, OnInit } from '@angular/core';
import * as Madicine from 'src/app/components/Contracts/Madicine.json';
import * as RawMaterials from 'src/app/components/Contracts/RawMaterials.json';
import { EthcontractService } from 'src/app/ethcontract.service';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-wholesaler',
  templateUrl: './wholesaler.component.html',
  styleUrls: ['./wholesaler.component.css']
})
export class WholesalerComponent implements OnInit {
  web3: any;
  Contract: any;
  AdminAddress: string;
  wholeAddress: any;
  wholeBalance: any;
  wholeName: any;
  wholeLocation: any;
  wholeRole: any;
  prodContract: any;
 
  receiveCount: any;
  prodStatus = {
    0: "at Manufacturer",
    1: "Product picked from Manufacturer",
    2: "picked for Retailer",    
    3: "Product delivered to Wholesaler",
    4: "deliveredatD",
    5: "picked4P",
    6: "deliveredatP"
  }
  getStatus: string;
  manuAddress: any;
  mAddress: any;
  pID: any;
  pId: any;
  status: any;
  cidPressed: boolean;
  cid: any;
  batchid:any;
  batchcnt: any;
  bcount: any;
  prodID: any;
  TransAddress: any;
  RetaAddress: any;
  IDs = [];
  batchidpressed: boolean;
  productid: any;
  concount: any;
  pUID: any;
  conID: any;

  constructor(private ethcontractService: EthcontractService) { }

  async ngOnInit(){
    this.web3 = await this.ethcontractService.getWeb3();
    this.Contract = await this.InitContract();
    this.AdminAddress = "0xd3832DD17DB191d545cFB829A796d8Ec87245172";
    this.Contract.options.from = this.AdminAddress;
    this.getWholesalerDetails(); 
  }
  public async InitContract(){
    const contract = await this.ethcontractService.getContract();
    // console.log('Inside InitContract');
    // console.log('getting out of InitContract');
    return contract
  }
    
  public async getWholesalerDetails() {
    var accounts = await this.web3.eth.getAccounts();
    // console.log(accounts);
    this.wholeAddress =accounts[0];
    const info = await this.Contract.methods.getUserInfo(this.wholeAddress).call();
    var jsonres = {
        "Name": this.web3.utils.toAscii(info[0].replace(/0+\b/, "")),
        "Location": this.web3.utils.toAscii(info[1].replace(/0+\b/, "")),
        "EthAddress": info[2],
        "Role": JSON.parse(info[3])
      }
    const balwei = await this.web3.eth.getBalance(this.wholeAddress);
    this.wholeBalance = await this.web3.utils.fromWei(balwei, "ether");
    this.wholeName = jsonres.Name;
    this.wholeLocation = jsonres.Location;
    this.wholeRole = jsonres.Role;
    console.log('user details obtained');  
  }

  public async receivePackage(){
    console.log('In receievd pacakge');
    console.log(this.wholeAddress);
    const receive  = await this.Contract.methods.madicineReceived(this.pUID,this.pUID).send({from:this.wholeAddress});
    console.log('product receive');
    console.log(receive);

  }

  public async getprodStatus(){
    this.prodContract = new this.web3.eth.Contract(Madicine.abi,this.pId, {
      from: this.manuAddress});
      const statusNo = await this.prodContract.methods.getBatchIDStatus().call();
      this.status = this.prodStatus[statusNo];
  } 
  public async getbatchCount(){
    this.batchcnt = true;
    this.bcount = await this.Contract.methods.getBatchesCountWD().call({from:this.wholeAddress});
    console.log('batch cnt');
    console.log(this.bcount);

  }

  public async transfer(){
    const trans = await this.Contract.methods.transferMadicineWtoD(this.prodID,this.TransAddress,this.RetaAddress).send({from:this.wholeAddress});
    console.log(trans);
  }

  public async getbatchIds(){
    this.batchidpressed = true;
    let i: number;
    let from = 0;
    let to = await this.Contract.methods.getBatchesCountWD().call({from:this.wholeAddress});
    for (i = from; i < to; i++) {
      const batchId = await this.Contract.methods.getBatchIdByIndexWD(i).call({from: this.wholeAddress});
      console.log(batchId);
      this.IDs.push(batchId)
  }
  }

  resetIDs(){
    this.IDs = [];
  }

  public async getCid(){
    this.cidPressed = true;
    this.cid  = await this.Contract.methods.getSubContractWD(this.productid).call({from:this.wholeAddress});
    console.log('cid');
    console.log(this.cid);
  }
}
