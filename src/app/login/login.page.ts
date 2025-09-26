import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',                  // seletor usado no HTML
  templateUrl: './login.page.html',       // template da página
  styleUrls: ['./login.page.scss'],       // estilos da página
})
export class LoginPage {
  // Variáveis que armazenam email, senha e estado de carregamento
  email: string = '';
  senha: string = '';
  carregando: boolean = false;

  constructor(
    private api: ApiService,              // serviço de API para chamadas HTTP
    private router: Router,               // usado para navegar entre páginas
    private storage: Storage,             // armazenamento local (auth, dados do usuário)
    private alertCtrl: AlertController    // controlador para exibir alertas
  ) {}

  // Função chamada ao tentar logar
  async login() {
    // Se email ou senha estiverem vazios, mostra erro e interrompe o processo
    if (!this.email || !this.senha) {
      this.mostrarErro('Preencha email e senha.');
      return;
    }

    this.carregando = true; // ativa estado de "carregando"

    // Requisição POST para login
    this.api.post('usuario/login', {
      email: this.email,           // envia o email digitado
      password: this.senha,        // envia a senha digitada
    }).subscribe({
      // Caso sucesso na resposta
      next: async (resp) => {
        // Salva token e dados do usuário no storage
        await this.storage.set('auth_token', resp.token);
        await this.storage.set('user_data', resp.user);
        this.carregando = false;   // desativa loading
        this.router.navigate(['/perfil']); // redireciona para a página de perfil
      },
      // Caso erro na resposta
      error: (err) => {
        this.carregando = false;   // desativa loading
        console.error(err);        // log do erro no console
        // Mostra mensagem vinda da API, ou texto padrão
        this.mostrarErro(err.error?.message || 'Login inválido.');
      }
    });
  }

  // Função para exibir alertas de erro
  async mostrarErro(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'Erro',              // título do alerta
      message: msg,                // mensagem dinâmica recebida
      buttons: ['OK']              // botão para fechar
    });
    await alert.present();         // exibe o alerta
  }
}
