import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
/* import 'bootstrap/scss/bootstrap.scss'; */
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faUserSecret,faUser, faTrashAlt, faPencilAlt, faCog, faVideo, faTable, faSquare , faTrophy } from '@fortawesome/free-solid-svg-icons'



/* add icons to the library */
library.add(faUserSecret,faUser, faTrashAlt, faPencilAlt, faCog, faVideo, faTable, faSquare, faTrophy )



import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)

app.mount('#app')
