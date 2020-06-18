import React, { Component } from 'react';
import './Cauldron.css';
import * as globals from '../../globals';
import { Input, Grid, Container } from 'semantic-ui-react';
import TypeCard from '../typeCard/TypeCard';

class Cauldron extends Component {
    render() {
        const { cauldronStrength, updateCount, summons } = this.props;
        
        return <Container className="Cauldron">
            <h1>Cauldron | Strength: { cauldronStrength }</h1>
            <div>
                <Input labelPosition="left" label="Invest"></Input>
            </div>
            <div className="Cauldron-summon-section">
                <h2>Summon</h2>
                <Grid stackable stretched>
                    {
                        globals.unitTypes.filter(u => u.cauldronStrength <= cauldronStrength).map(unit => {
                            return <Grid.Column className="Cauldron-summon-grid-column" stretched key={ unit.code }>
                                    <TypeCard unitType={ unit } count={ summons[unit.code] } updateCount={ updateCount } />
                                </Grid.Column>
                        })
                    }
                </Grid>
            </div>
        </Container>
    }
}

export default Cauldron;