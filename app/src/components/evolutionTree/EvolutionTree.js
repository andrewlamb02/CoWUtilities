import React, { Component } from 'react';
import './EvolutionTree.css';
import { Grid } from 'semantic-ui-react';
import * as globals from '../../globals';
import EvolutionChain from '../evolutionChain/EvolutionChain';

class EvolutionTree extends Component {
    render() {
        const { units } = this.props;
        console.log()

        return <div className="EvolutionTree">
            <Grid stretched divided columns={(units ? units : globals.unitTypes.filter(u => u.cauldronStrength !== undefined)).length}>
                { (units ? units : globals.unitTypes.filter(u => u.cauldronStrength !== undefined)).map(unit => {
                    return <Grid.Column key={ unit.code }>
                            <EvolutionChain unit={unit} />
                        </Grid.Column>
                })}
            </Grid>
        </div>
    }
}

export default EvolutionTree;