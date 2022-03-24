import React, { Component } from 'react';
import './UnitBook.css';
import { Table, Icon, Container, Tab } from 'semantic-ui-react';
import UnitSprite from '../../components/UnitSprite/UnitSprite';
import * as globals from '../../globals';
import _ from "lodash";
import EvolutionTree from '../../components/evolutionTree/EvolutionTree';

class UnitBook extends Component {
    constructor(props) {
        super(props)

        this.state = {
        column: null,
        units: globals.unitTypes,
        direction: null,
        }
    }
  
    handleSort = (clickedColumn) => () => {
      const { column, units, direction } = this.state
  
      if (column !== clickedColumn) {
        this.setState({
          column: clickedColumn,
          units: _.sortBy(units, [clickedColumn]),
          direction: 'ascending',
        })
  
        return
      }
  
      this.setState({
        units: units.reverse(),
        direction: direction === 'ascending' ? 'descending' : 'ascending',
      })
    }
    
    panes =  () => [
        {
          menuItem: { key: "list", icon: "list", content: "Unit List"},
          render: () => {       
                const { units, direction, column } = this.state;
    
                return <div className="UnitBook-tab-pane">
                    <Table textAlign="center" selectable sortable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell
                                    sorted={column === 'level' ? direction : null}
                                    onClick={this.handleSort('level')}>
                                    Level
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Sprite
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={column === 'name' ? direction : null}
                                    onClick={this.handleSort('name')}>
                                    Name
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={column === 'code' ? direction : null}
                                    onClick={this.handleSort('code')}>
                                    Code
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={column === 'power' ? direction : null}
                                    onClick={this.handleSort('power')}>
                                    <Icon name="gavel" /> Power
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={column === 'skill' ? direction : null}
                                    onClick={this.handleSort('skill')}>
                                    <Icon name="balance scale" /> Skill
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={column === 'ap' ? direction : null}
                                    onClick={this.handleSort('ap')}>
                                    <Icon name="shipping fast" /> AP
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body className="UnitBook-table-body">
                            { units.map(u => {
                                return <Table.Row key={u.code}>
                                    <Table.Cell>
                                        { u.level }
                                    </Table.Cell>
                                    <Table.Cell>
                                        <UnitSprite unitType={u.name} animated/>
                                    </Table.Cell>
                                    <Table.Cell>
                                        { u.name }
                                    </Table.Cell>
                                    <Table.Cell>
                                        { u.code }
                                    </Table.Cell>
                                    <Table.Cell>
                                        { u.power }
                                    </Table.Cell>
                                    <Table.Cell>
                                        { u.skill }
                                    </Table.Cell>
                                    <Table.Cell>
                                        { u.ap }
                                    </Table.Cell>
                                </Table.Row>
                            })
                            }
                        </Table.Body>
                    </Table>
                </div>
            },
        },
        {
            menuItem: { key: "evolution", icon: "dna", content: "Evolutionary Tree"},
            render: () => <div className="UnitBook-tab-pane"><EvolutionTree /></div>,
        }
    ]
    
    render() {
        return <Container className="UnitBook">
            <Tab menu={{ secondary: true, pointing: true, vertical: true }} renderActiveOnly panes={this.panes()} className="1" />
        </Container>
    }
}

export default UnitBook;