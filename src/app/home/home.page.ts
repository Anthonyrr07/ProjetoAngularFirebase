import { Component } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',                 // seletor usado no HTML
  templateUrl: 'home.page.html',        // template da página
  styleUrls: ['home.page.scss'],        // estilos da página
})
export class HomePage {

  // Objeto que armazena os dados do usuário
  usuario: any = {
    name: '',                // Nome completo
    email: '',               // Email
    password: '',            // Senha
    password_confirmation: ''// Confirmação de senha
  }

  loading: boolean = false; // Indica se está em processo de cadastro
  mensagem: string = '';    // Mensagem de sucesso ou erro

  constructor(
    public apiService: ApiService, // Serviço para fazer chamadas à API
    private router: Router,        // Para navegação entre páginas
    private storage: Storage       // Armazenamento local de dados
  ) { }

  // Função executada quando o componente é inicializado
  async ngOnInit() {
    await this.storage.create(); // Cria/Inicializa o banco do Storage
  }

  // Função para cadastrar um novo usuário
  async cadastrarUsuario() {
    this.loading = true;  // Ativa estado de carregamento
    this.mensagem = '';   // Limpa mensagens anteriores
    
    // Chamada POST para registrar o usuário na API
    this.apiService.post('usuario/registrar-se', this.usuario).subscribe({
      
      // Caso a requisição seja bem-sucedida
      next: async (resp) => {
        console.log('Sucesso!', resp);
        this.loading = false;  // Desativa carregamento

        // Armazena token e dados do usuário no Storage
        await this.storage.set('auth_token', resp.token);
        await this.storage.set('user_data', resp.user);

        // Redireciona para a página de perfil
        this.router.navigate(['/perfil']);
      },
      
      // Caso ocorra algum erro na requisição
      error: (err) => {
        console.error('Erro!', err);
        this.loading = false; // Desativa carregamento
        // Exibe mensagem de erro da API ou texto padrão
        this.mensagem = err.error?.message || 'Erro ao cadastrar';
      }
    });
  }
}
