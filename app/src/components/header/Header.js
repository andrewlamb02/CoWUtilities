import React, { Component } from 'react';
import { Menu, Image } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import * as globals from '../../globals.js'

class Header extends Component {
  render() {
    return (
        <Menu>
          <NavLink to="/" className='Header-navlink'>
            <Menu.Item>
              <Image className='Header-logo' src='/logo192.png'></Image>
              <b className='Header-title'>CoW Utilities</b>
            </Menu.Item>
          </NavLink>
          { globals.menuLinks.map(link => {
            return (
              <NavLink 
                to={ link.link }
                className='Header-navlink'
                activeClassName='Header-navlink-active'
                key={ link.key }>
                <Menu.Item>
                  { link.body }
                </Menu.Item>
              </NavLink>
            )
          })
          }
        </Menu>
    );
  }
}

export default Header;