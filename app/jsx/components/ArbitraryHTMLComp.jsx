import React from 'react'
import PropTypes from 'prop-types'

/**
 * Adds arbitrary HTML to the page (usually supplied earlier by the user and stored in the database).
 * Re-maps <h1>, <h2> etc in the HTML to the specified level to improve accessibility.
 */
export default class ArbitraryHTMLComp extends React.Component
{
  static propTypes = {
    html: PropTypes.string.isRequired,
    h1Level: PropTypes.number // defaults to 3
  }

  // Attach script necessary for opening Deposit Wizard from any links defined as: http://open-deposit-wizard.com
  componentWillMount() {
    if (!(typeof document === "undefined")) {
      const s = document.createElement("script")
      s.async = true
      s.innerHTML = "function openDepositWiz(event) {event.preventDefault(); document.getElementById(\'wizardlyDeposit\').click();}";
      document.body.appendChild(s)
    }
  }

  render() {
    let origText = this.props.html
    let h1Level = this.props.h1Level ? this.props.h1Level : 3
    let fixedText = origText.replace(/(<\/?[hH])([1-9]+)/g, 
                      (m, p1, p2) => p1 + (parseInt(p2) + h1Level - 1))
    // Kludge for opening deposit wizard modal 
    let fixedText2 = fixedText.replace(/<a href=\"http:\/\/open-deposit-wizard\.com\">/g, 
      '<a href="" onClick="openDepositWiz(event);">')
    return <div dangerouslySetInnerHTML={{__html: fixedText2}}/>
  }
}
