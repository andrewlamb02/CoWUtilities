import React, { Component, Fragment } from 'react';
// import logo from './logo.svg';
import { Button, Dropdown, Grid } from 'semantic-ui-react';
import './TurnController.css';
import { parse } from 'node-html-parser';
import UnitCard from '../../components/unitCard/UnitCard';
import * as globals from "../../globals";

const IMPULSES = [
    { key: 0, value: 0, text: 'Start' },
    { key: 1, value: 1, text: 1 },
    { key: 2, value: 2, text: 2 },
    { key: 3, value: 3, text: 3 },
    { key: 4, value: 4, text: 4 },
    { key: 5, value: 5, text: 5 },
    { key: 6, value: 6, text: 6 },
    { key: 7, value: 7, text: 7 },
    { key: 8, value: 8, text: 8 },
    { key: 9, value: 9, text: 9 },
    { key: 10, value: 10, text: 10 }
]

class TurnController extends Component {
    constructor(props) {
        super(props)

        this.state = {
            game: "",
            turn: "",
            faction: "",
            text: [],
            sections: [],
            units: [],
            grid: [],
            selectedColor: "#9fe2bf",
            destinationColor: "yellow",
            currentImpulse: 0
        }

        this.clickRealm = this.clickRealm.bind(this);
    }

    uploadFile = (event) => {
      let file = event.target.files[0];
      
      let f = file.name.split('.');
      if (file && f.pop() === "html") {
        file.text().then(this.loadFile);
        this.parseFileName(f.pop());
      }
    }

    parseFileName = (name) => {
        let words = name.split("_");
        this.setState({
            game: words[3],
            turn: words[5],
            faction: words[6]
          });
    }        

