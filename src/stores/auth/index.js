import actions from './actions';
import getters from './getters';
import state from './state';

import { defineStore } from 'pinia';

export default defineStore('app', {
  state,
  getters,
  actions
});
