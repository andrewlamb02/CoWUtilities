import React, { Component } from 'react';
// import logo from './logo.svg';
import { Segment, Container, Divider, Grid, Button, Input, Table, Icon } from 'semantic-ui-react';
import './CombatSimulator.css';

let STATS = [
    {
        type: "text",
        label: "Name",
        name: "name",
        default: "Scum"
    },
    {
        type: "number",
        label: "Power",
        name: "power",
        default: 6
    },
    {
        type: "number",
        label: "Skill",
        name: "skill",
        default: 1
    },
    {
        type: "number",
        label: "HP",
        name: "health",
        default: 6
    },
    {
        type: "number",
        label: "Initiative",
        name: "initiative",
        default: 10
    }
]

let SKILL_TABLE = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 40, 50, 60, 70, 80, 90],
    [0, 43, 53, 63, 73, 83, 93],
    [0, 26, 36, 46, 56, 66, 76],
    [0, 19, 29, 39, 49, 59, 69],
    [0, 12, 22, 32, 42, 52, 62],
    [0, 5, 15, 25, 35, 45, 55],
]

class CombatSimulator extends Component {
    constructor(props) {
        super(props)

        let monsters = [];
        for (let i = 0; i < 2; i++) {
            let monster = {};
            STATS.forEach(stat => {
                monster[stat.name] = stat.default
            });
            monsters.push(monster);
        }

        this.state = { 
            monsters,
            results: {},
            totalRuns: 10000
        }
    }

    updateMonsterValue = (event, target) => {
        const { monsters } = this.state;
        monsters[target.monster][target.field] = target.value.toString();
        if (STATS.find(stat => stat.name === target.field).type === "number"){
            monsters[target.monster][target.field] = 0;

            if (target.value) {
                monsters[target.monster][target.field] = parseInt(target.value);
            }
        }

        this.setState({ monsters });
    }

    runFight = () => {
        let { monsters, totalRuns } = this.state;

        let results = {
            monsterOne: 0,
            monsterTwo: 0,
            monsterOneHealth: 0,
            monsterTwoHealth: 0,
            draw: 0
        }

        for (let i = 0; i < totalRuns; i++) {
            let monstersSet = [];
            monsters.forEach(monster => {
                let m = {};
                STATS.forEach(stat => {
                    m[stat.name] = monster[stat.name]
                });
                monstersSet.push(m);
            });

            let order = this.strikeOrder(monstersSet);
            while (monstersSet[0].health > 0 && monstersSet[1].health > 0) {
                monstersSet = this.runRound(monstersSet, order);
            }
            
            if (monstersSet[0].health > 0) {
                results.monsterOne++;
                results.monsterOneHealth += monstersSet[0].health;
            } else if (monstersSet[1].health > 0) {
                results.monsterTwo++;
                results.monsterTwoHealth += monstersSet[1].health;
            } else {
                results.draw++;
            }
        }

        this.setState({
            results
        })
    }
    
    runRound = (monsters, order) => {
        if (order === -1) {
            let x = this.strike(monsters[0], monsters[1]);
            let y = this.strike(monsters[1], monsters[0]);
            monsters[1] = x;
            monsters[0] = y;
        } else {
            let otherOrder = order === 0 ? 1 : 0;
            monsters[otherOrder] = this.strike(monsters[order], monsters[otherOrder]);
            if (monsters[otherOrder].health > 0) {
                monsters[order] = this.strike(monsters[otherOrder], monsters[order]);
            }
        }
        
        return monsters;
    }

    strike = (attacker, target) => {
        for (let i = 0; i < attacker.power; i++) {
            let chance = SKILL_TABLE[target.skill][attacker.skill]
            let actual = Math.random() * 100;
            if (actual <= chance) {
                target.health -= 1;
            }
        }
        return target
    }

    strikeOrder = (monsters) => {
        let m0 = monsters[0];
        let m1 = monsters[1];
        return m0.initiative > m1.initiative ? 0 : m0.initiative < m1.initiative ? 1 : -1
    }

