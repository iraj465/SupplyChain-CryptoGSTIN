import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EthcontractService } from '../ethcontract.service';
import { WholesalerComponent } from './wholesaler/wholesaler.component';
import { RetailerComponent } from './retailer/retailer.component';
import { ConsumerComponent } from './consumer/consumer.component';



@NgModule({
  declarations: [WholesalerComponent, RetailerComponent, ConsumerComponent],
  imports: [
    CommonModule,
    EthcontractService
  ]
})
export class ComponentsModule { }
