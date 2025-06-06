import { Component } from '@angular/core';
import { CrudService } from '../services/crud.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
    side_menu = [
      {
        icon: 'home',
        name: 'Página Inicial',
        selected: true
      },
      {
        icon: 'cube',
        name: 'Produtos',
        selected: false
      },
      {
        icon: 'person',
        name: 'Produtos',
        selected: false
      },
      {
        icon: 'people-outline',
        name: 'Clientes',
        selected: false
      },
      {
        icon: 'contacts',
        name: 'Contato',
        selected: false
      }

    ];
   
};
export class HomeModule { }