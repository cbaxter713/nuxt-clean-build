const dashify = require('dashify');

const SUV = 'suv-small-pickup';
const LIGHTTRUCK = 'lightweight-truck';
const HEAVYTRUCK = 'heavy-duty-truck';
const WEIGHT_LOW_FOR_LIGHTWEIGHT_MATCH = 5000;

const DEFAULT_FILTER_STATE = {
  entry: [],
  travel: [],
  vehicle: [],
  sleeps: [],
  types: []
}

export const state = () => ({
  docs: {},
  qf: Object.assign({},DEFAULT_FILTER_STATE),
  rvs: [],
  navigation: [{url: '/find-my-rv'}],
  tilesFadeOut: false
})

export const getters = {
  docs: (state) => {
    return state.docs;
  },
  docByUID: (state) => (uid) => {
    return state.docs[uid];
  },
  rvs: (state) => {
    return state.rvs;
  },
  isGuideMePath: (state) => {
    return state.qf.entry.length >0 && state.qf.entry[0] == "guided";
  },
  isBrandPath: (state) => {
    return state.qf.entry.length >0 && state.qf.entry[0] == "brand";
  },
  filteredRvs: (state) => {
    const filters = state.qf;
    const filterKeys = Object.keys(state.qf);

    let results = state.rvs.filter(eachObj => {

      const matches = filterKeys.every(eachKey => {
        try {
          if (!filters[eachKey].length) {
            return true;
          }
          switch(eachKey){
            case 'sleeps': {
              const pathValue = filters[eachKey][0];
              const compareValue = Number(pathValue.replace('sleeps-',''));
              // console.log(`sleeps: ${eachObj.sleepsHigh} >= ${pathValue} : ${eachObj.sleepsHigh >= compareValue}`);
              if (/sleeps-[0-9]+/.test(pathValue)) {
                return eachObj.sleepsHigh != -1 && eachObj.sleepsHigh >= compareValue;
              }
              return false;
            }
            case 'vehicle': {
              const pathValue = filters[eachKey][0];
              switch (pathValue){
                case HEAVYTRUCK: {
                  return true;
                }
                case LIGHTTRUCK: {
                  return eachObj.vehiclePath === SUV || eachObj.vehiclePath === LIGHTTRUCK;
                }
                case SUV: {
                  return eachObj.vehiclePath === SUV;
                }
              }
            }
            case 'travel': {

              const pathValue = filters[eachKey][0];
              // console.log(`travel: ${pathValue}`)

              switch (pathValue.trim()){
                case 'tow': {
                  //console.log(`RV is Towable: ${eachObj.towType}`)
                  return eachObj.towType !== null;
                }
                case 'drive': {
                  //console.log(`RV is Driveable: ${eachObj.driveType}`)
                  return eachObj.driveType !== null;
                }
                default:
                  //console.log(`Not Tow or Drive (${pathValue}), returning True`)
                  return true;
              }
            }
            case 'types': {
              const pathValue = filters[eachKey][0];
              // console.log(`Type Filter: ${pathValue} == ${eachObj.typePath} ? ${eachObj.typePath == pathValue.trim()}`);
              // Have to handle rv-types a little different depending on what is selected.
              switch ( pathValue ){
                case 'lightweight-camper': {
                  return eachObj.weightLow == null ? false : eachObj.weightLow <= WEIGHT_LOW_FOR_LIGHTWEIGHT_MATCH;
                }
                case 'toy-hauler': {
                  return eachObj.toyHauler === true;
                }
                case 'horse-trailer': {
                  return eachObj.toyHauler && String(eachObj.toyHauler).toLowerCase() === 'horse';
                }
                default: {
                  return eachObj.typePath == null ? false : eachObj.typePath == pathValue.trim();
                }
              }
            }
            case 'brand': {
              const pathValue = filters[eachKey][0];
              // console.log(`Brand Filter: ${pathValue} == ${eachObj.brandPath} ? ${eachObj.brandPath == pathValue.trim()}`);
              return eachObj.brandPath == null ? false : eachObj.brandPath == pathValue.trim();
            }
            default: {
              if (eachObj[eachKey]){
                // console.log(`${eachObj[eachKey]} includes ${filters[eachKey]} : ${eachObj[eachKey].includes(filters[eachKey][0])}`);
                return eachObj[eachKey].includes(filters[eachKey][0]);
              }
              else {
                if (eachKey !== 'entry'){
                  //console.log(`${eachKey} (${filters[eachKey][0]}) doesn't exist on RV, returning true.`);
                }
                return true;
              }
            }
          }
        }
        catch(e){
          //console.log(e);
          return true;
        }
      });

      //console.log(`${eachObj.brand} ${eachObj.customerName} matches? ${matches}`);
      return matches;
    });

    // They'd like the RVs order randomized for now.
    // A sequence column has been added to the sheets data
    // but is not currently in use.  If they implement this,
    // just need to sort here on sequence instead.
    return shuffleRvs(results);

  },
  filters: (state) => {
    return state.qf;
  },
  navigation: (state) => {
    return state.navigation;
  },
  tilesFadeOut: (state) => {
    return state.tilesFadeOut
  },
  rvTypeSelection: (state) => {
    return state.qf.sleeps.length;
  }
}

