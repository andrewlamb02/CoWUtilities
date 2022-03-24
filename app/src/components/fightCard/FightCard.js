import React, { Component, Fragment } from 'react';
import './FightCard.css';
import { Card, Table, Icon, Popup } from 'semantic-ui-react';
import UnitSprite from '../UnitSprite/UnitSprite';
class FightCard extends Component {
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

    render() {
        const { fight } = this.props;
        const { collapsed } = this.state;
        
        return <Card fluid className="FightCard" color={ fight.monsters[0].dead ? fight.monsters[1].dead ? "yellow" : "red" : "green"}>
            <Card.Content>
                <Card.Header>
                    <Popup content='Collapse' trigger={<Icon name={`chevron ${collapsed ? "right" : "down"}`} onClick={ this.collapse } className="FightCard-collapse-chevron" />} />
                    <UnitSprite unitType={fight.monsters[0].type} className="FightCard-unit-sprite" animated />
                    { fight.monsters[0].name }
                    <Icon name="crosshairs" />
                    <UnitSprite unitType={fight.monsters[1].type} className="FightCard-unit-sprite" animated />
                    { fight.monsters[1].faction } - x{ fight.location.x }y{ fight.location.y } - Impulse: { fight.impulse }
                </Card.Header>
            </Card.Content>
            { !collapsed && <Fragment>
                <Card.Content className="FightCard-stats">
                    <Table celled basic="very">
                        <Table.Body>
                            { fight.monsters.map((monster, index) => {
                                return <Table.Row key={`monster-stats-${index}`}>
                                    <Table.Cell>
                                        <UnitSprite unitType={monster.type} className="FightCard-unit-sprite" animated />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Icon name="tint" /> {monster.health}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Icon name="gavel" /> {monster.power}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Icon name="balance scale" /> {monster.skill}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Icon name="clock" /> {monster.initiative}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Icon name="dna" /> {monster.xp}
                                    </Table.Cell>
                                </Table.Row>
                            })}
                        </Table.Body>
                    </Table>
                </Card.Content>
                <Card.Content className="FightCard-stats">
                    <Table
                        celled
                        compact
                        basic="very"
                        textAlign="center"
                        className="FightCard-table">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>
                                    Round
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Attacker
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Damage
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Actual/Expected Hit Rate
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Hits
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Kill (VP)
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { fight.rounds.map(round => {
                                return round.attacks.map((attack, index) => {
                                    return <Table.Row key={`${round.number}-${index}`}>
                                        <Table.Cell>
                                            { round.number }
                                        </Table.Cell>
                                        <Table.Cell>
                                            { attack.faction }
                                        </Table.Cell>
                                        <Table.Cell>
                                            { attack.damage }
                                        </Table.Cell>
                                        <Table.Cell>
                                            { attack.actualHit }/{ attack.hitRate }
                                        </Table.Cell>
                                        <Table.Cell>
                                            { attack.hits.map((hit, i) => <Fragment key={`${round.number}-${index}-${i}`}><span className="FightCard-hit">{hit}</span>{ (i + 1) % 5 === 0 ? <br/> : "" }</Fragment>) }
                                        </Table.Cell>
                                        <Table.Cell>
                                            {attack.dead ? <Fragment><Icon name="bullseye" />({attack.vp})</Fragment> : "" }
                                        </Table.Cell>
                                    </Table.Row>
                                });
                            }) }
                        </Table.Body>
                    </Table>
                </Card.Content>
            </Fragment> }
            <Card.Content className="FightCard-stats">
                    <Table basic="very" columns={4}>
                        <Table.Body>
                            { fight.monsters.map((monster, index) => {
                                return <Table.Row key={`monster-results-${index}`}>
                                    <Table.Cell>
                                        <Icon name={monster.dead ? "heart" : "heartbeat"} color={monster.dead ? "black" : "red"}/>
                                        <UnitSprite unitType={monster.type} className="FightCard-unit-sprite" animated={!monster.dead} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Icon name="tint" />
                                        { fight.rounds.reduce((T, r) => {
                                            return T - r.attacks.filter(a => {
                                                    return a.faction.split(" ").splice(0, a.faction.split(" ").length - 1).reduce((s, w) => s + " " + w, "").trim() !== monster.faction 
                                                }).reduce((t, a) => t + a.damage, 0)
                                        }, monster.health) }
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div>
                                            { !monster.dead && <Fragment>
                                                <Icon name="dna" />
                                                { monster.xp }
                                                <Icon name="arrow right" />
                                                { monster.xp + fight.xp }
                                            </Fragment>
                                            }
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div>
                                            { monster.evolved && <Fragment>
                                                <Icon name="flask" />
                                                <UnitSprite unitType={monster.type} className="FightCard-unit-sprite" animated />
                                                <Icon name="arrow right" />
                                                <UnitSprite unitType={monster.evolved} className="FightCard-unit-sprite" animated />
                                            </Fragment>
                                            }
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            })}
                    </Table.Body>
                </Table>
            </Card.Content>
        </Card>
    }
}

export default FightCard;