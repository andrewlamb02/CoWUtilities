import React, { Component, Fragment } from 'react';
// import logo from './logo.svg';
import { Button, Dropdown, Grid, Popup, Modal, TextArea, Checkbox } from 'semantic-ui-react';
import './TurnController.css';
import { parse } from 'node-html-parser';
import UnitCard from '../../components/unitCard/UnitCard';
import Cauldron from '../../components/cauldron/Cauldron';
import * as globals from "../../globals";
import * as chroma from "chroma-js";
import CombatSimulator from '../combatSimulator/CombatSimulator';
import sprites from '../../resources/sprites';
import UnitSprite from '../../components/UnitSprite/UnitSprite';
import FightCard from '../../components/fightCard/FightCard';

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

        let cycleInterval = setInterval(() => {
            const { colorCycleCount } = this.state;
            this.setState({
                colorCycleCount: colorCycleCount > 2 ?  0.1 : colorCycleCount + (colorCycleCount > 0.75 && colorCycleCount < 1.25 ? 0.05 : 0.1)
            })
        }, 10)

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
            colorCycleCount: 0.0,
            currentImpulse: 0,
            startingRealmforce: 0,
            showCombatSimulator: false,
            showCauldron: false,
            cycleInterval,
            summons: {},
            unitsCollapsed: false,
            extraCommands: "",
            showSprites: false,
            popupUnits: [],
            showCellPopup: false,
            popupCellColor: "",
            filteredType: "All",
            fights: [],
            showFights: false,
            showUnitsInLimbo: false
        }

        this.clickRealm = this.clickRealm.bind(this);
    }

    componentWillUnmount() {
        clearInterval(this.state.cycleInterval)
    }

    uploadTurnFile = (event) => {
        var file = event.target.files[0];
        let turnControllerThis = this;

        let f = file ? file.name.split('.') : [""];
        if (file && f.pop() === "txt") {
            var reader = new FileReader();
            reader.onload = function(){
              var text = reader.result;
              turnControllerThis.loadTurn(text);
            };
            reader.readAsText(file);
        }
      
    }
    
    loadTurn = (text) => {
        const { units, summons } = this.state;

        let lines = text.split("\n");

        lines.forEach(line => {
            line = line.split("#")[0].trim();
            
            if (line !== "") {
                let words = line.split(" ");
                let command = words[0];
                let unit;
                switch (command) {
                    case "MOV":
                        unit = units.find(u => u.name === words[1]);
                        let move = 0;
                        for (let i = 0; i < words[2].length; i++) {
                            switch (words[2][i]) {
                                case "T":
                                    unit.moves[move] = words[2].substr(i, 4);
                                    i += 3;
                                    break;
                                default:
                                    unit.moves[move] = words[2].charAt(i)
                                    break;
                            }
                            move += 1;
                        }
                        break;
                    case "SUM":
                        summons[words[2]] = parseInt(words[1]);
                        break;
                    case "UPG":
                        unit = units.find(u => u.name === words[1]);
                        if (!unit.upgraded.find(u => u === globals.statCodes[words[2]])) {
                            unit.upgraded.push(globals.statCodes[words[2]]);
                        }
                        break;
                    default:
                        break;
                }
            }
        });

        this.setState({
            units,
            summons
        });
    }

    uploadFile = (event) => {
        var file = event.target.files[0];
        let turnControllerThis = this;

        let f = file ? file.name.split('.') : [""];
        if (file && f.pop() === "html") {
            var reader = new FileReader();
            reader.onload = function(){
              var text = reader.result;
              turnControllerThis.loadFile(text);
            };
            reader.readAsText(file);
            this.parseFileName(f.pop());
        }
      
    }

    parseFileName = (name) => {
        let words = name.split("_");
        if (words.length === 7) {
            this.setState({
                game: words[3] || "",
                turn: words[5] || "",
                faction: words[6] || ""
            });
        }
    }        

    loadFile = (text) => {
        let { faction } = this.state;
        let lines = text.split("<br>");
        let sections = [];
        let homeRealm = {};
        let factionName = "";
        let factionLogo;

        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].trim();

            let start = lines[i].search("<h3>") === -1 ? lines[i].search("<h2>") : lines[i].search("<h3>");
            if (start !== -1) {
                console.log(lines[i]);
                let end = (lines[i].search("</h3>") === -1 ? lines[i].search("</h2>") : lines[i].search("</h3>")) + 5;
                lines.splice(i + 1, 0, lines[i].substr(end, lines[i].length))
                lines[i] = lines[i].substr(start, end);
                
                let section = lines[i]
                sections.push({
                    i,
                    title: parse(section).text.trim()
                })
            }

            if (lines[i].search("Home Realm") !== -1) {
                let word = lines[i].split(" ")[2];
                let xIndex = word.search("x");
                let yIndex = word.search("y");
                
                homeRealm = {
                    x: parseInt(word.substring(xIndex + 1, yIndex)),
                    y: parseInt(word.substring(yIndex + 1, word.length))
                }
            }

            if (lines[i].search("Faction: ") !== -1) {
                factionName = lines[i].split("Faction: ")[1].trim();
            }

            if (i === 0 && lines[i].search("<img") !== -1) {
                factionLogo = lines[i].substring(lines[i].search('<img src="') + 10, lines[i].length);
                factionLogo = factionLogo.substring(0, factionLogo.search('"'));
            }
        }

        // console.log(sections);

        let unitsIndex = sections.findIndex(section => section.title === "Unit Summary (end of turn view)");

        let unitLines = lines.slice(sections[unitsIndex].i + 1, sections[unitsIndex+1].i - 3);
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
            let history = [];
            for (let i = 0; i < 10; i++) {
                moves.push(".");
                history.push(".");
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
                upgraded: [],
                history
            });
            i++;
        })
        
        let isolationIndex = sections.findIndex(section => section.title === "Cauldronborn Isolation Checks");

        let isolationLines = lines.slice(sections[isolationIndex].i + 1, sections[isolationIndex+1].i);
        
        isolationLines.forEach(line => {
            (units.find(u => u.name === line.split(" ")[0].trim()) || {}).pathHome = true;
        })
        
        let cauldronStrengthIndex = sections.findIndex(section => section.title === "Cauldron Strength");

        let cauldronStrengthLines = lines.slice(sections[cauldronStrengthIndex].i + 1, sections[cauldronStrengthIndex+1].i);
        
        let cauldronStrength = 0;

        cauldronStrengthLines.forEach(line => {
            cauldronStrength = parseInt(line.split(" ")[line.split(" ").length-1].trim());
        })
        
        let summaryIndex = sections.findIndex(section => section.title === "Realmforce Report");

        let summaryLines = lines[sections[summaryIndex].i + 1].split("\n");

        let startingRealmforce = 0;
        
        summaryLines.forEach(line => {
            if (parse(line).childNodes[0].text.search("Realmforce Points end of turn balance") !== -1) {
                startingRealmforce = parseInt(parse(line).childNodes[0].text.split(":")[1].trim().split(" ")[0]);
            }
        })

        let mapIndex = sections.findIndex(section => section.title === "Map (end of turn view)");

        let mapLines = lines.slice(sections[mapIndex].i + 1, (sections[mapIndex+1] || {}).i || lines.length);

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
                                type: (globals.unitTypes.find(u => u.code === mText.split("_")[0]) || {}).name,
                                faction: mText.split("_")[1],
                                location: {
                                    x: row.length,
                                    y: grid.length
                                },
                                initialLocation: {
                                    x: row.length,
                                    y: grid.length
                                },
                                moves: [],
                                history: [],
                                upgraded: []
                            })
                        }
                    }
    
                    let attributes = {};
                    let jumpLabel = "";
                    let text = parse(mapLines[i]).childNodes[1].text.trim().split(" ")[0];
    
                    if (parse(mapLines[i]).childNodes[1].attributes.bgcolor === "#000000") {
                        attributes.blocked = true;
                        text = "?";
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
                        text,
                        attributes,
                        jumpLabel
                    })
                }
            }
        }

        if (row.length > 0) {
            grid.push(row);
        }
        
        let movementIndex = sections.findIndex(section => section.title === "Movement and Combat Summary");

        // console.log(sections[movementIndex]);

        let movementLines = lines.slice(sections[movementIndex].i + 1, (sections[movementIndex+1] || {}).i || lines.length);

        let history = "";
        let inBattle = false;
        let fights = [];
        let fight;
        let win = false;
        movementLines.forEach(line => {
            if (line.search("upgrades") !== -1) return;

            if (win) {
                if (line.search("evolves") !== -1) {
                    fight.monsters[0].evolved = line.split(" to ")[1].split("!")[0]
                }
                win = false;
            }

            if(inBattle) {
                if (line.search("<img") === -1 && line.length) {
                    let words = line.split(" ");
                    if (words[0] === "Your") {
                        let mText = line.split("VS");
                        fight.monsters = [{
                            faction: factionName,
                            type: mText[0].split(" ")[1],
                            name: mText[0].split(" ")[2],
                            health: parseInt(mText[0].split(" ")[4]),
                            power: parseInt(mText[0].split(" ")[9]),
                            skill: parseInt(mText[0].split(" ")[12]),
                            xp: parseInt(mText[0].search("xp") !== -1 ? mText[0].split(" ")[14] : 0),
                            initiative: parseInt(mText[0].split(" ")[mText[0].search("xp") === -1 ? 14 : 16])
                        }, {
                            faction: mText[1].split("hitpoints")[0].trim().split(" ").splice(0, mText[1].split("hitpoints")[0].trim().split(" ").length - 1).reduce((p, c) => p + " " + c, "").trim(),
                            type: mText[1].split("hitpoints")[0].trim().split(" ")[mText[1].split("hitpoints")[0].trim().split(" ").length - 1],
                            health: parseInt(mText[1].split("hitpoints")[1].trim().split(" ")[0]),
                            power: parseInt(mText[1].split("hitpoints")[1].trim().split(" ")[5]),
                            skill: parseInt(mText[1].split("hitpoints")[1].trim().split(" ")[8]),
                            xp: mText[1].search("xp") !== -1 ? parseInt(mText[1].split("hitpoints")[1].trim().split(" ")[10]) : "?",
                            initiative: parseInt(mText[1].split("hitpoints")[1].trim().split(" ")[mText[1].search("xp") === -1 ? 10 : 12])
                        }];
                    } else {
                        let roundText = line.split("Round").slice(1, line.split("Round").length);
                        fight.rounds = [];
                        fight.xp = "";
                        roundText.forEach(r => {
                            let round = {};
                            round.attacks = [];
                            words = r.split("li>");

                            round.number = parseInt(words[0].split("<")[0]);
                            words = words.splice(1, words.length);
                            let attack = {};
                            for (let i = 0; i < words.length; i++) {
                                if (i % 4 === 0) {
                                    if (Object.keys(attack).length) round.attacks.push(attack);
                                    attack = {};
                                    attack.faction = words[i].split("attacks!")[0].trim();
                                    attack.hitRate = parseInt(words[i].split("(")[1].split("%")[0]);
                                    attack.hits = words[i].split(": ")[1].split("(")[0].split(" ");
                                    attack.actualHit = parseInt(words[i].split(": ")[2].split("%")[0]);
                                } else if (i % 2 === 0) {
                                    attack.damage = parseInt(words[i].split("hp")[0].trim().split(" ")[words[i].split("hp")[0].trim().split(" ").length - 1])
                                    if (words[i].search("DEAD") !== -1) {
                                        attack.dead = true;
                                        fight.monsters.find(m => m.faction !== attack.faction.split(" ").splice(0, attack.faction.split(" ").length - 1).reduce((s, w) => s + " " + w, "").trim()).dead = true;
                                        attack.vp = attack.dead ? parseInt(words[i].split("VP")[1].trim().split(" ")[words[i].split("VP")[1].trim().split(" ").length-1]) : "";
                                    }
                                } else if (words[i].search("XP") !== -1) {
                                    fight.xp = parseInt(words[i].trim().split("XP")[1].split(" = ")[1].trim());
                                }
                            }
                            round.attacks.push(attack);
                            fight.rounds.push(round);
                        })
                    }
                }
                if (line.search("DEAD") !== -1) {
                    if (!fight.monsters[0].dead) {
                        win = true;
                    }
                    inBattle = false;
                    fights.push(fight);
                }
            }

            if (line.search("Battle") !== -1) {
                inBattle = true;
                fight = {
                    location: {
                        x: parseInt(line.split(" ")[4].substring(1, line.split(" ")[4].search("y"))),
                        y: parseInt(line.split(" ")[4].substring(line.split(" ")[4].search("y")+1, line.split(" ")[4].length))
                    },
                    impulse: parseInt(line.split(" ")[6])
                };
            }
            history = `${history}\n${line}`
        })

        console.log(fights);

        this.setState({
            text: unitLines,
            sections,
            units,
            grid,
            homeRealm,
            startingRealmforce,
            cauldronStrength,
            factionLogo,
            factionName,
            fights
        });
    }

    selectUnit = (event, target) => {
        const { selectedUnit, faction } = this.state;
        if (target.unit !== selectedUnit && target.unit.faction === faction) {
            this.setState({
                selectedUnit: target.unit
            });
    
            this.setImpulse(0);
        }
    }

    checkColor = (defaultColor, x, y) => {
        const { selectedColor, selectedUnit, destinationColor, colorCycleCount, currentImpulse } = this.state;
        let bg = defaultColor;
        let cursor = "pointer";

        if (bg === "#000000") {
            cursor = "not-allowed"
        }

        let chromaBg = chroma(bg);
        let cyclePoint = colorCycleCount > 1 ? colorCycleCount - 1 : 1 - colorCycleCount;

        if (selectedUnit && selectedUnit.location.x === x && selectedUnit.location.y === y) {
            cursor = "alias";
            bg = chroma.scale([defaultColor, selectedColor])(0.5 + (cyclePoint/2));
            chromaBg = bg;
        } else if (this.isMovable(x, y)) {
            if (currentImpulse !== 10) {
                let moveCount = 0;

                for (let i = 0; i < currentImpulse; i++) {
                    if (selectedUnit.moves[i] !== ".") {
                        moveCount += 1;
                    }
                }

                if (moveCount < selectedUnit.ap + (selectedUnit.upgraded.find(u => u === "ap") ? 1 : 0)) {
                    cursor = "all-scroll"
                    bg = chroma.scale([defaultColor, destinationColor])(cyclePoint);
                    chromaBg = bg;
                }
            }
        }

        let value = (chromaBg.rgb()[0]*0.299 + chromaBg.rgb()[1]*0.587 + chromaBg.rgb()[2]*0.114);
        if (value > 150 || value === 0) {
            return { bg, color: "#000000", cursor };
        }

        return { bg, color: "#ffffff", cursor };
    }

    isMovable = (x, y) => {
        const { selectedUnit, grid, homeRealm } = this.state;

        if (!selectedUnit || (selectedUnit.location.x === x && selectedUnit.location.y === y) || (grid[y][x].attributes.blocked && !this.isAdjacent(selectedUnit.location, { x, y })) || x === 0 || y === 0) {
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
            
            if (grid[y][x].attributes.blocked && !(globals.unitTypes.find(u => u.name === selectedUnit.type).specials || []).find(a => a === "B")) {
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

            if ((unit.moves || []).length) {
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
        if (this.isMovable(x, y) && currentImpulse !== 10) {
            for (let i = 0; i < currentImpulse; i++) {
                if (selectedUnit.moves[i] !== ".") {
                    moveCount += 1;
                }
            }
    
            if  (moveCount < selectedUnit.ap + (selectedUnit.upgraded.find(u => u === "ap") ? 1 : 0)) {
                selectedUnit.moves[currentImpulse] = this.getMoveType(selectedUnit.location, { x, y });
    
                for (let i = currentImpulse + 1; i < 10; i++) {
                    selectedUnit.moves[i] = ".";
                }
                
                if (currentImpulse !== 10) {
                    this.setImpulse(currentImpulse + 1);
                }
            } else {
                this.showCellPopup(x, y);
            }
        } else {
            this.showCellPopup(x, y);
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

    clearMoves = (unit) => {
        const { units } = this.state;

        let u = units.find(u => u.name === unit.name);
        u.moves = u.moves.map(move => ".");

        let newUnits = this.runMoves({ u });

        this.setState({ units: newUnits });
    }

    downloadTurn = () => {
        const { game, turn, faction } = this.state;

        let text = this.generateFile();

        const element = document.createElement("a");
        const file = new Blob([text], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `CoW_Orders_Game_${game}_Turn_${parseInt(turn) + 1}_${faction}.txt`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    generateFile = () => {
        const { units, faction, summons, extraCommands } = this.state;
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

        Object.keys(summons).forEach(key => {
            if (summons[key] > 0) {
                text = `${text}SUM ${summons[key]} ${key}\n`
            }
        })

        text = `${text}${extraCommands}`;

        return text;
    }

    updateSummonCount = (unit, value) => {
        const { summons } = this.state;
        summons[unit.code] = value;
        this.setState({ summons });
    }

    currentRealmforce = () => {
        const { startingRealmforce, units, faction } = this.state;
        let realmforce = startingRealmforce;

        units.filter(unit => unit.faction === faction).forEach(unit => {
            realmforce -= unit.moves.reduce((count, move) => move === "." ? count : count + 1, 0);
            unit.upgraded.forEach(upgrade => {
                realmforce -= upgrade === "power" ? unit[upgrade] + 1 : (unit[upgrade]+1)**2
            })
        })

        return realmforce;
    }

    toggleCombatSimulator = () => {
        this.setState({
            showCombatSimulator: !this.state.showCombatSimulator,
            showCauldron: false
        })
    }

    toggleCauldron = () => {
        this.setState({
            showCauldron: !this.state.showCauldron,
            showCombatSimulator: false
        })
    }

    collapseUnits = () => {
        this.setState({
            unitsCollapsed: !this.state.unitsCollapsed
        })
    }

    updateExtraCommands = (target, data) => {
        this.setState({
            extraCommands: data.value
        })
    }

    cell = (cell, j, i) => {
        const { units, showSprites, faction, homeRealm, grid, selectedUnit } = this.state
        return (
        <td
            className={`${ cell.attributes.jump ? "TurnController-jump-realm" : "" }`}
            style={ { backgroundColor: this.checkColor(cell.color, j, i).bg, ...this.checkColor(cell.color, j, i) } }
            key={`${i}-${j}`}
            onClick={() => this.clickRealm(j, i) }>
                { cell.attributes.home ? <b>{ cell.text }</b> : cell.text }
            <br />
                { units.filter(m => m.location.x === j && m.location.y === i).map(m => {
                    let bg = m.faction === faction ?  grid[homeRealm.y][homeRealm.x].color : cell.color;
                    let sprite = <UnitSprite animated={selectedUnit === m} unitType={m.type} className="TurnController-unit-sprite" color={bg}/>
                    if (showSprites && sprites.units(m.type)) {
                        return <div key={ m.name }>
                            { (m.moves || []).find(move => move !== ".") ? <b>*{sprite}</b>: sprite }
                            </div>
                    }
                    return <div key={ m.name }>
                        { (m.moves || []).find(move => move !== ".") ? <b>{ m.name }</b>: m.name }
                        </div>
                }) }
        </td>)
    }

    toggleShowSprites = () => {
        this.setState({ showSprites: !this.state.showSprites })
    }

    toggleFights = () => {
        this.setState({ showFights: !this.state.showFights })
    }

    toggleUnitsInLimbo = () => {
        this.setState({ showUnitsInLimbo: !this.state.showUnitsInLimbo })
    }

    showCellPopup = (x, y) => {
        const { grid, units } = this.state;

        if (this.state.units.filter(u => u.location.x === x && u.location.y === y).length){
            this.setState({
                showCellPopup: true,
                popupUnits: units.filter(u => u.location.x === x && u.location.y === y),
                popupCellColor: grid[y][x].color
            })
        }
    }

    changeSelectedType = (event, data) => {
        this.setState({
            filteredType: data.value
        })
    }

    render() {
        let { 
            game,
            turn,
            faction,
            units,
            grid,
            selectedUnit,
            currentImpulse,
            startingRealmforce,
            showCombatSimulator,
            showCauldron,
            cauldronStrength,
            summons,
            unitsCollapsed,
            showSprites,
            popupUnits,
            showCellPopup,
            factionLogo,
            homeRealm,
            popupCellColor,
            filteredType,
            showFights,
            fights,
            factionName,
            showUnitsInLimbo
        } = this.state;

        return (
              <div className="TurnController">
                    <div className="TurnController-upload-button">
                        { turn ?
                            <Fragment>
                                <Button
                                    content="Load Turn"
                                    labelPosition="left"
                                    icon="upload"
                                    htmlFor="load"
                                    as="label"
                                    color="yellow"/>
                                <input type="file"
                                    id="load"
                                    hidden
                                    name="load"
                                    onChange={ this.uploadTurnFile }/>
                            </Fragment> :
                            <Fragment>
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
                                <Button
                                    href="/CoW_Results_Game_g7_Turn_3_SOL.html"
                                    download="CoW_Results_Game_g7_Turn_3_SOL.html"
                                    content="Sample File"
                                    labelPosition="left"
                                    icon="download"
                                    as="a"
                                    color="green"/>
                            </Fragment> }
                    </div>
                    { turn && <div className="TurnController-buttons">
                        <div className="TurnController-button">
                            <Popup 
                                position="right center"
                                open={ showCauldron }
                                className="TurnController-cauldron-popup"
                                trigger= {
                                    <Button
                                        circular
                                        icon="dna"
                                        color="blue"
                                        onClick={ this.toggleCauldron } />
                                    }>
                                <Cauldron updateCount={ this.updateSummonCount } summons={ summons } cauldronStrength={cauldronStrength} />
                            </Popup>
                        </div>
                        <div className="TurnController-button">
                            <Popup 
                                position="right center"
                                open={ showFights }
                                trigger= {
                                    <Button
                                        circular
                                        icon="hourglass half"
                                        color="orange"
                                        onClick={ this.toggleFights } />
                                    }>
                                    <div className="TurnController-fights-popup">
                                        { fights.map((f, index) => {
                                            return <FightCard key={`fight-${index}`} fight={f} />;
                                        })}
                                    </div>
                            </Popup>
                        </div>
                        <div className="TurnController-button">
                            <Popup 
                                position="right center"
                                open={ showCombatSimulator }
                                className="TurnController-combat-simulator-popup"
                                trigger= {
                                    <Button
                                        circular
                                        icon="gavel"
                                        color="red"
                                        onClick={ this.toggleCombatSimulator } />
                                    }>
                                <CombatSimulator />
                            </Popup>
                        </div>
                        <div className="TurnController-button">
                            <Modal trigger={
                                        <Button
                                            icon="download"
                                            color="green" />
                                        }>
                                <Modal.Header>Save/Download Turn</Modal.Header>
                                <Modal.Content>
                                    <h3>Extra Commands</h3>
                                    <TextArea onChange={ this.updateExtraCommands }/>
                                </Modal.Content>
                                <Modal.Content>
                                    <Button
                                        icon="download"
                                        content="Save/Download"
                                        color="green"
                                        onClick={ this.downloadTurn } />
                                </Modal.Content>
                            </Modal>
                        </div>
                    </div> }
                    <table className="TurnController-header">
                        <tbody>
                            <tr>
                                <td>
                                    <h1>
                                        <img alt="" className="TurnController-faction-logo" src={factionLogo} />
                                        { game }: Turn { turn } - { factionName } RP: {this.currentRealmforce()}/{startingRealmforce}
                                    </h1>
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
                    <Grid columns={ 3 }>
                        <Grid.Column className={`TurnController-units ${ unitsCollapsed ? "collapsed" : "" }`}>
                            <h2>
                                Units {units.filter(unit => unit.location !== "Limbo" && unit.faction === faction).length}/20
                                <Checkbox toggle label="Sprites" onClick={this.toggleShowSprites}/>
                            </h2>
                            <div>
                                <Dropdown
                                    className="TurnController-unit-type-dropdown"
                                    scrolling
                                    defaultValue="All"
                                    search={(values, search) => values.filter(v => v.value.toLowerCase().search(search.toLowerCase()) !== -1)}
                                    onChange={this.changeSelectedType}
                                    options={[{ key: "All", text: "All", value: "All"}].concat(globals.unitTypes.map(u => {
                                        return { 
                                            key: u.name,
                                            value: u.name,
                                            text: <div><UnitSprite unitType={u.name} animated/>{u.name}</div>
                                        }
                                    }))}/>
                                    <Checkbox toggle label="Limbo" onClick={this.toggleUnitsInLimbo} className="TurnController-showSprites-toggle" />
                            </div>
                            <div>
                                { units.filter(u => u.faction === faction && (filteredType === "All" || u.type === filteredType) && (showUnitsInLimbo || u.location !== "Limbo")).map(u => {
                                    return <UnitCard 
                                                key={u.key} 
                                                unit={u} 
                                                selected={selectedUnit === u}
                                                onClick={ this.selectUnit }
                                                clearMoves={this.clearMoves}
                                                upgradeUnit={this.upgradeUnit}
                                                preview={unitsCollapsed}
                                                showSprites={showSprites}
                                                setImpulse={this.setImpulse}
                                                currentImpulse={currentImpulse} />
                                }) }
                            </div>
                        </Grid.Column>
                        <Grid.Column verticalAlign="middle" className="TurnController-unit-collapse-column">
                            <Button
                                circular
                                size="small"
                                icon={ `chevron ${unitsCollapsed ? "right" : "left"}` }
                                onClick={ this.collapseUnits }/>
                        </Grid.Column>
                        <Grid.Column className={`TurnController-map-column ${ unitsCollapsed ? "expanded" : "" }`} >
                            <div className="TurnController-map">
                                <table className="TurnController-map-table">
                                    <tbody>
                                    {
                                        grid.map((row, i) => {
                                            return (
                                                <tr key={i}>
                                                    {
                                                        row.map((c, j) => this.cell(c, j, i))
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
                    <Modal 
                        className="TurnController-cell-popup" 
                        open={showCellPopup}
                        size="mini"
                        basic
                        onClose={() => this.setState({ showCellPopup: false })}>
                        <Modal.Content>
                            { popupUnits.map(u => {
                                return <UnitCard 
                                            key={`${u.key}-Popup`} 
                                            unit={u} 
                                            selected={selectedUnit === u}
                                            onClick={ this.selectUnit }
                                            clearMoves={this.clearMoves}
                                            upgradeUnit={this.upgradeUnit}
                                            factionColor={u.faction === faction ? grid[homeRealm.y][homeRealm.x].color : popupCellColor}
                                            showSprites
                                            setImpulse={this.setImpulse}
                                            currentImpulse={currentImpulse} />
                            }) }
                        </Modal.Content>
                    </Modal>
              </div>
        );
    }
}

export default TurnController;
