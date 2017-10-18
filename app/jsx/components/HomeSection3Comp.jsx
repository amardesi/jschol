// ##### Home Section 3 Component ##### //

import React from 'react'
import JournalGridComp from '../components/JournalGridComp.jsx'
import { Link } from 'react-router'

class HomeSection3Comp extends React.Component {
  render() {
    return (
      <div id="publishing" className="c-homesection__3">
        <div className="c-homesection__3-description">
          <h3>eScholarship Publishing</h3>
          <p>eScholarship Publishing is an open access publishing platform subsidized by the University of California, managed by the California Digital Library, and offered free of charge to UC-affiliated departments, research units, publishing programs and individual scholars.</p>
          <p>We offer publishing and production tools, including a full editorial and peer review system, as well as professional support and consulting services.</p>
        </div>
        <div className="c-homesection__3-journalgrid">
          <JournalGridComp />
        </div>
        <Link to="/journals" className="c-homesection__3-browse-all">Browse all eScholarship journals</Link>
        <a href="https://help.escholarship.org/support/solutions/articles/9000127857-starting-a-new-journal-on-escholarship" className="c-homesection__3-start">How to start a journal</a>
      </div>
    )
  }
}

module.exports = HomeSection3Comp;