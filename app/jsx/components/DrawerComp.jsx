import React from 'react'
import { Subscriber } from 'react-broadcast'
import { Link } from 'react-router'
import _ from 'lodash'

class DrawerItem extends React.Component {
  state = {editing: false, type:
    this.props.navItem.slug ? 'page' :
    this.props.navItem.url ? 'url' :
    this.props.navItem.file ? 'file' :
    this.props.navItem.sub_nav ? 'sub_nav' :
    undefined
  }

  getNavItemJSX(navItem) {
    var link;
    if ('url' in navItem) {
      return navItem.url.startsWith("http")
        ? <a href={navItem.url} key={navItem.name}>{navItem.name}</a>
        : <Link to={navItem.url} key={navItem.name}>{navItem.name}</Link>
    }
    return undefined
  }

// radio buttons replaced by <select>
          // <label className="c-drawer__list-item-radio-input">
          //   <input id="navItemType" type="radio"
          //     name='navItemType' value="Page" onChange={e => console.log(e)} checked={this.state.type === 'page' ? true : false}/>
          //   Page
          // </label>
          // <label className="c-drawer__list-item-radio-input">
          //   <input id="navItemType" type="radio"
          //     name='navItemType' value="URL" onChange={e => console.log(e)} checked={this.state.type === 'url' ? true: false}/>
          //   URL
          // </label>
          // <label className="c-drawer__list-item-radio-input">
          //   <input id="navItemType" type="radio"
          //     name='navItemType' value="File" onChange={e => console.log(e)} checked={this.state.type === 'file' ? true: false}/>
          //   File
          // </label><br/>


  render() {
    if ('sub_nav' in this.props.navItem) {
      return (
        <div className="c-drawer__list-item-subnav">
          <div className="c-drawer__list-item-subnav-header">
            {this.props.navItem.name}
          </div>
        </div>
      )
    } else {
      return (
        <div className="c-drawer__list-item">
          {this.getNavItemJSX(this.props.navItem)}
        </div>
      )
    }
  }
}

class ListItem extends React.Component {
  static displayName = 'SortableListItem';

  render() {
    return (
      <div {...this.props} className={this.props.className}>{this.props.children}</div>
    )
  }
}

var SortableListItem = null;

class SortableList extends React.Component {
  state = this.setupState(this.props)

  setupState(props) {
    return {draggingIndex: null, data: props.data, lastPos: null}
  }

  // This gets called when props change by switching to a new page.
  // It is *not* called on first-time construction.
  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps))
      this.setState(this.setupState(nextProps))
  }

  updateState = (obj) => {
    if (obj.draggingIndex === null) {
      console.log('dropped: ')
      console.log(JSON.stringify(this.state.data));
      console.log(obj);
    } else {
      this.setState({draggingIndex: obj.draggingIndex, lastPos: obj.data});
      console.log('moving:')
      console.log(JSON.stringify(this.state.data));
    }
    // this.setState(obj);
  }

  render() {
    var listItems = this.state.data.map((item, i) => {
      return (
        <SortableListItem
            key={i}
            updateState={this.updateState}
            items={this.state.data}
            draggingIndex={this.state.draggingIndex}
            sortId={i}
            outline="list">
          <DrawerItem navItem={item} unit={this.props.unit}/>
        </SortableListItem>
      );
    });

    return (
      <div className="list">{listItems}</div>
    )
  }

}

class AddWidgetMenu extends React.Component {
  state = { isOpen: false }
  render() {
    return (
      <div className="c-drawer__nav-buttons" >
        <details className="c-widgetselector__selector" open={this.state.isOpen} ref={el=>this.detailsEl=el}>
          <summary aria-label="select widget type"
                   onClick={e=>setTimeout(()=>this.setState({isOpen: this.detailsEl.open}), 0)}/>
          <div className="c-widgetselector__menu">
            <div className="c-widgetselector__sub-heading" id="c-widgetselector__sub-heading">{this.props.title}</div>
            <div className="c-widgetselector__items" aria-labelledby="c-widgetselector__sub-heading" role="list"
              onClick={e=>this.setState({isOpen: false})}>
              {this.props.children}
            </div>
          </div>
        </details>
      </div>
    )
  }
}