export const mutations = {
  SET_DOC (state, data) {
    state.docs[data.uid] = data.doc;
  },
  REMOVE_DOC (state, doc){
    state.docs.delete(doc.uid);
  },
  SET_RVS( state, rvs){
    state.rvs = rvs;
  },
  SET_FILTER( state, {filter, value}){
    if (filter && state.qf[filter]){
      state.qf[filter] = value ? [value] : [];
    }
    else if(filter) {
      state.qf = {...state.qf, filter: value};
    }
  },
  ADD_FILTER( state, {filter, value}){
    if (filter && state.qf[filter]){
      state.qf[filter].push(value);
    }
    else if(filter) {
      state.qf = {...state.qf, filter: [value]};
    }
  },
  UPDATE_FILTERS( state, filters){
    state.qf = filters;
  },
  UPDATE_PATH_NAVIGATION( state, steps){
    state.navigation = steps;
  },
  SET_TILES_FADE_OUT(state, val) {
    state.tilesFadeOut = val
  }
}

export const actions = {
  async getBrandStepByUID ({getters, commit}, uid) {
    const exisitingDoc = getters.docByUID(uid);

    if (exisitingDoc) {
      return exisitingDoc;
    } else {
      const doc = await this.$prismic.api.getByUID('rv_finder_brands', uid);
      const data = {
        uid: uid,
        doc: doc
      }
      commit('SET_DOC', data);
      return doc;
    }
  },
  async getStepByUID ({getters, commit}, uid) {
    const exisitingDoc = getters.docByUID(uid);

    if (exisitingDoc) {
      return exisitingDoc;
    } else {
      const doc = await this.$prismic.api.getByUID('rv_page', uid);
      const data = {
        uid: uid,
        doc: doc
      }
      commit('SET_DOC', data);
      return doc;
    }
  },
  async getRvs ({getters, commit}) {

    const rvs = getters.rvs;

    // TODO Prismic Integration Fallback
    // If we decide that the integration fields are problematic, to keep the finder running, I have
    // exported the JSON that would get generated here in to /static/rv-data.json.  Instead of
    // calling prismic, all we have to do is set rvs = load this file.

    if (rvs && rvs.length) {
      return rvs;
    } else {
      const document = await this.$prismic.api.getByUID('rv_finder','rv-data');
      const objRvs = [];

      document.data.rvs.forEach(o => {
        const rv = o.rv;
        cleanRvData(rv);
        convertImage(rv, o.image, rv.image);
        setRvPaths(rv);
        objRvs.push(rv);
      });

      commit('SET_RVS', objRvs);
      return objRvs;
    }
  },
  async getRvsByList ({getters, commit, dispatch}, refidList) {
    let rvs = await dispatch('getRvs')
    if (rvs && refidList && rvs.length) {

      return rvs.filter(rv => refidList.includes(rv.referenceid));
    } else {
      return [];
    }
  },
  setFilter({commit}, filter, value){
    commit('SET_FILTER', filter, value);
  },
  addFilter({commit}, filter, value){
    commit('ADD_FILTER', filter, value);
  },
  parseRoute({commit, getters}, route){
    try {
      // Update the step navigation based on the current route.
      const steps = generateStepNavigation(route);
      commit('UPDATE_PATH_NAVIGATION', steps);
    }
    catch(e){
      console.error('failed to update the finder step navigation', e);
    }

    const filters = Object.assign({},DEFAULT_FILTER_STATE);

    // some elements are hard coded paths (not dynamic)
    // /find-my-rv/guided/tow/suv-small-pickup/sleeps-6
    let paths = route.path.substring(1).split('/');
    if (paths[0] === 'find-my-rv'){
      if (paths.length > 1 && paths[1] === 'guided'){
        filters.entry = ['guided'];
      }
      else if (paths.length > 1 && paths[1] === 'brand'){
        filters.entry = ['brand'];
      }
      if (paths.length > 2 && /drive|tow/.test(paths[2])){
        filters.travel = [paths[2]];
      }
    }

    for (const filter in route.params) {
      const value = route.params[filter];
      filters[filter] = [value];
    }
    commit('UPDATE_FILTERS', filters);
  },
  toggleTiles({getters, commit}) {
    commit('SET_TILES_FADE_OUT', true);
    setTimeout(() => {
      commit('SET_TILES_FADE_OUT', false)
    },500);
  }
}

