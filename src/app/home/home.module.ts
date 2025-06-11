import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { FooterModule } from 'src/shared/components/footer/footer.module';
import { HeaderModule } from 'src/shared/components/header/header.module';
import { SlideModule } from 'src/shared/components/slide/slide.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HeaderModule,
    FooterModule,
    SlideModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
