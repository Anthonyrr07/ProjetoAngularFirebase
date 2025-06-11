import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdutosPageRoutingModule } from './produtos-routing.module';

import { ProdutosPage } from './produtos.page';
import { HeaderModule } from 'src/shared/components/header/header.module';
import { FooterModule } from 'src/shared/components/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdutosPageRoutingModule,
    HeaderModule,
    FooterModule
  ],
  declarations: [ProdutosPage]
})
export class ProdutosPageModule {}
