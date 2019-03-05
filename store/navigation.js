import {breakpoints} from "../plugins/mediaQueries";


export const state = () => ({
  headerLinks: null,
  footerLinks: null,
  navActive: false,
  activeNavIndex: null,
  activeNavIndexTransition: null
})

export const getters = {
  headerLinks: state => {
    return state.headerLinks
  },
  footerLinks: state => {
    return state.footerLinks
  },
  navActive: state => {
    return state.navActive
  },
  activeNavIndex: state => {
    return state.activeNavIndex
  },
  activeNavIndexTransition: state => {
    return state.activeNavIndexTransition
  }
}


export const mutations = {
  SET_HEADER_LINKS(state, obj) {
    state.headerLinks = obj
  },
  SET_FOOTER_LINKS(state, obj) {
    state.footerLinks = obj
  },
  SET_NAV_ACTIVE(state, val) {
    state.navActive = val
  },
  SET_ACTIVE_NAV_INDEX(state, val) {
    state.activeNavIndex = val
  },
  SET_ACTIVE_NAV_INDEX_TRANSITION(state, val) {
    state.activeNavIndexTransition = val
  }
}


export const actions = {
  async getMainNav({getters, commit}) {
    if (getters.headerLinks) {
      return getters.headerLinks
    } else {
      const navData = await this.$prismic.api.getByUID('nav_menu', 'main-nav');
      commit('SET_HEADER_LINKS', navData)
      return navData
    }
  },
  async getFooterNav({getters, commit}) {
    if (getters.footerLinks) {
      return getters.footerLinks
    } else {
      const navData = await this.$prismic.api.getByUID('footer_content', 'footer');
      commit('SET_FOOTER_LINKS', navData)
      return navData
    }
  },
  async getFullDecoratorNav({dispatch}) {
    const headerNavData = await dispatch('getMainNav');
    const footerNavData = await dispatch('getFooterNav');

    return {
      headerNav: headerNavData,
      footerNav: footerNavData
    }
  },

  /* This is triggered when the top nav is clicked at desktop
  or the top nav items are clicked at  mobile
   */
  activateNav({getters, commit, dispatch}, index) {
    if (getters.activeNavIndex === index) {
      // close the navigation
      if(window.outerWidth >= breakpoints.sm) {
        dispatch('deactivateNav');
      } else {
        commit('SET_ACTIVE_NAV_INDEX_TRANSITION', null);
        setTimeout(() => {
          commit('SET_ACTIVE_NAV_INDEX', null);
        }, 10);
      }

    } else {
      commit('SET_NAV_ACTIVE', true);
      commit('SET_ACTIVE_NAV_INDEX', index);
      setTimeout(() => {
        commit('SET_ACTIVE_NAV_INDEX_TRANSITION', index);
      }, 10);
    }

  },

  /*
  This is used when the mobile hamburger nav is clicked
  Opens and closes the bg and shows the top level nav
   */

  toggleMobileNav({getters, commit, dispatch}) {
    if (getters.navActive) {
      dispatch('deactivateNav');

    } else  {
      commit('SET_NAV_ACTIVE', true);
    }
  },

  responsiveSubnav() {},

  /*
  this can be used all over the place to completely close the nav
  this includes clicking links that go to pages in the navigation
  as well as the masthead logo.
   */

  deactivateNav({commit}) {
    commit('SET_NAV_ACTIVE', false);
    commit('SET_ACTIVE_NAV_INDEX_TRANSITION', null);
    setTimeout(() => {
      commit('SET_ACTIVE_NAV_INDEX', null);
    }, 300);

  }
}
