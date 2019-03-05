export const state = () => ({
  newsLandingPage: null,
  newsItems: {}
})

export const getters = {
  newsLandingPage: state => {
    return state.newsLandingPage
  },
  newsItems: state => {
    return state.newsItems
  },
  newsItemById: (state) => (uid) => {
    return state.newsItems[uid]
  }
}

export const mutations = {
  SET_NEWS_LANDING_PAGE(state, doc) {
    state.newsLandingPage = doc
  },
  SET_NEWS_ITEM(state, newsData) {
    state.newsItems[newsData.uid] = newsData.doc
  }
}

export const actions = {
  async getNewsLandingPage({dispatch, getters, commit}) {
    if (getters.newsLandingPage) {
      return getters.newsLandingPage
    } else {
      const newsLandingPage = await this.$prismic.api.getSingle('news_landing',
        {
          fetchLinks: [
            'news.title',
            'news.date',
            'news.hero_image',
            'news.summary',
            'news.content'
          ]
        }
      )
      commit('SET_NEWS_LANDING_PAGE', newsLandingPage)
      return newsLandingPage
    }
  },
  async getNewsItemById({getters, commit}, uid) {
    if (getters.newsItemById(uid)) {
      return getters.newsItemById(uid)
    } else {
      const newsItemDoc = await this.$prismic.api.getByUID('news', uid);
      const newsData = {
        uid: uid,
        doc: newsItemDoc
      }
      commit('SET_NEWS_ITEM', newsData)
      return newsItemDoc
    }
  }
}
