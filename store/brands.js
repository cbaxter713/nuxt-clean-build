export const state = () => ({
  landingPage: null,
  brandItems: {}
})

export const getters = {
  landingPage: state => {
    return state.landingPage
  },
  brandItems: state => {
    return state.brandItems
  },
  brandItemById: (state) => (uid) => {
    return state.brandItems[uid]
  }
}

export const mutations = {
  SET_LANDING_PAGE (state, doc) {
    state.landingPage = doc
  },
  SET_BRAND_ITEM (state, brandData) {
    state.brandItems[brandData.uid] = brandData.doc
  }
}

export const actions = {
  async getLandingPage ({dispatch, getters, commit}) {
    if (getters.landingPage) {
      return getters.landingPage
    } else {
      const landingPage = await this.$prismic.api.getSingle('brand_landing')
      commit('SET_LANDING_PAGE', landingPage)
      return landingPage
    }
  },
  async getBrandItemById ({getters, commit}, uid) {
    if (getters.brandItemById(uid)) {
      return getters.brandItemById(uid)
    } else {
      const brandItemDoc = await this.$prismic.api.getByUID('brand', uid)
      const brandData = {
        uid: uid,
        doc: brandItemDoc
      }
      commit('SET_BRAND_ITEM', brandData)
      return brandItemDoc
    }
  }
}
