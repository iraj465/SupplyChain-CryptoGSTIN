import { Component, OnInit } from '@angular/core';
import { EthcontractService } from 'src/app/ethcontract.service';
import * as RawMaterials from 'src/app/components/Contracts/RawMaterials.json';
import { FormGroup, FormControl } from '@angular/forms';
import * as Madicine from 'src/app/components/Contracts/Madicine.json';


@Component({
  selector: 'app-manufacturer',
  templateUrl: './manufacturer.component.html',
  styleUrls: ['./manufacturer.component.css']
})
export class ManufacturerComponent implements OnInit {
  
  web3: any;
  Contract: any;
  AdminAddress: string;
  manuAddress: any;
  manuBalance: any;
  manuName: any;
  manuLocation: any;
  manuRole: any;
  rawMatContract: any;
  packageStatus = {
    0: "not yet picked",
    1: "picked from supplier",
    2: "received by manufacturer"
  };
  prodStatus = {
    0: "at Manufacturer",
    1: "picked4W",
    2: "picked4D",    
    3: "deliveredatW",
    4: "deliveredatD",
    5: "picked4P",
    6: "deliveredatP"
  }
  packageID: any;
  supplierAddress: any;
  matstat: boolean;
  products = [];
  getStatus: string;
  packageId: any;
  form: FormGroup;
  prodCount: any;
  prodcountPressed = false;
  packcountPressed = false;
  packCount: any;
  prodContract: any;
  prodId: any;
  status: any;
  tablepressed: boolean;
  constructor(private ethcontractService: EthcontractService) {
    this.form = new FormGroup({
      TAddress : new FormControl(),
      rawmat : new FormControl(),
      numUnits : new FormControl(),
      prodDes : new FormControl()
      });
   }

 async ngOnInit(){
  this.web3 = await this.ethcontractService.getWeb3();

  this.Contract = await this.InitContract();
  this.AdminAddress = "0xd3832DD17DB191d545cFB829A796d8Ec87245172";
  this.Contract.options.from = this.AdminAddress;
  this.getManufacturerDetails(); 
  }

  public async InitContract(){
    const contract = await this.ethcontractService.getContract();
    // console.log('Inside InitContract');
    // console.log('getting out of InitContract');
    return contract
  }
  public async getManufacturerDetails(){
    var accounts = await this.web3.eth.getAccounts();
    // console.log(accounts);
    this.manuAddress =accounts[0];
    const info = await this.Contract.methods.getUserInfo(this.manuAddress).call();
    var jsonres = {
        "Name": this.web3.utils.toAscii(info[0].replace(/0+\b/, "")),
        "Location": this.web3.utils.toAscii(info[1].replace(/0+\b/, "")),
        "EthAddress": info[2],
        "Role": JSON.parse(info[3])
      }
    const balwei = await this.web3.eth.getBalance(this.manuAddress);
    this.manuBalance = await this.web3.utils.fromWei(balwei, "ether");
    this.manuName = jsonres.Name;
    this.manuLocation = jsonres.Location;
    this.manuRole = jsonres.Role;
    console.log('user details obtained');
  }

  public async receivepackage(){
    //create new intsance of RawMaterials contract for corresponding batchId
      this.rawMatContract = new this.web3.eth.Contract(RawMaterials.abi,this.packageID, {
      from: this.supplierAddress});
      console.log('pick button pressed');
      console.log(this.rawMatContract);
      console.log(this.supplierAddress);
  
      //find status of package
      const pick  =  await this.Contract.methods.rawPackageReceived(this.packageID).send({from : this.manuAddress});
      console.log(pick);
      const statusNo = await this.rawMatContract.methods.getRawMatrialsStatus().call();
      console.log(statusNo);
      console.log(this.packageStatus[statusNo]);         
    }
    public async getrawMaterialStatus(){
      this.matstat = true;
      this.rawMatContract = new this.web3.eth.Contract(RawMaterials.abi,this.packageId,{from:this.supplierAddress});
      const statno = await this.rawMatContract.methods.getRawMatrialsStatus().call();
      console.log(statno);
      this.getStatus = 'Package ' + this.packageStatus[statno] +' !';
      console.log(this.getStatus);
    }

    onSubmit1(){
      this.createPackageMW();
    }
  
    public async createPackageMW(){
      console.log('creating package');
      console.log(this.Contract);
      const des = this.web3.utils.fromAscii(this.form.get('prodDes').value);
      const rm = this.web3.utils.fromAscii(this.form.get('rawmat').value);
      const packinfo = await this.Contract.methods.manufacturMadicine(des,rm,this.form.get('numUnits').value,this.form.get('TAddress').value,this.manuAddress,1).send({from : this.manuAddress});
      console.log('Created package info');
      console.log(packinfo);
    }

    onSubmit2(){
      this.createPackageMR();
    }
  
    public async createPackageMR(){
      console.log('creating package');
      console.log(this.Contract);
      const des = this.web3.utils.fromAscii(this.form.get('prodDes').value);
      const rm = this.web3.utils.fromAscii(this.form.get('rawmat').value);
      const packinfo = await this.Contract.methods.manufacturMadicine(des,rm,this.form.get('numUnits').value,this.form.get('TAddress').value,this.manuAddress,2).send({from : this.manuAddress});
      console.log('Created package info');
      console.log(packinfo);
    }
    public async getpackCount(){
      this.packcountPressed  = true;
      this.packCount = await this.Contract.methods.getPackagesCountM().call({from:this.manuAddress});
      console.log(this.packCount);
    }

    public async getprodCount(){
      this.prodcountPressed = true;
      this.prodCount  = await this.Contract.methods.getBatchesCountM().call({from:this.manuAddress});
    }

    public async getProdInfo(){
      this.tablepressed = true;
      this.getprodCount();
      let i: number;
      let from = 0;
      let to = this.prodCount;
      
  
      for (i = from; i < to; i++) {
        const prodId = await this.Contract.methods.getBatchIdByIndexM(i).call({from: this.manuAddress});
       
        //create new intsance of RawMaterials contract for corresponding batchId
        this.prodContract = new this.web3.eth.Contract(Madicine.abi,prodId, {
          from: this.manuAddress});
  
        //find status of package
        const statusNo = await this.prodContract.methods.getBatchIDStatus().call();
       
        //get package details
        const result = await this.prodContract.methods.getMadicineInfo().call({from: this.manuAddress});
        result['Des'] = this.web3.utils.toAscii(result['Des'].replace(/0+\b/, ""));
        result['RM'] = this.web3.utils.toAscii(result['RM'].replace(/0+\b/, ""));
        result['pid'] = prodId;
        result['Status'] = this.prodStatus[statusNo];

        console.log(result);
        this.products.push(result);

    }
    // console.log(this.packages);
    }
    resetpackages(){
      this.products = [];
    }

    public async getprodStatus(){
      this.prodContract = new this.web3.eth.Contract(Madicine.abi,this.prodId, {
        from: this.manuAddress});
        const statusNo = await this.prodContract.methods.getBatchIDStatus().call();
        this.status = this.prodStatus[statusNo];
    }

}
