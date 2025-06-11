import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContatoPageRoutingModule } from './contato-routing.module';

import { ContatoPage } from './contato.page';

import { FooterModule } from 'src/shared/components/footer/footer.module';
import { HeaderModule } from 'src/shared/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContatoPageRoutingModule,
    HeaderModule,
    FooterModule
  ],
  declarations: [ContatoPage]
})
export class ContatoPageModule {}
