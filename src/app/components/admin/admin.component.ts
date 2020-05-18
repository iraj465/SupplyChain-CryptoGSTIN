import { Component, OnInit, ViewChild, Input, } from '@angular/core';
import { EthcontractService } from '../../ethcontract.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { FormBuilder, Validators, FormControl, NgSelectOption, FormGroup } from '@angular/forms';
import { Admin } from './admin.model';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  Account = "0x0000000000000000000000000000000000000000";
  Balance = '0 ETH';
  amount = 0;
  role: 0;
  Contract:any;
  contractAddress: "0x0000000000000000000000000000000000000000";
  userCount;
  closeResult: any;
  AdminBalance:any;
  web3:any;
  submitted:boolean = false;

 //Admin Details
 admin : Admin;
  Roles = ["NoRole","Supplier", "Transporter", "Manufacturer","Wholesaler","Distributer", "Retail Store"];
  


  user : FormGroup;
  userinfoName;
  userinfoAddress;
  userinfoLocation;
  userinfoRole;
  
  userCountPressed: boolean = false;
  userAddress: any;
  userinfoButtonPressed: boolean;
  accounts: any;
  Adminaddress: any;
  userRole: any;
  AdminbalanceETH: any;
  showMsg: any;
  constructor(
    private ethcontractService: EthcontractService,
    public dialog: MatDialog
  ) 
  {
    this.user = new FormGroup({
      Address : new FormControl(),
      Name : new FormControl(),
      Location : new FormControl(),
      Role : new FormControl()
    });
    
  }
  public async InitContract(){
    const contract = await this.ethcontractService.getContract();
    // console.log('Inside InitContract');
    // console.log('getting out of InitContract');
    return contract
  }
  async ngOnInit() {
    this.web3 = await this.ethcontractService.getWeb3();
    console.log(this.web3);
    this.Contract = await this.InitContract();
    console.log(this.Contract);
    await this.getAdminInfo();
    // this.regUser();
    // await this.Contract.methods.registerUser("0x4DF745079D0FeeA8A2b279427de670422Fb7020a","rajju","india",2).send({from : this.admin.AdminAccount});
    // const info = await this.Contract.methods.getUserInfo("0x4DF745079D0FeeA8A2b279427de670422Fb7020a").call();
    // console.log(info);
    // const arr = await this.Contract.methods.getUsersCount().call();
    // console.log(arr);
    // const acc = await this.web3.eth.getAccounts();
    // console.log(acc);
    await this.getUserAccounts();
  }
    
  public async getAdminInfo(){
    this.Adminaddress = await this.Contract.methods.Owner().call();
    const balanceWei = await this.web3.eth.getBalance(this.Adminaddress);
    this.AdminbalanceETH = await this.web3.utils.fromWei(balanceWei, "ether");    
    this.admin = new Admin(this.Adminaddress,this.AdminbalanceETH);
    console.log(this.admin);
  }

  public async regUser(){
    await this.Contract.methods.registerUser(this.user.get('Address').value,this.user.get('Name').value,this.user.get('Location').value,this.Roles.indexOf(this.user.get('Role').value)).send({from : this.admin.AdminAccount});
    
    const arr = await this.Contract.methods.getUsersCount().call();
    console.log(arr);
    const acc = await this.web3.eth.getAccounts();
    console.log(acc);  
    await this.getUserAccounts()
  }

  onSubmit(){
    console.log(this.user.value);
    this.regUser();
    this.showMsg = true;
  }
  cancel(){
    this.showMsg = false;
  }
  
  public async getUsersCount(){
    this.userCountPressed = true
    this.userCount = await this.Contract.methods.getUsersCount().call();
    console.log(this.userCount);
  }

  public async getUsersInfo(){
    const info = await this.Contract.methods.getUserInfo(this.userAddress).call();
    console.log(info);
    this.userinfoName = this.web3.utils.toAscii(info.name.replace(/0+\b/, ""));
    this.userinfoLocation = this.web3.utils.toAscii(info.location.replace(/0+\b/, ""));
    this.userinfoRole = this.Roles[info.role];
    this.userinfoButtonPressed = true;
  }

  public async revokeUserRole()
{
  console.log(this.userAddress);
  console.log(this.Roles.indexOf(this.user.get('Role').value));
  const info = await this.Contract.methods.revokeRole(this.userAddress).send({from:this.Adminaddress});
  console.log(info);
}
public async rerole(){
  const reassign = await this.Contract.methods.reassignRole(this.userAddress,this.Roles.indexOf(this.userRole)).send({from:this.Adminaddress});
  console.log(reassign);
}
resetUser(){
  this.userAddress="";
  this.userinfoName="";
  this.userinfoLocation="";
  this.userinfoRole="";
  this.userinfoButtonPressed = false;
}

