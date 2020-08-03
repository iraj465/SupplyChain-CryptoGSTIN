import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { TransporterComponent } from './components/transporter/transporter.component';
import { ManufacturerComponent } from './components/manufacturer/manufacturer.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { UserComponent } from './components/user/user.component';
import { HomeComponent } from './components/home/home.component';
import { WholesalerComponent } from './components/wholesaler/wholesaler.component';
import { RetailerComponent } from './components/retailer/retailer.component';
import { ConsumerComponent } from './components/consumer/consumer.component';
import { StoreComponent } from './components/store/store.component';
import { DistributerComponent } from './components/distributer/distributer.component';
import { TransactionsComponent } from './components/transactions/transactions.component';


const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home Page' }
  },
  {
    path: 'user',
    component: UserComponent,
    data: { title: 'User Page' }
  },
  {
    path: 'supplier',
    component: SupplierComponent,
    data: { title: 'Supplier Page' }
  },
  {
    path: 'manufacturer',
    component: ManufacturerComponent,
    data: { title: 'Manufacturer Page' }
  },
  {
    path: 'transporter',
    component: TransporterComponent,
    data: { title: 'Transporter Page' }
  },
  {
    path: 'wholesaler',
    component: WholesalerComponent,
    data: { title: 'Wholesaler Page' }
  },
  {
    path: 'distributer',
    component: DistributerComponent,
    data: { title: 'Distributer Page' }
  },
  {
    path: 'store',
    component: StoreComponent,
    data: { title: 'Store Page' }
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    data: { title: 'Transactions Page' }
  },
  {
    path: 'admin',
    component: AdminComponent,
    data: { title: 'Admin Page' }
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
