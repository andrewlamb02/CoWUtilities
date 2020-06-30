import React, { Component } from 'react';
import './TypeCard.css';
import { Card, Table, Icon, Popup, Input } from 'semantic-ui-react';
import UnitSprite from '../UnitSprite/UnitSprite';
class TypeCard extends Component {
    render() {
        const { unitType, updateCount, count } = this.props;
        return <Card className="TypeCard">
            <Card.Content>
                <Card.Header>
                    <UnitSprite unitType={unitType.name} className="TypeCard-unit-sprite" animated />
                    { unitType.name }
                </Card.Header>
            </Card.Content>
            <Card.Content className="TypeCard-stats">
                <Table textAlign="center">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>
                                <Popup
                                    position="top right"
                                    trigger={<Icon name="gavel"></Icon>}>
                                    Power
                                </Popup>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <Popup
                                    position="top right"
                                    trigger={<Icon name="balance scale"></Icon>}>
                                    Skill
                                </Popup>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <Popup
                                    position="top right"
                                    trigger={<Icon name="shipping fast"></Icon>}>
                                    AP
                                </Popup>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>
                                { unitType.power }
                            </Table.Cell>
                            <Table.Cell>
                                { unitType.skill }
                            </Table.Cell>
                            <Table.Cell>
                                { unitType.ap }
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Card.Content>
            <Card.Content>
                <Input type="number" onChange={ (event, data) => updateCount(unitType, data.value) } value={ count }/>
            </Card.Content>
        </Card>
    }
}

export default TypeCard;