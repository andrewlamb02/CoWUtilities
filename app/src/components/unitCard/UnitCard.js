import React, { Component, Fragment } from 'react';
import { Card, Icon, GridColumn, Grid, Popup, Progress, Table } from 'semantic-ui-react';
import './UnitCard.css';
import * as globals from '../../globals';
import UnitSprite from '../UnitSprite/UnitSprite';

class UnitCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: true
        }
    }

    collapse = () => {
        const { collapsed } = this.state;

        this.setState({
            collapsed: !collapsed
        })
    }

    canUpgrade = (attribute) => {
        const { unit } = this.props;

        if (!unit.pathHome) {
            return false;
        }

        if (attribute === "skill" && unit[attribute] === 6) {
            return false;
        }

        if (attribute === "ap" && unit[attribute] === 10) {
            return false;
        }

        return unit[attribute] < (3 * (globals.unitTypes.find(type => type.name === unit.type) || {})[attribute]);
    }

    render() {
        const {
            unit,
            selected,
            onClick,
            clearMoves,
            upgradeUnit,
            preview,
            showSprites,
            factionColor,
            setImpulse,
            currentImpulse
        } = this.props;
        const { collapsed } = this.state;

        let sprite = false;

        if (showSprites) {
            sprite = <UnitSprite unitType={unit.type} className="UnitCard-unit-sprite" animated={selected} color={factionColor} />
        }

        let remainingAp = unit.moves.reduce((t, m) => t -= m === "." ? 0 : 1, unit.ap) + (unit.upgraded.find(u => u === 'ap') ? 1 : 0);

        let body = (<Fragment>
        <Card.Content>
            <Card.Header className="UnitCard-header">
                {sprite}
                {unit.name}
                <Popup content='Collapse' trigger={<Icon name='chevron down' onClick={ this.collapse } />} />
            </Card.Header>
            <Card.Meta>
                <span className='date'>{unit.type}</span>
            </Card.Meta>
            <Card.Description>
                { unit.location === "Limbo" ? unit.location : `x: ${unit.location.x} y: ${unit.location.y}` }
            </Card.Description>
        </Card.Content>
        <Card.Content>
            <Grid columns={4}>
                <GridColumn>
                    <Popup content='Health/Max Health' trigger={<Icon name='tint' />} />
                    {unit.health}/{unit.maxHealth}
                </GridColumn>
                <GridColumn>
                    <Popup 
                        content='Power'
                        trigger={<Icon 
                                    name='gavel'
                                    color={ unit.upgraded.find(u => u === 'power') ? "blue" : this.canUpgrade('power') ? "green" : "black" }
                                    onClick={() => { if (this.canUpgrade('power')) upgradeUnit(unit, 'power') }}/>
                        } />
                    {unit.power + (unit.upgraded.find(u => u === 'power') ? 1 : 0) }
                </GridColumn>
                <GridColumn>
                    <Popup
                        content='Skill'
                        onClick={() => { if (this.canUpgrade('skill')) upgradeUnit(unit, 'skill') }}
                        trigger={<Icon 
                                    name='balance scale'
                                    onClick={() => { if (this.canUpgrade('skill')) upgradeUnit(unit, 'skill') }}
                                    color={ unit.upgraded.find(u => u === 'skill') ? "blue" : this.canUpgrade('skill') ? "green" : "black" }/>
                        } />
                    {unit.skill + (unit.upgraded.find(u => u === 'skill') ? 1 : 0) }
                </GridColumn>
                <GridColumn>
                    <Popup
                        content='AP'
                        onClick={() => { if (this.canUpgrade('ap')) upgradeUnit(unit, 'ap') }}
                        trigger={<Icon 
                                    name='shipping fast'
                                    onClick={() => { if (this.canUpgrade('ap')) upgradeUnit(unit, 'ap') }}
                                    color={ unit.upgraded.find(u => u === 'ap') ? "blue" : this.canUpgrade('ap') ? "green" : "black" }/>
                        } />
                    {unit.ap + (unit.upgraded.find(u => u === 'ap') ? 1 : 0) }
                </GridColumn>
            </Grid>
        </Card.Content>
        <Card.Content className="UnitCard-content-move">
            <Table compact="very" size="small" celled>
                <Table.Body>
                    <Table.Row>
                        { unit.moves.map((move, index) => {
                            return <Table.Cell 
                                    key={index}
                                    onClick={() => setImpulse(index+1)}
                                    className={`UnitCard-move-cell ${currentImpulse === index + 1 ? "UnitCard-selected" : ""}`}>
                                    {move}
                                </Table.Cell>
                        }) }
                        <Table.Cell className="UnitCard-move-cell" onClick={() => clearMoves(unit) }>
                            <Icon name="eraser"/>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </Card.Content>
        </Fragment>)

        if (collapsed) {
            body = (<Card.Content>
                        <Card.Header className="UnitCard-header">
                            {sprite}
                            {unit.name}
                            <Popup content='Collapse' trigger={<Icon name='chevron right' onClick={ this.collapse } />} />
                        </Card.Header>
                    </Card.Content>)
        }

        if (preview) {
            body = (<Card.Content>
                        { sprite ? sprite : unit.name }
                    </Card.Content>)
        }

        return (
        <Card
            className={ `UnitCard ${selected ? "UnitCard-selected" : "" } ${unit.location === "Limbo" ? "UnitCard-limbo" : ""}`}
            onClick={ onClick }
            unit={ unit }>
                { remainingAp > 0 && <Progress className="UnitCard-remaining-ap-bar" percent={(remainingAp/(unit.ap + (unit.upgraded.find(u => u === 'ap') ? 1 : 0)))*100} size="tiny" indicating/> }
                { body }
        </Card>);
    }
}

export default UnitCard;