    loadFile = (text) => {
        let { faction } = this.state;
        let lines = text.split("<br>");
        let sections = [];
        let homeRealm = {};

        lines.forEach((line, index) => {
            line = line.trim();
            let start = line.search("<h2>") === -1 ? line.search("<h3>") : line.search("<h2>");
            if (start !== -1) {
                let end = (line.search("</h2>") === -1 ? line.search("</h3>") : line.search("</h2>")) + 5;
                lines[index] = line.substr(start, end);
                lines.splice(index + 1, 0, line.substr(end, line.length))
                
                let section = line.substr(start, end);
                sections.push({
                    index,
                    title: parse(section).text.trim()
                })
            }

            if (line.search("Home Realm") !== -1) {
                let word = line.split(" ")[2];
                let xIndex = word.search("x");
                let yIndex = word.search("y");
                
                homeRealm = {
                    x: parseInt(word.substring(xIndex + 1, yIndex)),
                    y: parseInt(word.substring(yIndex + 1, word.length))
                }
            }
        });

        let unitsIndex = sections.findIndex(section => section.title === "Unit Summary (end of turn view)");

        let unitLines = lines.slice(sections[unitsIndex].index + 1, sections[unitsIndex+1].index - 3);
        let units = [];
        let i = 0;
        unitLines.forEach(line => {
            let words = line.trim().split(" ");

            let location = "Limbo";
            let initialLocation = "Limbo";
            if (words[8] !== "Limbo") {
                let xIndex = words[8].search("x");
                let yIndex = words[8].search("y");

                location = {
                    x: parseInt(words[8].substring(xIndex + 1, yIndex)),
                    y: parseInt(words[8].substring(yIndex + 1, words[8].length))
                };

                initialLocation = {
                    x: parseInt(words[8].substring(xIndex + 1, yIndex)),
                    y: parseInt(words[8].substring(yIndex + 1, words[8].length))
                };
            }

            let moves = [];
            for (let i = 0; i < 10; i++) {
                moves.push(".");
            }

            units.push({
                name: words[0],
                type: words[1],
                health: parseInt(words[4]),
                maxHealth: parseInt(words[6]),
                ap: parseInt(words[16]),
                power: parseInt(words[18]),
                skill: parseInt(words[20]),
                key: i,
                faction,
                location,
                initialLocation,
                moves,
                pathHome: false,
                upgraded: []
            });
            i++;
        })
        
        let isolationIndex = sections.findIndex(section => section.title === "Cauldronborn Isolation Checks");

        let isolationLines = lines.slice(sections[isolationIndex].index + 1, sections[isolationIndex+1].index);
        
        isolationLines.forEach(line => {
            units.find(u => u.name === line.split(" ")[0].trim()).pathHome = true;
        })

        let mapIndex = sections.findIndex(section => section.title === "Map (end of turn view)");

        let mapLines = lines.slice(sections[mapIndex].index + 1, lines.length);

        let grid = [];
        let row = [];
        for (let i = 0; i < mapLines.length; i++) {
            if (mapLines[i].search("</html>") === -1) {
                if (mapLines[i].search("<tr>") !== -1) {
                    if (row.length > 0) {
                        grid.push(row);
                    }
                    let end = mapLines[i].search("<tr>") + 4;
                    
                    mapLines.splice(i + 1, 0, mapLines[i].substring(end, mapLines[i].length));
                    row = [];
                } else {
                    if (parse(mapLines[i]).childNodes[1].text.trim().split(" ").length > 1) {
                        let mText = parse(mapLines[i]).childNodes[1].text.trim().split(" ")[1];
    
                        if (mText.split("_")[1] !== faction){
                            units.push({
                                name: mText,
                                type: mText.split("_")[0],
                                faction: mText.split("_")[1],
                                location: {
                                    x: row.length,
                                    y: grid.length
                                },
                                initialLocation: {
                                    x: row.length,
                                    y: grid.length
                                }
                            })
                        }
                    }
    
                    let attributes = {};
                    let jumpLabel = "";
    
                    if (parse(mapLines[i]).childNodes[1].attributes.bgcolor === "#000000") {
                        attributes.blocked = true;
                    }
    
                    if (parse(mapLines[i]).childNodes[1].childNodes.find(node => node.tagName === "b")) {
                        attributes.home = parse(mapLines[i]).childNodes[1].attributes.bgcolor;
                    }
                    
                    if (this.findUppercase(parse(mapLines[i]).childNodes[1].text.trim().split(" ")[0])) {
                        attributes.jump = true;
                        jumpLabel = this.findUppercase(parse(mapLines[i]).childNodes[1].text.trim().split(" ")[0]);
                    }
    
                    row.push({
                        color: parse(mapLines[i]).childNodes[1].attributes.bgcolor,
                        text: parse(mapLines[i]).childNodes[1].text.trim().split(" ")[0],
                        attributes,
                        jumpLabel
                    })
                }
            }
        }

        if (row.length > 0) {
            grid.push(row);
        }

        this.setState({
            text: unitLines,
            sections,
            units,
            grid,
            homeRealm
        });
    }

    selectUnit = (event, target) => {
        this.setState({
            selectedUnit: target.unit
        });
    }

    checkColor = (defaultColor, x, y) => {
        const { selectedColor, selectedUnit, destinationColor } = this.state;

        if (selectedUnit && selectedUnit.location.x === x && selectedUnit.location.y === y) {
            return selectedColor;
        }

        if (this.isMovable(x, y)) {
            return destinationColor;
        }

        return defaultColor;
    }

    isMovable = (x, y) => {
        const { selectedUnit, grid, homeRealm } = this.state;

        if (!selectedUnit || grid[y][x].attributes.blocked) {
            return false;
        }

        if (selectedUnit.location === "Limbo") {
            if ((grid[y][x].attributes.home && y === homeRealm.y && x === homeRealm.x) || grid[y][x].attributes.jump) {
                return true;
            }

            return false;
        }

        if (this.isAdjacent(selectedUnit.location, { x, y })) {
            if (grid[y][x].attributes.home && (y !== homeRealm.y || x !== homeRealm.x)) {
                return false;
            }

            return true;
        }

        if (grid[selectedUnit.location.y][selectedUnit.location.x].attributes.jump) {
            if (grid[y][x].attributes.jump) {
                return true;
            }
        }

        return false;
    }

