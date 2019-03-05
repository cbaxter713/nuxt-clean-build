export const state = () => ({
  input: {
    amount: null,
    down: null,
    term: null,
    rate: null
  }
})

export const getters = {
  inputValues: state => {
    return state.input;
  },
  paymentDetails: state => {
    return calculate(state.input);
  }
}

export const mutations = {
  SET_INPUT_VALUES (state, input) {
    state.input = input;
  }
}

export const actions = {
  getInputValues ({getters}) {
    return getters.inputValues;
  },
  setInputValues ({commit}, input) {
    commit('SET_INPUT_VALUES', input);
  },
  // Expects an input object that contains rate, term, amount.  Commits
  // the values to the store but not the passed in object.
  formCalculatePayment ({commit}, input) {
    commit('SET_INPUT_VALUES', Object.assign({},input));
    return calculate(input);
  },
  calculateRvPayment ({getters}, amount) {
    const clonedInput = Object.assign({},getters.inputValues);
    clonedInput.amount = amount;
    return calculate(clonedInput);
  }
}

const calculate = (vals) => {

  let response =  Object.assign({
    success: true,
    payment: 0,
    totalPayments:  0,
    totalInterest: 0
  }, vals);

  try {
    if (response.amount - response.down <= 0) {
      response.success = false;
      return response;
    }
    var x = Math.pow( 1 + (response.rate / 100 / 12), response.term );
    var monthly = ( (response.amount - response.down) * x * (response.rate / 100 / 12) )/( x-1 );
    if (!isNaN(monthly) &&
        (monthly != Number.POSITIVE_INFINITY) &&
        (monthly != Number.NEGATIVE_INFINITY)) {
          response.payment = monthly.toFixed(2);
          response.totalPayments = (monthly * response.term).toFixed(2);
          response.totalInterest = ((monthly * response.term) - (response.amount - response.down)).toFixed(2);
    }
  }
  catch(e){
    response.success = false;
  }
  return response;
}
