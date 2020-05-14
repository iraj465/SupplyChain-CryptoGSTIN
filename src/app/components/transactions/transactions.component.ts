import { Component, OnInit } from '@angular/core';
import { EthcontractService } from 'src/app/ethcontract.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  web3: any;
  sender:any;
  receiver:any;
  value:any;
  Contract: any;
  AdminAddress: string;
  userAddress: any;
  userBalance: any;
  userName: any;
  userRole: any;
  userLocation: any;

  constructor(private ethcontractService: EthcontractService) { }

  async ngOnInit(){
    this.web3 = await this.ethcontractService.getWeb3();
    this.Contract = await this.InitContract();
    this.AdminAddress = "0xd3832DD17DB191d545cFB829A796d8Ec87245172";
    this.Contract.options.from = this.AdminAddress;
    this.getuserDetails();
    this.sender = this.userAddress;

  }
  public async InitContract(){
    const contract = await this.ethcontractService.getContract();
    // console.log('Inside InitContract');
    // console.log('getting out of InitContract');
    return contract
  }
  public async getuserDetails() {
    var accounts = await this.web3.eth.getAccounts();
    // console.log(accounts);
    this.userAddress =accounts[0];
    const info = await this.Contract.methods.getUserInfo(this.userAddress).call();
    var jsonres = {
        "Name": this.web3.utils.toAscii(info[0].replace(/0+\b/, "")),
        "Location": this.web3.utils.toAscii(info[1].replace(/0+\b/, "")),
        "EthAddress": info[2],
        "Role": JSON.parse(info[3])
      }
    const balwei = await this.web3.eth.getBalance(this.userAddress);
    this.userBalance = await this.web3.utils.fromWei(balwei, "ether");
    this.userName = jsonres.Name;
    this.userLocation = jsonres.Location;
    this.userRole = jsonres.Role;
    console.log('user details obtained');  
  }
  public async transact(){
    this.value = this.web3.utils.toWei(this.value,"ether");
    console.log(this.receiver);
    console.log(this.web3);
    const rc  = this.receiver.toString();
    const val = this.web3.utils.toBN(this.value);
    this.web3.eth.sendTransaction().send({from: '0x7E6881E7B8545CAaA7457bDB8AC77F5e1b16BCeC',to: '0xd3832DD17DB191d545cFB829A796d8Ec87245172',value:'1000000000000000'});
  }

}