    isAdjacent = (origin, destination) => {        
        if (origin.x === destination.x && (origin.y === destination.y + 1 || origin.y === destination.y - 1)) {
            return true;
        }

        if (origin.y === destination.y && (origin.x === destination.x + 1 || origin.x === destination.x - 1)) {
            return true;
        }
        
        return false;
    }

    findUppercase = (word) => {
        for (let i = 0; i < word.length; i++) {
            if (globals.capitals.find(cap => cap === word.charAt(i))) {
                return word.charAt(i);
            }
        }

        return false;
    }

    changeImpulse = (event, data) => {
        this.setImpulse(data.value);
    }

    setImpulse = (impulse) => {
        let units = this.runMoves({ impulse });
        this.setState({ currentImpulse: impulse, units });
    }

    upgradeUnit = (unit, attribute) => {
        if (!unit.upgraded.find(u => u === attribute)) {
            unit.upgraded.push(attribute);
        } else {
            unit.upgraded.splice(unit.upgraded.findIndex(u => u === attribute), 1);
        }
    }

    runMoves = (options) => {
        const { homeRealm, currentImpulse } = this.state;
        let units = options.units || this.state.units;
        let impulse = options.impulse === 0 ? 0 : options.impulse || currentImpulse;
        
        units.forEach(unit => {
            if (unit.initialLocation !== "Limbo") {
                unit.location.x = unit.initialLocation.x;
                unit.location.y = unit.initialLocation.y;
            } else {
                unit.location = "Limbo";
            }

            if (unit.moves) {
                for (let i = 0; i < impulse; i++) {
                    switch (unit.moves[i]) {
                        case "N":
                            unit.location.y -= 1;
                            break;
                        case "S":
                            unit.location.y += 1;
                            break;
                        case "E":
                            unit.location.x += 1;
                            break;
                        case "W":
                            unit.location.x -= 1;
                            break;
                        case "H":
                            unit.location = {
                                x: homeRealm.x,
                                y: homeRealm.y
                            };
                            break;
                        case ".":
                            
                            break;
                        default:
                            if (unit.moves[i][0] === "T") {
                                unit.location = {};
                                unit.location.x = this.findJumpRealm(unit.moves[i][2]).x
                                unit.location.y = this.findJumpRealm(unit.moves[i][2]).y
                            }
                            break;
                    }
                }
            }
        });

        return units;
    }

    findJumpRealm = (label) => {
        const { grid } = this.state

        for (let i = 0; i < grid.length; i++) {
            if (grid[i].findIndex(realm => realm.jumpLabel === label) !== -1) {
                return {
                    x: grid[i].findIndex(realm => realm.jumpLabel === label),
                    y: i
                }
            }
        }
    }

    clickRealm = (x, y) => {    
        const { selectedUnit, currentImpulse } = this.state;

        let moveCount = 0;

        for (let i = 0; i < currentImpulse; i++) {
            if (selectedUnit.moves[i] !== ".") {
                moveCount += 1;
            }
        }

        if (this.isMovable(x, y) && moveCount < selectedUnit.ap + (selectedUnit.upgraded.find(u => u === "ap") ? 1 : 0)) {
            selectedUnit.moves[currentImpulse] = this.getMoveType(selectedUnit.location, { x, y });

            for (let i = currentImpulse + 1; i < 10; i++) {
                selectedUnit.moves[i] = ".";
            }
            
            if (currentImpulse !== 10) {
                this.setImpulse(currentImpulse + 1);
            }
        }
    }
    
    getMoveType = (origin, destination) => {
        const { grid } = this.state;

        if (this.isAdjacent(origin, destination)) {
            if (origin.x < destination.x) {
                return "E";
            }
            if (origin.x > destination.x) {
                return "W";
            }
            if (origin.y < destination.y) {
                return "S";
            }
            if (origin.y > destination.y) {
                return "N";
            }
        }
        
        if (grid[destination.y][destination.x].attributes.home) {
            return "H";
        }

        if (grid[destination.y][destination.x].attributes.jump) {
            return `T(${grid[destination.y][destination.x].jumpLabel})`;
        }

        return ".";
    }

