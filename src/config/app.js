const dev = {
  signupAllowed: true
}

const production = {
  signupAllowed: false
}

export default (process.env.REACT_APP_ENV !== 'production' ? dev : production)
