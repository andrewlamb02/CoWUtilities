import React, { Component } from 'react';
// import logo from './logo.svg';
import { Segment, Container, Divider, Grid, Button, Input, Header, Table, TableBody } from 'semantic-ui-react';
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
            results: {}
        }
    }

    updateMonsterValue = (event, target) => {
        this.state.monsters[target.monster][target.field] = target.value.toString();
        if (STATS.find(stat => stat.name === target.field).type === "number"){
            this.state.monsters[target.monster][target.field] = 0;

            if (target.value) {
                this.state.monsters[target.monster][target.field] = parseInt(target.value);
            }
        }

        this.setState(this.state);
    }

    runFight = () => {
        let { monsters } = this.state;

        let results = {
            monsterOne: 0,
            monsterTwo: 0,
            draw: 0
        }

        for (let i = 0; i < 10000; i++) {
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
            } else if (monstersSet[1].health > 0) {
                results.monsterTwo++;
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
        let { monsters, results } = this.state;

        return (
              <Container className="CombatSimulator">
                  <Segment className="CombatSimulator-segment">
                      <div className="CombatSimulator-form">
                          <Grid columns={2} relaxed='very'>
                              <Grid.Column className="CombatSimulator-column">
                                  {
                                      STATS.map(stat => {
                                           return (
                                            <Input 
                                                key = { `0-${stat.name}` }
                                                className="CombatSimulator-input" 
                                                label={{ color: "green", content: stat.label }}
                                                type={ stat.type }
                                                monster={ 0 }
                                                field={ stat.name }
                                                value={ monsters[0][stat.name] }
                                                onChange={ this.updateMonsterValue }
                                                color="blue"
                                                ></Input>
                                           )
                                      })
                                  }
                              </Grid.Column>
                              <Grid.Column className="CombatSimulator-column">
                                  {
                                      STATS.map(stat => {
                                           return (
                                            <Input 
                                                key = { `1-${stat.name}` }
                                                className="CombatSimulator-input" 
                                                label={{ color: "blue", content: stat.label }}
                                                type={ stat.type }
                                                monster={ 1 }
                                                field={ stat.name }
                                                value={ monsters[1][stat.name] }
                                                onChange={ this.updateMonsterValue }
                                                ></Input>
                                           )
                                      })
                                  }
                              </Grid.Column>
                          </Grid>
      
                          <Divider vertical>VS</Divider>
                      </div>
                      <Divider></Divider>
                      <div>
                          <Button color="red" onClick={ this.runFight }>Fight</Button>
                      </div>
                      <Divider></Divider>
                      <div>
                          <Header>
                              Results
                          </Header>
                          <Table className="CombatSimulator-table">
                              <Table.Header>
                                  <Table.Row columns={ 3 }>
                                    <Table.HeaderCell>
                                        { monsters[0].name }
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        { monsters[1].name }
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        Draw
                                    </Table.HeaderCell>
                                  </Table.Row>
                              </Table.Header>
                              <Table.Body>
                                  <Table.Row>
                                    <Table.Cell>
                                        { results.monsterOne } ({ results.monsterOne / (results.monsterOne + results.monsterTwo + results.draw) * 100 }%)
                                    </Table.Cell>
                                    <Table.Cell>
                                        { results.monsterTwo } ({ results.monsterTwo / (results.monsterOne + results.monsterTwo + results.draw) * 100 }%)
                                    </Table.Cell>
                                    <Table.Cell>
                                        { results.draw } ({ results.draw / (results.monsterOne + results.monsterTwo + results.draw) * 100 }%)
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
