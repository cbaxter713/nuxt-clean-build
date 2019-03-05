export const state = () => ({
  contactDoc: null
})

export const getters = {
  contactDoc: state => {
    return state.contactDoc
  }
}

export const mutations = {
  SET_CONTACT_DOC(state, doc) {
    state.contactDoc = doc
  }
}

export const actions = {
  async getContact({getters, commit}) {
    if (getters.contactDoc) {
      return getters.contactDoc
    } else {
      const contactDoc = await this.$prismic.api.getSingle('contact', {
        fetchLinks: [
          'brand.title',
          'brand.street_address',
          'brand.po_box',
          'brand.city_state_zip',
          'brand.phone',
          'brand.toll_free_phone',
          'brand.fax',
          'brand.email',
          'brand.url',
          'brand.brand_logo_thumbnail'
        ]
      })
      commit('SET_CONTACT_DOC', contactDoc)
      return contactDoc
    }
  }
}
