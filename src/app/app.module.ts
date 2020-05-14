import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { AppMaterialModule } from './app.material.module';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { ManufacturerComponent } from './components/manufacturer/manufacturer.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { TransporterComponent } from './components/transporter/transporter.component';
import { UserComponent } from './components/user/user.component';
import { EthcontractService } from './ethcontract.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WholesalerComponent } from './components/wholesaler/wholesaler.component';
import { RetailerComponent } from './components/retailer/retailer.component';
import { StoreComponent } from './components/store/store.component';
import { DistributerComponent } from './components/distributer/distributer.component';
import { TransactionsComponent } from './components/transactions/transactions.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    AdminComponent,
    ManufacturerComponent,
    SupplierComponent,
    TransporterComponent,
    UserComponent,
    WholesalerComponent,
    RetailerComponent,
    StoreComponent,
    DistributerComponent,
    TransactionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [EthcontractService],
  bootstrap: [AppComponent]
})
export class AppModule { }
