import { Component } from '@angular/core';
import { AuthenticateService } from '../services/auth.service';
import { CrudService } from '../services/crud.service';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { MessageService } from '../services/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  perfil: any = {
    foto: null,
    nome: null,
    profissao: null,
    nome_usurario: null,
    idioma: null,
    localidade: null,
    data_inicio: null,
    biografia: null,
    estatisticas: {
      curtidas: 0,
      seguindo: 0,
      amigos: 0,
    },
    postagens: [
      {
        foto: 'https://i.ytimg.com/vi/t6PE6jfpBZ4/hqdefault.jpg?sqp=-oaymwEmCOADEOgC8quKqQMa8AEB-AHUBoAC4AOKAgwIABABGDogSihyMA8=&rs=AOn4CLCIGe7OKpFxVO3WOI6mjpp6jdt-OQ',
        nome: 'Sonic The Hedghog',
        nome_usuario: '@sonicthehedghog',
        texto: 'Sonic Impactado',
        data: '12/03/2025 14:00',
      },
      {
        foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS--lF6akd9IHXYkFpYn7UgPOulKNMf8AFgDw&s',
        nome: 'Sonic The Hedghog 2',
        nome_usuario: '@sonicthehedghog2',
        texto: 'Sonic Gordo',
        data: '12/03/2025 14:10',
      },
      {
        foto: 'https://www.adrenaline.com.br/wp-content/uploads/2022/05/sonic-feio-filme-tico-e-teco_2.jpg',
        nome: 'Sonic The Hedghog 3',
        nome_usuario: '@@sonicthehedghog3',
        texto: 'Sonic Descolado',
        data: '12/03/2025 14:20',
      }
    ]
  }

  constructor(){}
  
};
