import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientesPageRoutingModule } from './clientes-routing.module';

import { ClientesPage } from './clientes.page';
import { HeaderModule } from 'src/shared/components/header/header.module';
import { FooterModule } from 'src/shared/components/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientesPageRoutingModule,
    HeaderModule,
    FooterModule
  ],
  declarations: [ClientesPage]
})
export class ClientesPageModule {}
