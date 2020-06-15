import React, { Component } from 'react';
import { Route } from 'react-router-dom';

class RouteWrapper extends Component {
    render() {
        const {
            component: Component, 
            layout: Layout, 
            ...rest
        } = this.props

        return (
            <Route {...rest} render={(props) =>
              <Layout {...props}>
                <Component {...props} />
              </Layout>
            } />
          );
    }
}

export default RouteWrapper;