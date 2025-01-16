<template>
  <div class="container mt-5">
    <div class="card shadow">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="d-flex">
            <!-- Texto "Utilizadores" à esquerda do campo de pesquisa -->
            <span class="me-2 text-title-table">Meus Boards</span>
          </div>
          <!-- Campo de pesquisa (agora mais à direita) -->
          <div class="d-flex ms-auto">
            <input
              type="text"
              class="form-control"
              v-model="searchQuery"
              placeholder="Pesquisar"
              @input="filterUsers"
            />
          </div>
          <!-- Botão de Adicionar Board -->
          <button
            class="btn btn-danger ms-3"
            @click="openAddUserOffcanvas"
          >
            + Adicionar Board
          </button>
        </div>
        <hr class="border border-ligth opacity-50">
        <!-- Tabela com usuários -->
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Data de criação</th> 
              <th scope="col">Código</th> 
              <th scope="col">Estado</th> 
              <th scope="col">Nome</th> 
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="score in paginatedUsers" :key="score.id">
              <td>{{ createdAtC(score.date) }}</td>
              <td>{{ score.code }}</td>
              <td><span class="badge" :class="returnColorStatus(score.status)">{{score.status==1?'Em andamento':'Finalizado'}}</span></td>
              <td>{{ score.name }}</td>
              <td>
                <div class="dropdown">
                  <button
                    class="btn btn-outline-secondary btn-sm dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    ...
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <button
                        class="dropdown-item"
                        @click="openEditUserOffcanvas(score)"
                      >
                      <font-awesome-icon :icon="['fas', 'pencil-alt']" /> Editar
                      </button>
                    </li>
                    <li>
                      <button
                        :disabled="score.status==2"
                        class="dropdown-item"
                        @click="handleConfig(score.code)"
                      >
                       <font-awesome-icon :icon="['fas', 'cog']" /> Control
                      </button>
                    </li>
                    <li>
                      <button
                        :disabled="score.status==2"
                        class="dropdown-item"
                        @click="handleStream(score.code)"
                      >
                       <font-awesome-icon :icon="['fas', 'video']" /> Stream
                      </button>
                    </li>
                    <li>
                      <button
                       :disabled="score.status==2"
                        class="dropdown-item"
                        @click="handlePointsControl(score.code)"
                      >
                       <font-awesome-icon :icon="['fas', 'table']" /> Controle Pontos
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item btn btn-outline-danger"
                        @click="openModalConfirm(score)"
                      >
                      <font-awesome-icon :icon="['fas', 'trash-alt']" /> Eliminar
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Paginação alinhada à direita -->
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-end">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="changePage(currentPage - 1)">
                Anterior
              </button>
            </li>
            <li
              class="page-item"
              v-for="page in totalPages" 
              :key="page"
              :class="{ active: currentPage === page }"
            >
              <button class="page-link" @click="changePage(page)">
                {{ page }}
              </button>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }"
            >
              <button class="page-link" @click="changePage(currentPage + 1)">
                Próximo
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Offcanvas -->
    <div
      v-if="showOffcanvas"
      class="offcanvas offcanvas-end show"
      style="z-index: 1050; display: block;"
      tabindex="-1"
      role="dialog"
    >
      <div class="offcanvas-header">
        <h5>{{ isEditing ? 'Editar Board' : 'Adicionar Board' }}</h5>
        <button
          type="button"
          class="btn-close"
          @click="closeOffcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body">
        <form @submit.prevent="isEditing ? updateScore() : addScore()">
          <div class="mb-3">
            <label for="name" class="form-label">Nome</label>
            <input
              v-model="newScore.name"
              type="text"
              class="form-control"
              id="name"
              placeholder="Insira o nome"
              required
            />
          </div>
          <div class="mb-3" v-if="isEditing">
            <label for="mail" class="form-labeel">Estados</label>
            <select class="form-select" aria-label="Default select example"  v-model="newScore.status">
              <option v-for="status in listStatus" :key="status.id" :value="status.id">{{status.value}}</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="mail" class="form-labeel">Descrição</label>
            <textarea class="form-control" id="exampleFormControlTextarea1" v-model="newScore.description" rows="3"></textarea>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="isLoadVisible">
                <span v-if="isLoadVisible==false">{{ isEditing ? 'Atualizar' : 'Salvar' }}</span>
                <span v-if="isLoadVisible" class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
                <span v-if="isLoadVisible" role="status">Loading...</span>
          </button>
        </form>
      </div>
    </div>

        <!--Modal Load-->
        <div v-if="showModalLoad" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content-load p-4">
            <div class="text-center">
                <div class="spinner-border text-center text-light" style="width: 4rem; height: 4rem;" role="status"></div>
                <div class="mt-3"><span class="text-center"> Processando, por favor aguarde ...</span></div>
            </div>
        </div>
      </div>

      <!-- Modal Confirmação -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModalConfirm">
        <div class="modal-content p-4">
          <h4 class="fw-bold mb-3">Aviso !</h4>
          <p>Deseja realmente eliminar este board <strong>{{selectedItem.name}}</strong> ?</p>
          <div class="d-inline-flex gap-2 mx-auto">
            <button class="btn btn-danger" @click="closeModalConfirm">Não</button>
            <button class="btn btn-primary" @click="deleteScore">Sim</button>
          </div>
        </div>
      </div>


    <div class="toast-container position-fixed top-0 end-0 p-3">
        <div
            id="liveToast"
            class="toast"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            ref="toast"
        >
            <div class="toast-header text-white bg-danger">
            <font-awesome-icon class="text-white rounded me-2" :icon="['fas', 'user-secret']" />
            <strong class="me-auto text-white">Aviso</strong>
            <small class="fw-bold">{{returnsMonth(new Date())}}</small>
            <button
                type="button"
                class="btn-close btn-white text-white"
                data-bs-dismiss="toast"
                aria-label="Close"
            ></button>
            </div>
            <div class="toast-body">{{ message }}</div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { useRouter } from "vue-router";
