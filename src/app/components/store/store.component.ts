import { Component, OnInit } from '@angular/core';
import { EthcontractService } from 'src/app/ethcontract.service';
import * as Madicine from 'src/app/components/Contracts/Madicine.json';
@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  web3: any;
  Contract: any;
  AdminAddress: string;
  storeAddress: any;
  storeName: any;
  storeBalance: any;
  storeLocation: any;
  storeRole: any;
  pUID: any;
  conID: any;
  prodID: any;
  ustatus: any;
  manuAddress:any;
  status: any;
  uprodID: any;
  bCount: any;
  gtin: any;
  prods = [];
  saleStatus = {
    0: "is not found",
    1: "is at Retail Store",
    2: " has been sold",    
    3: "has expired",
    4: "is damaged"
  }
  getstatus: boolean;
  IDs=[];
  tablepressed: boolean;
  batchidpressed: boolean;
  gtinpressed: boolean;
  prodContract: any;
  csv: any;

  constructor(private ethcontractService: EthcontractService) { }

  async ngOnInit(){
    this.web3 = await this.ethcontractService.getWeb3();
    this.Contract = await this.InitContract();
    this.getStoreDetails();
  }
  public async InitContract(){
    const contract = await this.ethcontractService.getContract();
    // console.log('Inside InitContract');
    // console.log('getting out of InitContract');
    return contract
  }
  public async getStoreDetails() {
    var accounts = await this.web3.eth.getAccounts();
    // console.log(accounts);
    this.storeAddress =accounts[0];
    const info = await this.Contract.methods.getUserInfo(this.storeAddress).call();
    var jsonres = {
        "Name": this.web3.utils.toAscii(info[0].replace(/0+\b/, "")),
        "Location": this.web3.utils.toAscii(info[1].replace(/0+\b/, "")),
        "EthAddress": info[2],
        "Role": JSON.parse(info[3])
      }
    const balwei = await this.web3.eth.getBalance(this.storeAddress);
    this.storeBalance = await this.web3.utils.fromWei(balwei, "ether");
    this.storeName = jsonres.Name;
    this.storeLocation = jsonres.Location;
    this.storeRole = jsonres.Role;
    console.log('user details obtained');  
  }
  public async receivePackage(){
    const receive  = await this.Contract.methods.madicineRecievedAtPharma(this.pUID,this.conID).send({from:this.storeAddress});
    console.log(receive);
    console.log('Package received');
  }
  public async updateStatus(){
    console.log('In update status');
    console.log(this.ustatus);
    const status = await this.Contract.methods.updateSaleStatus(this.uprodID,this.ustatus).send({from:this.storeAddress});
    console.log('prod status');
    console.log(status);
  }
  public async prodStatus(){
    this.getstatus = true;
    const stno = await this.Contract.methods.salesInfo(this.gtin).call({from:this.storeAddress});
    this.status = 'Product ' + this.saleStatus[stno];
  }
  public async batchCount(){
    this.bCount = await this.Contract.methods.getBatchesCountP().call({from:this.storeAddress});
    console.log('batch count');
    console.log(this.bCount);
  }
  public async getBatches(){
    this.gtinpressed = true;
      let i: number;
      let from = 0;
      let to = await this.Contract.methods.getBatchesCountP().call({from:this.storeAddress});
      for (i = from; i < to; i++) {
        const batch = await this.Contract.methods.getBatchIdByIndexP(i).call({from:this.storeAddress});
        console.log(batch);
        const stno = await this.Contract.methods.salesInfo(batch).call({from:this.storeAddress});
        const status = 'Product ' + this.saleStatus[stno];
        this.IDs['Batch'] = batch;
        this.IDs['Status'] = status;

        this.prodContract = new this.web3.eth.Contract(Madicine.abi,batch, {
          from: this.manuAddress});
        const result = await this.prodContract.methods.getMadicineInfo().call({from: this.manuAddress});
        result['Des'] = this.web3.utils.toAscii(result['Des'].replace(/0+\b/, ""));
        result['Quant'] = this.web3.utils.toAscii(result['Quant'].replace(/0+\b/, ""));
        this.IDs['Product'] = result['Des'];
        this.IDs['Time'] = result['Quant'];
          
        this.prods.push(this.IDs);
      }
      console.log(this.prods);
  }
  resetIDs(){
    this.prods = [];
  }

  sold(){this.ustatus = 2;
    console.log(this.ustatus);}

  damaged(){this.ustatus = 4;
  console.log(this.ustatus);}
  
  expired(){ this.ustatus = 3;
    console.log(this.ustatus);}

}
