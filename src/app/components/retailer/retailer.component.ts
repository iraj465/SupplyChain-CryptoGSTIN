import { Component, OnInit } from '@angular/core';
import { EthcontractService } from 'src/app/ethcontract.service';

@Component({
  selector: 'app-retailer',
  templateUrl: './retailer.component.html',
  styleUrls: ['./retailer.component.css']
})
export class RetailerComponent implements OnInit {
  web3: any;
  Contract: any;
  AdminAddress: string;
  retaAddress: any;
  retaRole: any;
  retaLocation: any;
  retaName: any;
  retaBalance: any;
  pUID: any;
  conID: any;
  bID: any;
  transAddress: any;
  storeAddress: any;
  constructor(private ethcontractService: EthcontractService) { }

  async ngOnInit(){
    this.web3 = await this.ethcontractService.getWeb3();
    this.Contract = await this.InitContract();
    this.AdminAddress = "0xd3832DD17DB191d545cFB829A796d8Ec87245172";
    this.Contract.options.from = this.AdminAddress;
    this.getRetailerDetails();
  }
  public async InitContract(){
    const contract = await this.ethcontractService.getContract();
    // console.log('Inside InitContract');
    // console.log('getting out of InitContract');
    return contract
  }
  public async getRetailerDetails() {
    var accounts = await this.web3.eth.getAccounts();
    // console.log(accounts);
    this.retaAddress =accounts[0];
    const info = await this.Contract.methods.getUserInfo(this.retaAddress).call();
    var jsonres = {
        "Name": this.web3.utils.toAscii(info[0].replace(/0+\b/, "")),
        "Location": this.web3.utils.toAscii(info[1].replace(/0+\b/, "")),
        "EthAddress": info[2],
        "Role": JSON.parse(info[3])
      }
    const balwei = await this.web3.eth.getBalance(this.retaAddress);
    this.retaBalance = await this.web3.utils.fromWei(balwei, "ether");
    this.retaName = jsonres.Name;
    this.retaLocation = jsonres.Location;
    this.retaRole = jsonres.Role;
    console.log('user details obtained');  
  }
  public async receivePackage(){
    console.log('In receievd pacakge');
    console.log(this.retaAddress);
    const receive  = await this.Contract.methods.madicineReceived(this.pUID,this.conID).send({from:this.retaAddress});
    console.log('product receive');
    console.log(receive);
  }
  public async toStore(){
    const transfer = await this.Contract.methods.transferMadicineDtoP(this.bID,this.transAddress,this.storeAddress).send({from:this.retaAddress});
    console.log('Transfer to Store');
    console.log(transfer);
  }

}
