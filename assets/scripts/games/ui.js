'use strict'
import store from '../store'
import {determineOutcome, getGameStatistics} from './helpers'
import gameSelectors from './selectors'
import {hideAllContainersExcept, hideAllAlerts} from '../helpers'
import {OUTCOME} from './constants'

const onNewGameSuccess = ({game}) => {
  // clear the "winner" alert
  gameSelectors.gameBoard.resultOverlay.slideUp()

  // clear the screen
  hideAllAlerts()
  hideAllContainersExcept(gameSelectors.gameBoard.container)

  // clear the board of all text
  gameSelectors.gameBoard.cells.text('')

  // highlight the correct turn
  highlightCurrentPlay(store.currentPlay)

  // show the game board if hidden
  !gameSelectors.gameBoard.container.is(':visible') && gameSelectors.gameBoard.container.slideDown()

  // set the current game to the store
  store.currentGame = game
}
const onNewGameFailure = (data) => {
  // TODO update this
}
const onUpdateGameSuccess = ({game}, callback) => {
  // if the game is over
  if (game.over) {
    // its no longer the computers turn
    store.computersTurn = false

    // figure out who the winner is from the response
    const {winner} = determineOutcome(game.cells)
    if (winner === OUTCOME.DRAW) {
      // set the text to be that it was a draw
      gameSelectors.gameBoard.resultOverlay.text('Draw')
    } else {
      // set the text to be who won
      gameSelectors.gameBoard.resultOverlay.text(winner + ' wins!')
    }

    // display the outcome to the user, then hide it so they can see
    // how the other person won or how they won
    gameSelectors.gameBoard.resultOverlay.slideDown().delay(1000).slideUp()

    // turn off the click handlers on the board because the game is over
    gameSelectors.gameBoard.cells.off('click')
  } else {
    // highlight the current play for the user so they know if the next
    // play is an X or an O
    highlightCurrentPlay(store.currentPlay)

    // it cant be the computers turn anymore
    store.computersTurn = false

    // if AI is turned on and the next play is an O,
    // then we execute the computer's play
    if (gameSelectors.gameBoard.computerSwitch.prop('checked') && store.currentPlay === 'O') {
      store.computersTurn = true
      setTimeout(callback, 250)
    }
  }
}

const onUpdateGameFailure = (data) => {
  // TODO update this
}
const onShowStatisticsSuccess = ({games}) => {
  // get the data from the user's games
  const {wins, losses, draws, winPercentage} = getGameStatistics(games)

  // set the text for each of the relevant data pieces
  gameSelectors.gameStatistics.wins.text(wins)
  gameSelectors.gameStatistics.losses.text(losses)
  gameSelectors.gameStatistics.draws.text(draws)
  gameSelectors.gameStatistics.winPercentage.text(winPercentage(1) + '%')

  // clear the screen
  hideAllContainersExcept()

  // show the game stats
  gameSelectors.gameStatistics.container.show()
}
const onShowStatisticsFailure = () => {
  // TODO handle this error
}

// toggles which player is highlighted
// this is used to show who's turn it is
const highlightCurrentPlay = (currentPlay) => {
  const x = $('#player-x-title')
  const o = $('#player-o-title')

  // if current play is x, highlight the X player
  if (currentPlay === 'X') {
    x.addClass('is-active')
    o.removeClass('is-active')

    // if the current play is O, highlight the O player
  } else if (currentPlay === 'O') {
    o.addClass('is-active')
    x.removeClass('is-active')
  }
}
module.exports = {
  onNewGameSuccess,
  onNewGameFailure,
  onUpdateGameSuccess,
  onUpdateGameFailure,
  onShowStatisticsSuccess,
  onShowStatisticsFailure,
  highlightCurrentPlay
}
