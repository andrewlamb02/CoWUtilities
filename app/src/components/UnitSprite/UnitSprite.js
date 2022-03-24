import React, { Component } from 'react';
import './UnitSprite.css';
import sprites from '../../resources/sprites';

class UnitSprite extends Component {
    constructor(props) {
        super(props);

        let animationInterval = setInterval(() => {
            this.setState({
                animationTimer: this.state.animationTimer ? 0 : 1
            })
        }, 500)

        this.state = {
            animationTimer: 0,
            animationInterval
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.animationInterval)
    }

    render() {
        const { unitType, animated, color } = this.props;
        const { animationTimer } = this.state;

        let image = sprites.units(unitType);
        if (animated && animationTimer) {
            image = sprites.units(`${unitType}Anim`) || image;
        }
        return image ? <img alt={unitType} src={image} className="UnitCard-unit-sprite" style={ { backgroundColor: color } } /> : unitType;
    }
}

export default UnitSprite;