const DRIVE_TOOLTIPS = ['start over','tow or drive','sleeps','select class'];
const TOW_TOOLTIPS = ['start over','tow or drive','vehicle size','sleeps','camper type'];
const BRAND_TOOLTIPS = ['start over']




/**
 * This method is called every time a step is loaded through
 * the RV Finder.  It takes the current route and turns it back
 * in to an Array of link objects to be used like a breadcrumb
 * @param {VueRoute} route
 */
const generateStepNavigation = (route)=> {
  const steps = [];
  let paths = route.path.substring(1).split('/');
  let toolTips = [];

  if (paths[0] === 'find-my-rv'){

    steps.push({ url: generateUrl(paths,1), enabled: true });

    if (paths.length > 1) {
      steps.push({ url: generateUrl(paths,2), enabled: true });
      toolTips = BRAND_TOOLTIPS;
    }

    if(paths.length >= 2 && paths[1] !== 'brand'){

      let totalPaths = 4;
      if (paths.length > 2) {
        steps.push({ url: generateUrl(paths,3), enabled: true });
        if (paths[2] === 'tow') {
          totalPaths = 5;
          toolTips = TOW_TOOLTIPS;
        }
        else {
          toolTips = DRIVE_TOOLTIPS;
        }
      }

      for ( let i = 3; paths.length > 2 && i < totalPaths; i++){
        if ( paths.length > i ){
          steps.push({ url: generateUrl(paths, i + 1), enabled: true });
        }
        else {
          steps.push({ url: '', enabled: false });
        }
      }

    }

  }
  steps.forEach((s, index) => {
    s.active = s.url === route.path;
    if(toolTips.length > index){
      s.toolTip = toolTips[index];
    }
  });

  if(steps.filter(s => s.active).length == 0){
    steps[steps.length-1].active = true;
  }

  return steps;
}

/**
 * Pass in the array, and how many elements you want
 * and it will return a URL format from those items.
 * @param {Array} parts
 * @param {Number} count
 */
const generateUrl = (parts, count) => {
  return '/' + parts.slice(0, count).join('/');
}

/**
 * Sets the Peer level image from the RV Data list in
 * prismic on the RV object itself.  If it doesn't have
 * an image defined, a default is used from fpo
 * @param {RvObject} rv
 * @param {ImageObject} image
 * @param {ImageObject} fallback
 */
const convertImage = (rv, image, fallback) => {
  const imageObject = {
    url:fallback,
    width:300,
    height:200
  }
  if(image && image.url){
    imageObject.url = image.url;
    imageObject.width = parseInt(image.width);
    imageObject.height = parseInt(image.height);
  }
  rv.image = imageObject;
}

/**
 * When RV's are first loaded from Prismic,
 * We set the path values on the object from
 * their visible data, that can be used to
 * match documents in the finder filtering
 * @param {RvObject} rv
 */
const setRvPaths = (rv) => {
  rv.modelNamePath = dashify(rv.modelName, {condense: true});
  rv.brandPath = dashify(rv.brand, {condense: true});
  if (rv.towType != null && rv.towType.length){
    rv.typePath = dashify(rv.towType, {condense: true});
    if(rv.weightLow != null){
      if(rv.weightLow <= 4500){
        rv.vehiclePath = SUV;
      }
      else if(rv.weightLow <= 10000){
        rv.vehiclePath = LIGHTTRUCK;
      }
      else if(rv.weightLow <= 20000){
        rv.vehiclePath = HEAVYTRUCK;
      }
    }
  }
  else if (rv.driveType != null && rv.driveType.length) {
    rv.typePath = dashify(rv.driveType, {condense: true});
  }
  rv.sleepsPath = dashify(`sleeps ${rv.sleepsHigh}`, {condense: true});
}

/**
 * Any RV data cleansing should happen in this method
 * This is called as RV's are loaded from Prismic and
 * before they are added to the store.  If you want to
 * convert Strings to Numbers in the data, etc, that
 * can happen here.
 * @param {RvObject} rv
 */
const cleanRvData = (rv) => {
  rv.lengthLow = rv.lengthLow === -1 ? '' : rv.lengthLow;
  rv.lengthHigh = rv.lengthHigh === -1 ? '' : rv.lengthHigh;
}


const shuffleRvs = (items) => {
  let ctr = items.length;
  let temp, index;
  while (ctr > 0) {
      index = Math.floor(Math.random() * ctr);
      ctr--;
      temp = items[ctr];
      items[ctr] = items[index];
      items[index] = temp;
  }
  return items;
}