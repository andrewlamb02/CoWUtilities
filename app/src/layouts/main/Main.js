import React, { Component } from 'react';
import Header from '../../components/header/Header';
import './Main.css';

class MainLayout extends Component {
    render() {
        const { children } = this.props

        return (
            <div className="MainLayout">
                <Header></Header>
                <div className="MainLayout-content">
                    { children }
                </div>
            </div>
        );
    }
}

export default MainLayout;