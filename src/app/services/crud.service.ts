import { orderBy } from '@firebase/firestore';
import { Injectable } from '@angular/core';
import { addDoc, getDocs, doc, updateDoc, collection, Firestore, deleteDoc, query, where, WhereFilterOp, startAt, endAt } from '@angular/fire/firestore';
import { AuthenticateService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { AlertController } from '@ionic/angular';

@Injectable({
    providedIn: 'root', // Serviço disponível globalmente
})

export class CrudService {
    isLoading: boolean = false; // Indica se está processando alguma ação
    handlerMessage = '';         // Mensagem de controle genérica
    roleMessage = '';            // Mensagem de permissões/roles
    
    constructor(
        public firestore: Firestore,             // Instância do Firestore
        private _message: MessageService,       // Serviço para exibir mensagens
        private _auth: AuthenticateService,     // Serviço de autenticação (não usado ativamente aqui)
        private _alertController: AlertController // Para exibir alertas
    ) {}

    /*
    * Inserir um novo registro no banco de dados
    */
    insert(item: any, remoteCollectionName: string): Boolean {
        console.log(item)
        let result = false;
        
        if (!item) { 
            this._message.show('Não foi possível salvar'); 
            return false;
        }

        this.isLoading = true; // Ativa carregamento
        const dbInstance = collection(this.firestore, remoteCollectionName);
        addDoc(dbInstance, item) // Adiciona documento no Firestore
          .then(() => {
            this._message.show('Salvo com sucesso.');
            result = true;
          })
          .catch(() => {
            this._message.show('Erro ao salvar.');
          })
          .finally(() => {
            this.isLoading = false; // Desativa carregamento
          });
        return result;
    }

    /*
    * Pegar todos os itens de uma coleção
    */
    fetchAll(remoteCollectionName: string): Promise<any> {
        this.isLoading = true; // Ativa carregamento
        let data: any = [];

        const dbInstance = collection(this.firestore, remoteCollectionName);
        
        data = getDocs(dbInstance) // Busca documentos
            .then((response) => {
                return [
                    ...response.docs.map((item) => {
                        return { ...item.data(), id: item.id }; // Retorna dados + id do documento
                    })
                ];
            })
            .catch((_: any) => {
                this._message.show('Erro ao buscar item.');
                return [];
            })
            .finally(() => {
                this.isLoading = false;
            });

        return data;
    }

    /*
    * Pegar um item usando um operador específico (=, <, >, <=, >=, etc.)
    */
    async fetchByOperatorParam(fieldName: string, operator: WhereFilterOp, fieldValue: any, remoteCollectionName: string): Promise<any> {
        this.isLoading = true;
        let data: any = [];

        const dbInstance = query(collection(this.firestore, remoteCollectionName), where(fieldName, operator, fieldValue));
        
        data = getDocs(dbInstance)
            .then((response) => {
                return [
                    ...response.docs.map((item) => {
                        return { ...item.data(), id: item.id };
                    })
                ];
            })
            .catch((_: any) => {
                this._message.show('Erro ao buscar item.');
                return [];
            })
            .finally(() => {
                this.isLoading = false;
            });

        return data;
    }

    /*
    * Pegar itens usando "Like" (início da string)
    */
    async fetchByLike(fieldName: string, fieldValue: string, remoteCollectionName: string): Promise<any> {
        this.isLoading = true;
        let data: any = [];

        const dbInstance = query(
            collection(this.firestore, remoteCollectionName), 
            orderBy(fieldName), 
            startAt(fieldValue), 
            endAt(fieldValue + '\uf8ff') // Busca por prefixo
        );
        
        data = getDocs(dbInstance)
            .then((response) => {
                return [
                    ...response.docs.map((item) => {
                        return { ...item.data(), id: item.id };
                    })
                ];
            })
            .catch((_: any) => {
                this._message.show('Erro ao buscar item.');
                return [];
            })
            .finally(() => {
                this.isLoading = false;
            });

        return data;
    }
    
    /*
    * Atualizar um item existente
    */
    update(id: string, data: any, remoteCollectionName: string): boolean {
        this.isLoading = true;
        let result = false;
        
        const dataToUpdate = doc(this.firestore, remoteCollectionName, id);

        updateDoc(dataToUpdate, {
            ...data // Atualiza campos fornecidos
        })
            .then(() => {
                this._message.show('Informação Atualizada!');
                result = true;
            })
            .catch((_: any) => {
                this._message.show('Erro ao atualizar.');
            })
            .finally(() => {
                this.isLoading = false;
            });

        return result;
    }

    /*
    * Remover um item do banco de dados
    */
    async remove(id: string, remoteCollectionName: string) {
        const alert = await this._alertController.create({
            header: 'Essa ação não poderá ser revertida!',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                },
                {
                    text: 'Confirmar Exclusão',
                    role: 'confirm',
                }
            ]
        });
        
        await alert.present();
        
        const { role } = await alert.onDidDismiss();

        if (role == 'confirm') { // Se o usuário confirmou
            this.isLoading = true;
            const dataToDelete = doc(this.firestore, remoteCollectionName, id);
            deleteDoc(dataToDelete)
                .then(() => {
                    this._message.show('Registro removido!');
                })
                .catch(() => {
                    this._message.show('Erro ao remover!');
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }
    }
}
