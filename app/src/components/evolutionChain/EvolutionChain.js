import React, { Component } from 'react';
import './EvolutionChain.css';
import { Icon, Grid, Popup } from 'semantic-ui-react';
import UnitSprite from '../../components/UnitSprite/UnitSprite';
import * as globals from '../../globals';

class EvolutionChain extends Component {
    render() {
        const { unit } = this.props;

        (unit.evolvesInto || []).forEach(evolve => {
            evolve.unitType = globals.unitTypes.find(u => u.code === evolve.unit);
        });

        return <Grid.Column>
                <Popup 
                    position="top center" 
                    content={ unit.name }
                    trigger={<div><UnitSprite unitType={ unit.name } animated/></div>} />
                { (unit.evolvesInto || []).length > 0 &&
                <Grid stretched columns={(unit.evolvesInto || []).length} divided>       
                    { (unit.evolvesInto || []).map(e => {
                        return <Grid.Column key={ e.unitType.code }>
                                <div>
                                    { e.xp }<Icon name="dna" />
                                </div>
                                <EvolutionChain unit={e.unitType} />
                            </Grid.Column>
                    })}
                </Grid> }
            </Grid.Column>
    }
}

export default EvolutionChain;