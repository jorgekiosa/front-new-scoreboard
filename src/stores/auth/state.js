export default () => ({
  _session: null,
  _userData: null,
  _token: localStorage.getItem("Authorization") !== null ? localStorage.getItem("Authorization") : {},
  _permissoes: null,
  _roles: localStorage.getItem("rAndP") !== null ? JSON.parse(localStorage.getItem("rAndP")) : {},
  _operacoes: null,
  isLoading: false,
  _profileImage:"",
});
