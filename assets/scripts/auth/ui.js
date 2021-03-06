'use strict'

import store from '../store'
import authSelectors from './selectors'
import menuSelectors from '../menu/selectors'
import { hideAllContainersExcept, hideAllAlerts } from '../helpers'
import { showAlert, showTemporaryAlert } from '../animations'
import { onNewGame } from '../games/events'
import { hideFormLoader } from './helpers'
import gameSelectors from '../games/selectors'
import api from './api'

const signUpSuccess = (data) => {
  // clear any alerts
  hideAllAlerts()

  // hide the loader and show the button again
  hideFormLoader(authSelectors.signUp)

  // get the credentials the user entered when signing up
  // so we can sign the user in automatically
  const credentials = {
    email: authSelectors.signUp.email.val(),
    password: authSelectors.signUp.password.val()
  }
  // sign user in and handle success/fail
  api.signIn({credentials}).then(signInSuccess).catch(signInFailure)

  // hide the sign up form since we know that worked now
  authSelectors.signUp.container.hide()

  // clear/reset the sign in form in case the user gets back there somehow
  authSelectors.signUp.email.val('')
  authSelectors.signUp.password.val('')
  authSelectors.signUp.passwordConfirmation.val('')
  authSelectors.signUp.email.parent('div').toggleClass('is-dirty')
  authSelectors.signUp.password.parent('div').toggleClass('is-dirty')
  authSelectors.signUp.passwordConfirmation.parent('div').toggleClass('is-dirty')
}
const signUpFailure = () => {
  // clear alerts (like success alerts)
  hideAllAlerts()

  // hide the form loader and show the button
  hideFormLoader(authSelectors.signUp)

  // let the user know the sign up failed
  showAlert(authSelectors.alerts.signUpFailure)
}
const signInSuccess = ({user}) => {
  // clear the alerts
  hideAllAlerts()

  // clear containers
  hideAllContainersExcept()

  // hide the loader and put the button back for if the user signs out again
  hideFormLoader(authSelectors.signIn)

  // show the user's email in the header
  menuSelectors.menu.email.text(user.email)

  // show the header now that the user is signed in
  menuSelectors.menu.container.slideDown('fast')

  // clear/reset the sign in form in case the user gets back there somehow
  authSelectors.signIn.email.val('')
  authSelectors.signIn.password.val('')
  authSelectors.signIn.email.parent('div').toggleClass('is-dirty')
  authSelectors.signIn.password.parent('div').toggleClass('is-dirty')

  // put the user info in the store
  store.user = user

  // start a new game, navigation is handled in that function
  onNewGame()
}
const signInFailure = () => {
  // make sure sign in is shown, just in case the user came from sign up
  authSelectors.signIn.container.show()

  // hide the loader and put the button back after we know it failed
  hideFormLoader(authSelectors.signIn)

  // show a message to the user that sign in didnt work
  showAlert(authSelectors.alerts.signInFailure)
}
const signOutSuccess = () => {
  // clear the screen
  hideAllContainersExcept()

  // hide the result of the last game in case someone else signs in
  gameSelectors.gameBoard.resultOverlay.hide()

  // hide the navbar because the user is logged out
  menuSelectors.menu.container.hide()

  // show the header message since the navbar is now hidden
  $('.main-header').show()

  // show the sign in container because thats all they can do
  authSelectors.signIn.container.show()

  // let the user know that they are signed out
  showTemporaryAlert(authSelectors.alerts.signOutSuccess)

  // clear out the store so another user can sign in
  store.user = null
}
const signOutFailure = () => {
  // TODO hook this up to an alert message
}
const changePasswordSuccess = (data) => {
  // TODO navigate somwehere?

  // hide form loader and show button
  hideFormLoader(authSelectors.changePassword)

  // let the user know the password was changed
  showAlert(authSelectors.alerts.changePasswordSuccess)
}
const changePasswordFailure = () => {
  // hide form loader and show button
  hideFormLoader(authSelectors.changePassword)

  // let the user know the password was not changed
  showAlert(authSelectors.alerts.changePasswordFailure)
}
module.exports = {
  signUpSuccess,
  signUpFailure,
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure,
  changePasswordSuccess,
  changePasswordFailure
}
