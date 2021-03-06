// ##### Campus Search Component ##### //

import React from 'react'
import FormComp from '../components/FormComp.jsx'

class CampusSearchComp extends React.Component {
  render() {
    return (
    <FormComp to="/search" method="GET">
      <div className="c-campussearch">
        <label htmlFor="c-campussearch__search" className="c-campussearch__label">Discover {this.props.campusName} scholarship</label>
        <div className="c-campussearch__search">
          <input type="search" name="q" className="c-campussearch__input" id="c-campussearch__search"/>
          <input type="hidden" name="searchUnitType" value="campuses" />
          <input type="hidden" name="searchType" value={this.props.campusID} />
          <button type="submit" className="c-campussearch__button" aria-label="Search"></button>
        </div>
      </div>
    </FormComp>
    )
  }
}

module.exports = CampusSearchComp;
