import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EthcontractService } from '../ethcontract.service';
import { RetailerComponent } from './retailer/retailer.component';
import { ConsumerComponent } from './consumer/consumer.component';
import { StoreComponent } from './store/store.component';
import { DistributerComponent } from './distributer/distributer.component';
import { TransactionsComponent } from './transactions/transactions.component';



@NgModule({
  declarations: [RetailerComponent, ConsumerComponent, StoreComponent, DistributerComponent, TransactionsComponent],
  imports: [
    CommonModule,
    EthcontractService
  ]
})
export class ComponentsModule { }
