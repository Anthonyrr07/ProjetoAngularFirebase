import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilPageRoutingModule } from './perfil-routing.module';

import { PerfilPage } from './perfil.page';

@NgModule({
  // Aqui declaramos todos os módulos que serão usados dentro desta página
  imports: [
    CommonModule,            // Importa funcionalidades comuns do Angular (ngIf, ngFor, etc.)
    FormsModule,             // Permite o uso de formulários template-driven
    IonicModule,             // Importa componentes e funcionalidades do Ionic
    PerfilPageRoutingModule  // Configura as rotas específicas da página de perfil
  ],
  // Aqui declaramos os componentes que pertencem a este módulo
  declarations: [PerfilPage]
})
export class PerfilPageModule {} // Define o módulo da página de Perfil
