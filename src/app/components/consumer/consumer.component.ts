import { Component, OnInit } from '@angular/core';
import { EthcontractService } from 'src/app/ethcontract.service';

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.css']
})
export class ConsumerComponent implements OnInit {
  web3: any;
  Contract: any;
  conAddress: any;
  AdminAddress: string;
  conBalance: any;
  conName: any;
  conLocation: any;
  conRole: any;

  constructor(private ethcontractService: EthcontractService) { }

  async ngOnInit(){
    this.web3 = await this.ethcontractService.getWeb3();
    this.Contract = await this.InitContract();
    this.AdminAddress = "0xd3832DD17DB191d545cFB829A796d8Ec87245172";
    this.Contract.options.from = this.AdminAddress;
    this.getConsumerDetails();
  }
  public async InitContract(){
    const contract = await this.ethcontractService.getContract();
    // console.log('Inside InitContract');
    // console.log('getting out of InitContract');
    return contract
  }
  public async getConsumerDetails() {
    var accounts = await this.web3.eth.getAccounts();
    // console.log(accounts);
    this.conAddress =accounts[0];
    const info = await this.Contract.methods.getUserInfo(this.conAddress).call();
    var jsonres = {
        "Name": this.web3.utils.toAscii(info[0].replace(/0+\b/, "")),
        "Location": this.web3.utils.toAscii(info[1].replace(/0+\b/, "")),
        "EthAddress": info[2],
        "Role": JSON.parse(info[3])
      }
    const balwei = await this.web3.eth.getBalance(this.conAddress);
    this.conBalance = await this.web3.utils.fromWei(balwei, "ether");
    this.conName = jsonres.Name;
    this.conLocation = jsonres.Location;
    this.conRole = jsonres.Role;
    console.log('user details obtained');  
  }

}