import * as bootstrap from "bootstrap";
import useScoreDefault from "@/stores/ScoreStore"
const scoreStoreDefault = useScoreDefault();

// Controle do Offcanvas e estado
const showOffcanvas = ref(false);
const isEditing = ref(false);
const editingIndex = ref(-1);
const isLoadVisible =ref(false)
const showModalLoad = ref(false)
const showModal = ref(false)
const message =ref('')
const toast = ref(null);
const selectedItem = ref(null);
const router = useRouter();

// Novo usuário ou usuário a ser editado
const newScore = reactive({
  id:'',
  code: '',
  name: '',
  description: '',
  status:1,
  sport_type: '',
});

const listStatus= ref([
  {
    id:1,
    value:'Em andamento'
  },
  {
    id:2,
    value:'Finalizado'
  }
])

// Variável para armazenar a consulta de pesquisa
const searchQuery = ref('');

// Variáveis para paginação
const currentPage = ref(1);
const itemsPerPage = 6;

const filteredBoards = computed(() => {
  if (!searchQuery.value) return scoreStoreDefault.scores;
  return scoreStoreDefault.scores.filter(score =>
    score.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    score.code.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredBoards.value.length / itemsPerPage);
});

const paginatedUsers = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredBoards.value.slice(startIndex, endIndex);
});

// Função para mudar de página
function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

const createdAtC=(created)=>{
  if (created)
  return (
    created.toString().split("T")[0].split("-").reverse().join("/") +
      " - Horas: " +
      created.toString().split("T")[1].split(".")[0]
    );
  else return "------";
}

const returnColorStatus = (item)=>{
  if(item==1){
    return 'text-bg-primary'
  }else{
    return 'text-bg-success'
  }

}

const openModal = (item) => {
  showModalLoad.value = true;
};

// Função para fechar modal
const closeModal = () => {
  showModalLoad.value = false;
};
const openModalConfirm = (item) => {
  selectedItem.value=item
  showModal.value = true;
};

// Função para fechar modal
const closeModalConfirm = () => {
  showModal.value = false;
};

// Abrir o Offcanvas para adicionar usuário
function openAddUserOffcanvas() {
  resetForm();
  isEditing.value = false;
  showOffcanvas.value = true;
}

// Abrir o Offcanvas para editar usuário
function openEditUserOffcanvas(score) {
  resetForm();
  isEditing.value = true;
  editingIndex.value = scoreStoreDefault.scores.indexOf(score);
  newScore.id = score.id;
  newScore.code = score.code;
  newScore.name = score.name;
  newScore.description = score.description;
  newScore.status = score.status;
  newScore.sport_type = score.sport_type;
  showOffcanvas.value = true;
}

// Fechar o Offcanvas
function closeOffcanvas() {
  showOffcanvas.value = false;
}

const showToast = () => {
  if (toast.value) {
    const bootstrapToast = new bootstrap.Toast(toast.value);
    bootstrapToast.show();
  }
};
const  returnsMonth = (created)=>{
    if (created)
    return new Date(created).toLocaleDateString('pt-PT', { year: 'numeric', month: 'numeric', day: 'numeric'})
    else return "------";
  }

// Função para gerar número aleatório
const generateRandomNumber = () => {
  return Math.floor(10000 + Math.random() * 90000);
};

// Função do botão "Começar"
const handleConfig = (code) => {
  router.push(`/board?code=${code}&c=c`);
  
};

const handlePointsControl = (code) => {
  router.push(`/points?code=${code}&c=p`);
  
};

const handleStream = (code) => {
  const url = `/broadcast?code=${code}`;
  const newWindow = window.open(url, '_blank');
  newWindow.onload = () => {
    socket.emit('updateGame', data);  // Emitir dados para a nova aba
  };
};
  