    render() {
        let { monsters, results, totalRuns } = this.state;

        return (
                <Container
                    className="CombatSimulator">
                    <Segment className="CombatSimulator-segment">
                        <div className="CombatSimulator-form">
                            <Grid columns={2}>
                                <Grid.Column className="CombatSimulator-column">
                                    {
                                        STATS.map(stat => {
                                            return (
                                                <div className="CombatSimulator-input" key = { `0-${stat.name}` } >
                                                    <Input
                                                        fluid
                                                        size="small"
                                                        label={{ color: "green", content: stat.label }}
                                                        type={ stat.type }
                                                        monster={ 0 }
                                                        field={ stat.name }
                                                        value={ monsters[0][stat.name] }
                                                        onChange={ this.updateMonsterValue }
                                                        color="blue"
                                                        />
                                               </div>
                                           )
                                      })
                                  }
                              </Grid.Column>
                              <Grid.Column className="CombatSimulator-column">
                                  {
                                      STATS.map(stat => {
                                           return (
                                                <div className="CombatSimulator-input" key = { `1-${stat.name}` }>
                                                    <Input
                                                        fluid
                                                        size="small"
                                                        label={{ color: "blue", content: stat.label }}
                                                        type={ stat.type }
                                                        monster={ 1 }
                                                        field={ stat.name }
                                                        value={ monsters[1][stat.name] }
                                                        onChange={ this.updateMonsterValue }
                                                    />
                                                </div>
                                           )
                                      })
                                  }
                              </Grid.Column>
                          </Grid>
      
                          <Divider vertical>VS</Divider>
                      </div>
                      <Divider></Divider>
                      <Container textAlign="center">
                          <Button color="red" onClick={ this.runFight }>Fight</Button>
                      </Container>
                      <Divider></Divider>
                      <div>
                          <Table 
                                color={ results.monsterOne > results.monsterTwo ? "green" : results.monsterOne < results.monsterTwo ? "blue" : "yellow" }
                                celled 
                                selectable 
                                compact
                                definition
                                className="CombatSimulator-table">
                                <Table.Header>
                                    <Table.Row columns={ 4 }>
                                        <Table.HeaderCell width={ 4 }>
                                            
                                        </Table.HeaderCell>
                                        <Table.HeaderCell width={ 4 }>
                                            { monsters[0].name }
                                        </Table.HeaderCell>
                                        <Table.HeaderCell width={ 4 }>
                                            { monsters[1].name }
                                        </Table.HeaderCell>
                                        <Table.HeaderCell width={ 4 }>
                                            Draw
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>
                                            <Icon name="trophy" /> Wins
                                        </Table.Cell>
                                        <Table.Cell>
                                            { results.monsterOne }
                                        </Table.Cell>
                                        <Table.Cell>
                                            { results.monsterTwo }
                                        </Table.Cell>
                                        <Table.Cell>
                                            { results.draw }
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>
                                            <Icon name="trophy" /><Icon name="percent" /> Win %
                                        </Table.Cell>
                                        <Table.Cell>
                                            { (results.monsterOne / (totalRuns) * 100).toFixed(2) }%
                                        </Table.Cell>
                                        <Table.Cell>
                                            { (results.monsterTwo / (totalRuns) * 100).toFixed(2) }%
                                        </Table.Cell>
                                        <Table.Cell>
                                            { (results.draw / (totalRuns) * 100).toFixed(2) }%
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>
                                            <Icon name="tint" /> Average Health
                                        </Table.Cell>
                                        <Table.Cell>
                                            { (results.monsterOneHealth / totalRuns).toFixed(2) }
                                        </Table.Cell>
                                        <Table.Cell>
                                            { (results.monsterTwoHealth / totalRuns).toFixed(2) }
                                        </Table.Cell>
                                        <Table.Cell>

                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>
                                            <Icon name="tint" /><Icon name="trophy" /> Average Health (Only Wins)
                                        </Table.Cell>
                                        <Table.Cell>
                                            { (results.monsterOneHealth / results.monsterOne).toFixed(2) }
                                        </Table.Cell>
                                        <Table.Cell>
                                            { (results.monsterTwoHealth / results.monsterTwo).toFixed(2) }
                                        </Table.Cell>
                                        <Table.Cell>
                                            
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                          </Table>
                      </div>
                  </Segment>
              </Container>
        );
    }
}

export default CombatSimulator;
