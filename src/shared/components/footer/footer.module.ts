import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    FooterComponent //importa componentes
  ],
  imports: [
    CommonModule, //importo os modulos externos
    IonicModule
  ],
  exports: [
    FooterComponent //exporta os coponentes
  ]
})
export class FooterModule { }