// Adicionar listar usuários
const listScore= async()=> {
  showModalLoad.value=true
  openModal()
  const result = await scoreStoreDefault.listScore(newScore);
      if (result.code == 1) {
        setTimeout(() => {
          showModalLoad.value = false
          closeModal()
        }, 1000);
      }else if (result.code == 2) {
        showModalLoad.value = false
        showSnackbar({
          location:"top end",
          color:"error",
          message: `Lamentamos, não poderá acessar a sua conta porque encontra-se inativa, por favor contacte o Administrador do sistema!`,
          transition:"scroll-y-reverse-transition",
          timeout: 3000,
        });
      } else if (result.code == 4) {
        message.value='Ups!!! Ocorreu um erro ao realizar essa operação'
        showModalLoad.value = false
        closeOffcanvas();
        showToast()
        closeModal()
      } else if (result.code == 5) {
        message.value='Ocorreu um erro, verifique a sua conexão.'
        showModalLoad.value = false
        closeOffcanvas();
        showToast()
        closeModal()
      }
}

// Adicionar um novo usuário
const addScore= async()=> {
  isLoadVisible.value = true
  const id =generateRandomNumber()
  newScore.id=id
  newScore.code=id
  const result = await scoreStoreDefault.addScore(newScore);
      if (result.code == 1) {
        setTimeout(() => {
          message.value='Operação realizada com sucesso (^_-).'
          isLoadVisible.value = false
          listScore()
          closeOffcanvas();
          showToast()
        }, 1000);
      }else if (result.code == 2) {
        isLoadVisible.value = false
        showSnackbar({
          location:"top end",
          color:"error",
          message: `Lamentamos, não poderá acessar a sua conta porque encontra-se inativa, por favor contacte o Administrador do sistema!`,
          transition:"scroll-y-reverse-transition",
          timeout: 3000,
        });
      } else if (result.code == 4) {
        message.value='Ups!!! Ocorreu um erro ao realizar essa operação'
        isLoadVisible.value = false
        closeOffcanvas();
        showToast()
      } else if (result.code == 5) {
        message.value='Ocorreu um erro, verifique a sua conexão.'
        isLoadVisible.value = false
        closeOffcanvas();
        showToast()
      }
}

// Atualizar um usuário existente
const updateScore = async ()=> {
  isLoadVisible.value = true
  const result = await scoreStoreDefault.updateScore(newScore);
      if (result.code == 1) {
        setTimeout(() => {
          message.value='Operação realizada com sucesso (^_-).'
          isLoadVisible.value = false
          listScore()
          closeOffcanvas();
          showToast()
        }, 1000);
      }else if (result.code == 2) {
        isLoadVisible.value = false
        showSnackbar({
          location:"top end",
          color:"error",
          message: `Lamentamos, não poderá acessar a sua conta porque encontra-se inativa, por favor contacte o Administrador do sistema!`,
          transition:"scroll-y-reverse-transition",
          timeout: 3000,
        });
      } else if (result.code == 4) {
        message.value='Ups!!! Ocorreu um erro ao realizar essa operação'
        isLoadVisible.value = false
        closeOffcanvas();
        showToast()
      } else if (result.code == 5) {
        message.value='Ocorreu um erro, verifique a sua conexão.'
        isLoadVisible.value = false
        closeOffcanvas();
        showToast()
      }
}

// Delete um usuário existente
const deleteScore = async ()=> {
  isLoadVisible.value = true
  const result = await scoreStoreDefault.deleteScore(selectedItem.value.id);
      if (result.code == 1) {
        showToast()
        closeModalConfirm()
        setTimeout(() => {
          message.value='Operação realizada com sucesso (^_-).'
          isLoadVisible.value = false
          listScore()
        }, 1000);
      }else if (result.code == 2) {
        isLoadVisible.value = false
        showSnackbar({
          location:"top end",
          color:"error",
          message: `Lamentamos, não poderá acessar a sua conta porque encontra-se inativa, por favor contacte o Administrador do sistema!`,
          transition:"scroll-y-reverse-transition",
          timeout: 3000,
        });
      } else if (result.code == 4) {
        message.value='Ups!!! Ocorreu um erro ao realizar essa operação'
        isLoadVisible.value = false
        closeOffcanvas();
        showToast()
        closeModalConfirm()
      } else if (result.code == 5) {
        message.value='Ocorreu um erro, verifique a sua conexão.'
        isLoadVisible.value = false
        closeOffcanvas();
        showToast()
        closeModalConfirm()
      }
}

// Resetar o formulário
function resetForm() {
  newScore.code = '';
  newScore.name = '';
  newScore.description = '';
  newScore.status = 1;
  newScore.sport_type = '';
  editingIndex.value = -1;
}


onMounted(() => {
  listScore();
});
</script>
<style scoped>
.text-title-table{
  color:#2f2b3de6;
  font-size: 1.125rem;
  font-weight: 500;
}
.transparent-dialog {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content-load {
    color: #fff;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    background-color: transparent !important;
    box-shadow: none !important;
    border: none !important;
  }
  .modal-content {
    background: #fff;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  }

  .modal-content button {
    display: block;
    margin: 0 auto;
  }
</style>