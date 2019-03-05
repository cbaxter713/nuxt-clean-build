export const state = () => ({
  landingPage: null,
  items: {}
})

export const getters = {
  landingPage: state => {
    return state.landingPage
  },
  items: state => {
    return state.items
  },
  itemById: (state) => (uid) => {
    return state.items[uid]
  }
}

export const mutations = {
  SET_LANDING_PAGE (state, doc) {
    state.landingPage = doc
  },
  SET_ITEM (state, item) {
    state.items[item.uid] = item.doc
  }
}

export const actions = {
  async getLandingPage ({dispatch, getters, commit}) {
    if (getters.landingPage) {
      return getters.landingPage
    } else {
      const landingPage = await this.$prismic.api.getSingle('rv_type_landing', {fetchLinks: ['rv_type.navigation_title', 'rv_type.navigation_text', 'rv_type.uid']})
      commit('SET_LANDING_PAGE', landingPage)
      return landingPage
    }
  },
  async getItemById ({getters, commit}, uid) {
    if (getters.itemById(uid)) {
      return getters.itemById(uid)
    } else {
      const itemDoc = await this.$prismic.api.getByUID('rv_type', uid)
      const itemData = {
        uid: uid,
        doc: itemDoc
      }
      commit('SET_ITEM', itemData)
      return itemDoc
    }
  }
}
