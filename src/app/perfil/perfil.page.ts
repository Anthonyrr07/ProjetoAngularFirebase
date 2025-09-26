import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  // Armazena os dados do usuário logado
  usuario: any = null;

  // Indica se está carregando dados da API
  carregando: boolean = true;

  // Indica se o perfil está em modo de edição
  editando: boolean = false;

  // Arquivo de foto de perfil selecionado
  arquivoFoto: File | null = null;

  // Pré-visualização da foto de perfil antes do upload
  previewFoto: string | null = null;

  // Estrutura de uma nova postagem a ser criada
  novaPostagem: any = {
    conteudo: '',
    imagem: null,
    previewImagem: null
  };

  constructor(
    private apiService: ApiService,       // Serviço para chamadas à API
    private storage: Storage,             // Armazena token/local storage
    private router: Router,               // Navegação entre páginas
    private alertController: AlertController // Exibe alertas (erro/sucesso)
  ) {}

  async ngOnInit() {
    // Carrega dados do usuário quando a página inicializa
    await this.carregarUsuario();
  }

  async carregarUsuario() {
    // Recupera token salvo no storage
    const token = await this.storage.get('auth_token');
    if (!token) {
      // Se não tiver token, redireciona para a tela inicial (home/login)
      this.router.navigate(['/home']);
      return;
    }

    // Busca dados do perfil do usuário
    this.apiService.get('usuario/perfil').subscribe({
      next: (resp) => {
        this.usuario = resp;
        if (!this.usuario.postagens) this.usuario.postagens = [];

        // Atualiza cada postagem com a URL completa da imagem
        this.usuario.postagens = this.usuario.postagens.map((post: any) => ({
          ...post,
          fotoUrl: this.getFotoPostagem(post.picture)
        }));

        // Atualiza URL da foto de perfil
        this.usuario.pictureUrl = this.getFotoPerfil(this.usuario.picture);

        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar perfil', err);
        this.carregando = false;
        this.mostrarErro('Erro ao carregar perfil');
      }
    });
  }

  // ===================== FOTO DE PERFIL =====================

  // Seleção de arquivo da foto de perfil
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.arquivoFoto = file;
      const reader = new FileReader();
      // Converte a imagem em Base64 para pré-visualização
      reader.onload = (e: any) => this.previewFoto = e.target.result;
      reader.readAsDataURL(file);
    } else this.mostrarErro('Selecione apenas imagens válidas.');
  }

  // Upload da foto para a API
  uploadFoto(): void {
    if (!this.arquivoFoto) {
      this.mostrarErro('Nenhuma imagem selecionada.');
      return;
    }

    const formData = new FormData();
    formData.append('picture', this.arquivoFoto);

    this.apiService.post('usuario/foto-upload', formData).subscribe({
      next: (resp: any) => {
        // Atualiza foto de perfil com o retorno da API
        this.usuario.picture = resp.picture_url;
        this.usuario.pictureUrl = this.getFotoPerfil(resp.picture_url);
        this.arquivoFoto = null;
        this.previewFoto = null;
        this.mostrarSucesso('Foto de perfil atualizada!');
      },
      error: (err) => {
        console.error(err);
        this.mostrarErro('Erro ao atualizar foto');
      }
    });
  }

  // ===================== PERFIL =====================

  // Alterna entre visualizar e editar perfil
  toggleEdicao() { this.editando = !this.editando; }

  // Salva alterações feitas no perfil
  salvarPerfil(): void {
    if (!this.usuario.name || !this.usuario.email) {
      this.mostrarErro('Nome e e-mail são obrigatórios');
      return;
    }

    this.apiService.post('usuario/editar', this.usuario).subscribe({
      next: () => {
        this.editando = false;
        this.mostrarSucesso('Perfil atualizado!');
      },
      error: (err) => {
        console.error(err);
        this.mostrarErro('Erro ao salvar perfil');
      }
    });
  }

  // ===================== POSTAGENS =====================

  // Seleção de imagem para uma nova postagem
  onImagemPostagemSelecionada(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.novaPostagem.imagem = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.novaPostagem.previewImagem = e.target.result;
      reader.readAsDataURL(file);
    } else this.mostrarErro('Selecione uma imagem válida.');
  }

  // Criação de nova postagem
  criarPostagem(): void {
    const { conteudo, imagem } = this.novaPostagem;
    if (!conteudo) {
      this.mostrarErro('Conteúdo é obrigatório.');
      return;
    }

    const formData = new FormData();
    formData.append('description', conteudo);
    if (imagem) formData.append('picture', imagem);

    this.apiService.post('usuario/postagens', formData).subscribe({
      next: (resp: any) => {
        // Atualiza URL da imagem da nova postagem
        resp.fotoUrl = this.getFotoPostagem(resp.picture);
        // Adiciona nova postagem no início da lista
        this.usuario.postagens.unshift(resp);
        // Reseta formulário de postagem
        this.novaPostagem = { conteudo: '', imagem: null, previewImagem: null };
        this.mostrarSucesso('Postagem publicada!');
      },
      error: (err) => {
        console.error(err);
        this.mostrarErro('Erro ao publicar postagem');
      }
    });
  }

  // ===================== FUNÇÕES DE URL =====================

  // Retorna URL da foto de perfil (padrão ou completa)
  getFotoPerfil(caminho: string | null): string {
    if (!caminho) return 'assets/default-avatar.png';
    if (caminho.startsWith('http')) return caminho;
    return `http://127.0.0.1:8000/storage/${caminho.replace(/^\/+/, '')}`;
  }

  // Retorna URL da foto de postagem
  getFotoPostagem(caminho: string | null): string {
    if (!caminho) return '';
    if (caminho.startsWith('http')) return caminho;

    // Detecta automaticamente pasta de origem da imagem
    const base = 'http://127.0.0.1:8000/storage/';
    if (caminho.includes('postagens') || caminho.includes('pictures')) {
      return `${base}${caminho.replace(/^\/+/, '')}`;
    }

    // Caso seja apenas o nome do arquivo
    return `${base}postagens/${caminho}`;
  }

  // ===================== ALERTAS =====================

  // Mostra alerta de erro
  private async mostrarErro(mensagem: string) {
    const alert = await this.alertController.create({ header: 'Erro', message: mensagem, buttons: ['OK'] });
    await alert.present();
  }

  // Mostra alerta de sucesso
  private async mostrarSucesso(mensagem: string) {
    const alert = await this.alertController.create({ header: 'Sucesso', message: mensagem, buttons: ['OK'] });
    await alert.present();
  }

  // ===================== LOGOUT =====================

  // Exibe confirmação de logout
  async logout() {
    await this.alertController.create({
      header: 'Sair',
      message: 'Deseja realmente sair?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Sair', handler: () => this.realizarLogout() }
      ]
    }).then(a => a.present());
  }

  // Executa logout limpando storage e voltando para home
  private realizarLogout() {
    this.apiService.post('usuario/logout', {}).subscribe({
      next: async () => { await this.storage.clear(); this.router.navigate(['/home']); },
      error: async () => { await this.storage.clear(); this.router.navigate(['/home']); }
    });
  }
}
