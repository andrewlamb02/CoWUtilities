import React, { Component } from 'react';

class DefaultLayout extends Component {
    render() {
        const { children } = this.props

        return (
            <main className='DefaultLayout'>{ children }</main>
        );
    }
}

export default DefaultLayout;