    clearMoves = (evet, data) => {
        const { units } = this.state;

        let unit = units.find(u => u.name === data.unit.name);
        unit.moves = unit.moves.map(move => ".");

        let newUnits = this.runMoves({ units });

        this.setState({ units: newUnits });
    }

    downloadTurn = () => {
        const { game, turn, faction } = this.state;

        let text = this.generateFile();

        const element = document.createElement("a");
        const file = new Blob([text], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `CoW_Orders_Game_${game}_Turn_${parseInt(turn + 1)}_${faction}.txt`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    generateFile = () => {
        const { units, faction } = this.state;
        let text = "";

        units.filter(unit => unit.faction === faction).forEach(unit => {
            unit.upgraded.forEach(upgrade => {
                text = `${text}UPG ${unit.name} `;
                
                if (upgrade === "ap") {
                    text = `${text}AP`;
                } else if (upgrade === "power") {
                    text = `${text}PW`;
                } else if (upgrade === "skill") {
                    text = `${text}SK`;
                }
                
                text = `${text}\n`;
            });

            text = `${text}MOV ${unit.name} `;

            unit.moves.forEach(move => {
                text = `${text}${move}`;
            })

            text = `${text}\n`;
        });

        return text;
    }

    render() {
        let { game, turn, faction, units, grid, selectedUnit, currentImpulse } = this.state;

        return (
              <div className="TurnController">
                    <div className="TurnController-upload-button">
                        <Button
                            content="Upload"
                            labelPosition="left"
                            icon="file"
                            htmlFor="file"
                            as="label"
                            color="blue"/>
                        <input type="file"
                            id="file"
                            hidden
                            name="file"
                            onChange={ this.uploadFile }/>
                    </div>
                    { turn && <div className="TurnController-save-button">
                        <Button
                            content="Save"
                            labelPosition="left"
                            icon="download"
                            color="green"
                            onClick={ this.downloadTurn } />
                    </div> }
                    <table className="TurnController-header">
                        <tbody>
                            <tr>
                                <td>
                                        <h1>{ game }: Turn { turn } - { faction }</h1>
                                </td>
                                <td className="TurnController-impulse-container">
                                    { game && (
                                        <Fragment>
                                            <h3>Impulse:</h3>
                                            <Dropdown 
                                                selection 
                                                labeled 
                                                value={ currentImpulse } 
                                                placeholder="Impulse" 
                                                options={ IMPULSES }
                                                onChange={ this.changeImpulse }></Dropdown>
                                        </Fragment>) }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <Grid columns={ 2 }>
                        <Grid.Column className="TurnController-units">
                            <h2>Units {units.filter(unit => unit.location !== "Limbo" && unit.faction === faction).length}/20</h2>
                            <div>
                                { units.filter(u => u.faction === faction ).map(u => {
                                    return <UnitCard 
                                                key={u.key} 
                                                unit={u} 
                                                selected={selectedUnit === u}
                                                onClick={ this.selectUnit }
                                                clearMoves={this.clearMoves}
                                                upgradeUnit={this.upgradeUnit} />
                                }) }
                            </div>
                        </Grid.Column>
                        <Grid.Column className="TurnController-map-column">
                            <div className="TurnController-map">
                                <table className="TurnController-map-table">
                                    <tbody>
                                    {
                                        grid.map((row, i) => {
                                            return (
                                                <tr key={i}>
                                                    {
                                                        row.map((cell, j) => {
                                                            return (
                                                            <td
                                                                className={`${ cell.attributes.jump ? "TurnController-jump-realm" : "" }`}
                                                                style={ { backgroundColor: this.checkColor(cell.color, j, i) } }
                                                                key={`${i}-${j}`}
                                                                onClick={() => this.clickRealm(j, i) }>
                                                                { cell.attributes.home ? <b>{ cell.text }</b> : cell.text }
                                                                <br />
                                                                { units.filter(m => m.location.x === j && m.location.y === i).map(m => {
                                                                    return <div key={ m.name }>{ m.name }</div>
                                                                }) }
                                                            </td>)
                                                        })
                                                    }
                                                </tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </Grid.Column>
                    </Grid>
              </div>
        );
    }
}

export default TurnController;