public async getUserAccounts(){
  this.accounts = await this.web3.eth.getAccounts();
  console.log(this.accounts);
}


  // getUserInfo = async () => {
  //   let that = this;
  //   console.log(that.userCount)
  //   // that.user_list = [];
  //   let itrate = true;
  //   let from = Number(localStorage.getItem('useridpointer'));
  //   let to: Number;
  //   if (that.userCount < from + 5) {
  //     to = that.userCount;
  //     localStorage.setItem('useridpointer', to + '');
  //     itrate = false;
  //   } else if (that.userCount > from + 5) {
  //     to = from + 5;
  //     localStorage.setItem('useridpointer', to + '');
  //   }
  //   let i: number;
  //   for (i = from; i < to; i++) {
  //     let formdata = {
  //       Index:i
  //     }
  //     await this.ethcontractService.getUserProfile(formdata).then(function (userInfoList: any) {
  //       if (userInfoList) {
  //         userInfoList.result.Role = that.Roles[userInfoList.result.Role].role;
  //         that.user_list.push(userInfoList.result);
  //       }
  //     }).catch(function (error) {
  //       console.log(error);
  //     });
  //   }

  //   console.log(that.user_list);
  //   this.dataSource = new MatTableDataSource<UserTable>(that.user_list);
  //   this.dataSource.paginator = this.paginator;
  //   if (itrate) {
  //     that.getUserInfo();
  //   }
  // }

  // refreshList = () => {
  //   let that = this;
  //   this.ethcontractService.getUserCount().then(function (count: any) {
  //     if (count) {
  //       that.userCount = count.UserCount;
  //       console.log(Number(localStorage.getItem('useridpointer')));
  //       if (Number(localStorage.getItem('useridpointer')) <= that.userCount) {
  //         that.getUserInfo();
  //       }
  //     }
  //   });

  // }

  // userRegister = async () => {
  //   console.log(this.registerUser.value);
  //   var formdata = {
  //     EthAddress: this.registerUser.value.ethaddress,
  //     Name: this.registerUser.value.name,
  //     Location: this.registerUser.value.location.latitude + "_" + this.registerUser.value.location.longitude,
  //     Role: this.registerUser.value.rrole
  //   }
  //   console.log(formdata);
  //   let that = this;
  //   this.ethcontractService.registerNewUser(formdata).then(function (txhash: any) {
  //     if (txhash) {
  //       console.log(txhash);
  //       that.handleTransactionResponse(txhash);
  //     }
  //   }).catch(function (error) {
  //     console.log(error);
  //   });
  // }

  // handleTransactionResponse = (txHash) => {
  //   var txLink = "https://ropsten.etherscan.io/tx/" + txHash;
  //   var txLinkHref = "<a target='_blank' href='" + txLink + "'> Click here for Transaction Status </a>";

  //   Swal.fire("Success", "Please Check Transaction Status here :  " + txLinkHref, "success");
  //   $("#linkOngoingTransaction").html(txLinkHref);
  //   $("#divOngoingTransaction").fadeIn();
  //   /*scroll to top*/
  //   $('html, body').animate({ scrollTop: 0 }, 'slow', function () { });
  // }

}
