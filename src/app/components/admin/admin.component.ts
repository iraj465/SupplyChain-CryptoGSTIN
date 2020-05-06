import { Component, OnInit, ViewChild, } from '@angular/core';
import { EthcontractService } from '../../ethcontract.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { FormBuilder, Validators, FormControl, NgSelectOption } from '@angular/forms';
import { UserTable } from './usertable';
import { async } from '@angular/core/testing';
import * as $ from 'jquery';
import Swal from 'sweetalert2'
import { Admin } from './admin.model';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  AdminAccount = "0x0000000000000000000000000000000000000000";
  contract;
  balance = '0 ETH';
  amount = 0;
  role: 0;
  contractAddress: "0x0000000000000000000000000000000000000000";
  userCount = -1;
  closeResult: any;
  AdminBalance:any;
  test1:any;
  test2:any;
  registerUser = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(16)]],
    ethaddress: ['', Validators.required],
    rrole: ['0'],
    location: this.fb.group({
      latitude: [''],
      longitude: ['']
    })
  });
 AdminObj : Admin;
  Roles = [
    { role: "NoRole", value: 0 },
    { role: "Supplier", value: 1 },
    { role: "Transporter", value: 2 },
    { role: "Manufacturer", value: 3 },
    { role: "Wholesaler", value: 4 },
    { role: "Distributer", value: 5 },
    { role: "Pharma", value: 6 }
  ];
  user_list = [];//:UserTable[];
  displayedColumns: string[] = ['ethaddress', 'location', 'name', 'role'];

  dataSource: MatTableDataSource<UserTable>;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private modalService: NgbModal,
    private router: Router,
    private ethcontractService: EthcontractService,
    private fb: FormBuilder
  ) {
    // localStorage.setItem('useridpointer', 0 + '');
    // this.initAndDisplayAccount();
    // this.testcount();
  }
  ngOnInit() {
    console.log('In admin');
    this.ethcontractService.getAdminDetails()
      .subscribe(details => this.AdminObj = details);
    }
// public async getAdminDetailsFromService() {
//   this.ethcontractService.getAdminDetails()
//     .subscribe(function(details) {
//       this.test1 = details;
//       console.log(typeof details);
//       console.log(this.test1);
//     });
// }
  // public async initAndDisplayAccount(){
  //   console.log('Web3 init');
  //   await this.ethcontractService.checkAndInstantiateWeb3()
  //   .then((res: any) => {
  //     console.log("current address");
  //     console.log(res);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  //   await this.ethcontractService.getContract()
  //   .then(async (contract:any) => {
  //     this.contract = contract;
  //    this.AdminAccount = await this.contract.methods.Owner().call()
  //     .then(function(address:any){
  //      //owner address assigned to Adminaccount
  //       return address;
  //       // console.log(this.AdminAccount);
  //     });
  //     console.log('contract obtained');
  //     console.log(this.AdminAccount);

  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  //   let that = this;
  //   await this.ethcontractService.getOwner().then(function (acctInfo:any) {
  //     if (acctInfo.Role == 'Success') {
  //       this.account = acctInfo.Account;
  //       this.balance = acctInfo.Balance;
  //       this.contractAddress = acctInfo.contractAddress;
  //       this.userCount = acctInfo.UserCount;
  //       this.getUserInfo();
  //     } else {
  //       this.router.navigate(['/']);
  //     }
  //     console.log(acctInfo)
  //   }).catch((error) => {
  //     console.log(error);
  //     this.router.navigate(['/']);
  //   });
  //   console.log('there goes the contract');
  //   console.log(this.contract);
  // }

  getUserInfo = async () => {
    let that = this;
    console.log(that.userCount)
    // that.user_list = [];
    let itrate = true;
    let from = Number(localStorage.getItem('useridpointer'));
    let to: Number;
    if (that.userCount < from + 5) {
      to = that.userCount;
      localStorage.setItem('useridpointer', to + '');
      itrate = false;
    } else if (that.userCount > from + 5) {
      to = from + 5;
      localStorage.setItem('useridpointer', to + '');
    }
    let i: number;
    for (i = from; i < to; i++) {
      let formdata = {
        Index:i
      }
      await this.ethcontractService.getUserProfile(formdata).then(function (userInfoList: any) {
        if (userInfoList) {
          userInfoList.result.Role = that.Roles[userInfoList.result.Role].role;
          that.user_list.push(userInfoList.result);
        }
      }).catch(function (error) {
        console.log(error);
      });
    }

    console.log(that.user_list);
    this.dataSource = new MatTableDataSource<UserTable>(that.user_list);
    this.dataSource.paginator = this.paginator;
    if (itrate) {
      that.getUserInfo();
    }
  }

  refreshList = () => {
    let that = this;
    this.ethcontractService.getUserCount().then(function (count: any) {
      if (count) {
        that.userCount = count.UserCount;
        console.log(Number(localStorage.getItem('useridpointer')));
        if (Number(localStorage.getItem('useridpointer')) <= that.userCount) {
          that.getUserInfo();
        }
      }
    });

  }

  userRegister = async () => {
    console.log(this.registerUser.value);
    var formdata = {
      EthAddress: this.registerUser.value.ethaddress,
      Name: this.registerUser.value.name,
      Location: this.registerUser.value.location.latitude + "_" + this.registerUser.value.location.longitude,
      Role: this.registerUser.value.rrole
    }
    console.log(formdata);
    let that = this;
    this.ethcontractService.registerNewUser(formdata).then(function (txhash: any) {
      if (txhash) {
        console.log(txhash);
        that.handleTransactionResponse(txhash);
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  handleTransactionResponse = (txHash) => {
    var txLink = "https://ropsten.etherscan.io/tx/" + txHash;
    var txLinkHref = "<a target='_blank' href='" + txLink + "'> Click here for Transaction Status </a>";

    Swal.fire("Success", "Please Check Transaction Status here :  " + txLinkHref, "success");
    $("#linkOngoingTransaction").html(txLinkHref);
    $("#divOngoingTransaction").fadeIn();
    /*scroll to top*/
    $('html, body').animate({ scrollTop: 0 }, 'slow', function () { });
  }

}