class DrawerComp extends React.Component {
  state = this.setupState(this.props)

  setupState(props) {
    return {
      navList: 'header' in props.data && 'nav_bar' in props.data.header ? props.data.header.nav_bar : undefined,
      sidebarList: props.data.sidebar
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps))
      this.setState(this.setupState(nextProps))
  }

  onSetSideBarOpen(open) {
    this.setState({sidebarOpen: open});
  }

  addNavItem = (event, cms, navType) => {
    event.preventDefault()
    this.setState({working: true})
    $.getJSON({ type: 'POST', url: `/api/unit/${this.props.data.unit.id}/nav`,
             data: { username: cms.username, token: cms.token, navType: navType }})
    .done(data=>{
      this.setState({working: false})
      this.props.router.push(`/uc/${this.props.data.unit.id}/${data.slug}`)
    })
    .fail(()=>{
      this.setState({working: false})
      alert("Error adding item.")
    })
  }

  addSidebarItem = () => {
    var curList = _.clone(this.state.sidebarList);
    curList.push({id: "new", title: "New widget"});
    this.setState({sidebarList: curList});
  }

  addFolder = () => {
    console.log('add folder!');
  }

  drawerContent(cms) {
    if (!SortableListItem)
      SortableListItem = cms.modules.sortable(ListItem)
    return (
      <div>
        <div className="c-drawer__list-item" style={{backgroundImage: 'none', paddingLeft: '20px'}}>
          <Link key="profile" to={"/uc/" + this.props.data.unit.id + "/profile" }>
            {
              (this.props.data.unit.type === 'journal' && 'Journal Profile') ||
              (this.props.data.unit.type === 'series' && 'Series Profile') ||
              (this.props.data.unit.type === 'campus' && 'Campus Profile') ||
              (this.props.data.unit.type && 'Unit Profile')
            }
          </Link>
        </div>

        <div className="c-drawer__heading">
          Navigation Items
          <AddWidgetMenu title="Add Nav Item">
            <a href="" key="page"   onClick={e=>this.addNavItem(e, cms, 'page')  }>Page</a>
            <a href="" key="url"    onClick={e=>this.addNavItem(e, cms, 'link')  }>Link</a>
            <a href="" key="file"   onClick={e=>this.addNavItem(e, cms, 'file')  }>File</a>
            <a href="" key="folder" onClick={e=>this.addNavItem(e, cms, 'folder')}>Folder</a>
          </AddWidgetMenu>
        </div>
        <SortableList data={this.state.navList} unit={this.props.data.unit}/>

        <div className="c-drawer__heading">
          Sidebar Widgets
          <div className="c-drawer__nav-buttons">
            <button onClick={this.addSidebarItem}><img src="/images/white/plus.svg"/></button>
          </div>
        </div>
        { this.state.sidebarList.map( sb =>
            <div key={sb.id} className="c-drawer__list-item">
              <Link to={"/uc/" + this.props.data.unit.id + "/sidebar#" + sb.id }>
                {sb.title ? sb.title : sb.kind.replace(/([a-z])([A-Z][a-z])/g, "$1 $2")}
              </Link>
            </div>
          )
        }
      </div>
    )
  }

  render = ()=>
    <Subscriber channel="cms">
      { cms =>
        <div>
            {(this.state.working || this.props.fetchingData) && <div className="c-drawer__working-overlay"/>}
            <cms.modules.Sidebar sidebar={this.state.navList ? this.drawerContent(cms) : <div/>}
                     open={cms.isEditingPage}
                     docked={cms.isEditingPage}
                     onSetOpen={this.onSetSidebarOpen}
                     sidebarClassName="c-drawer">
              {this.props.children}
            </cms.modules.Sidebar>
        </div>
      }
    </Subscriber>
}

module.exports = DrawerComp;
