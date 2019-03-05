export const state = () => ({
  baseUrl: 'https://thorindustries.com',
  baseModalActive: false,
  showEmailSignupModal: false
})

export const getters = {
  baseUrl: state => {
    return state.baseUrl
  },
  baseModalActive: state => {
    return state.baseModalActive
  },
  showEmailSignupModal: state => {
    return state.showEmailSignupModal
  }
}

export const mutations = {
  SET_BASE_MODAL_STATE(state, val) {
    state.baseModalActive = val
  },
  SET_EMAIL_SIGNUP_MODAL(state, val) {
    state.showEmailSignupModal = val
  }
}

export const actions = {
  async nuxtServerInit ({dispatch}) {
    await dispatch('navigation/getFullDecoratorNav')
  },
  setBaseModalState({commit}, val) {
    commit('SET_BASE_MODAL_STATE', val)
  },
  setEmailSignupModalState({commit}, val) {
    commit('SET_EMAIL_SIGNUP_MODAL', val)
  }
}
