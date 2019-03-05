import Vue from 'vue'
import VueMq from 'vue-mq'

export const breakpoints = {
  xs: 540,
  sm: 800,
  md: 1050,
  lg: 1280,
  xl: 1600,
  xxl: Infinity
};

export const breakpointArray = Object.keys(breakpoints);

export function getBreakpointByName(name) {
  const nameIndex = breakpointArray.indexOf(name);
  return breakpoints[name] === Infinity ? breakpoints[breakpointArray[nameIndex - 1]] : breakpoints[name]
}

Vue.use(VueMq, {
  breakpoints
})
