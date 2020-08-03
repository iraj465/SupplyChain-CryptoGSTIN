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
  Roles = ["NoRole","Supplier", "Transporter", "Manufacturer","Wholesaler","Distributer", "Retail Store"];
  value:any;
  Contract: any;
  AdminAddress: string;
  userAddress: any;
  userBalance: any;
  userName: any;
  userRole: any;
  userLocation: any;
  senderDetails: Promise<{ Name: any; Location: any; EthAddress: any; Role: any; }>;
  receiverDetails: Promise<{ Name: any; Location: any; EthAddress: any; Role: any; }>;
  senderBalance: any;
  senderName: any;
  senderLocation: any;
  senderRole: any;
  recBalance: any;
  recName: any;
  recLocation: any;
  recRole: any;
  recpressed: boolean;
  senderpressed: boolean;

  constructor(private ethcontractService: EthcontractService) { }

  async ngOnInit(){
    this.web3 = await this.ethcontractService.getWeb3();
    this.Contract = await this.InitContract();
  }
  public async InitContract(){
    const contract = await this.ethcontractService.getContract();
    // console.log('Inside InitContract');
    // console.log('getting out of InitContract');
    return contract
  }
  public async getuserDetails(address) {
    this.userAddress =address;
    const info = await this.Contract.methods.getUserInfo(this.userAddress).call();
    var jsonres = {
        "Name": this.web3.utils.toAscii(info[0].replace(/0+\b/, "")),
        "Location": this.web3.utils.toAscii(info[1].replace(/0+\b/, "")),
        "EthAddress": info[2],
        "Role": JSON.parse(info[3])
      }
     
    return jsonres;
  }
  public async transact(){
    const val = await this.web3.utils.toWei(this.value,"ether");
    console.log(this.senderDetails);
    console.log(this.receiverDetails);
    const transaction = await this.web3.eth.sendTransaction({from: this.sender,to: this.receiver,value: val});
    console.log(transaction);
  }

  public async getSenderDetails(){
    const senderDet = await this.getuserDetails(this.sender)
    const balwei = await this.web3.eth.getBalance(this.sender);
    this.senderBalance = await this.web3.utils.fromWei(balwei, "ether");
    this.senderName = senderDet.Name;
    this.senderLocation = senderDet.Location;
    this.senderRole = this.Roles[senderDet.Role];
    this.senderpressed = true;
    console.log('user details obtained'); 
  }
  public async getRecDetails(){
    this.recpressed = true;
    const recDet = await this.getuserDetails(this.receiver)
    const balweir = await this.web3.eth.getBalance(this.receiver);
    this.recBalance = await this.web3.utils.fromWei(balweir, "ether");
    this.recName = recDet.Name;
    this.recLocation = recDet.Location;
    this.recRole = this.Roles[recDet.Role];
    console.log('user details obtained');
  }

}
