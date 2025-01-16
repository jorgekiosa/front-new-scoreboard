export default {

  session(state) {
    return state._session;
  },
  user(state) {
    return state._userData;
  },
  profileImage(state) {
    return state._profileImage;
  },
  token(state) {
    return state._token;
  },
  roles(state) {
    return state._roles;
  },
  fullName(state) {
    return `${state._userData?.firstName} ${state._userData?.lastName}`;
  },
  organizationAvatar(state) {
    const avatar = state._userData?.organization?.avatar;
    return avatar;
  },

  loginUrl(state) {
    let url = '/images/logo.png';
    return url;
  }
};
