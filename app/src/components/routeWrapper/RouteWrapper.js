import React, { Component } from 'react';
import { Route } from 'react-router-dom';

class RouteWrapper extends Component {
    render() {
        const {
            component: Component, 
            layout: Layout
        } = this.props

        const rest = {};
        for (const key of Object.keys(this.props)) {
            if (!["component", "layout"].includes(key)) {
                rest[key] = this.props[key];
            }
        }

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