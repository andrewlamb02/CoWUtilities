import React, { Fragment }  from 'react';
import { Icon } from "semantic-ui-react"

export let menuLinks = [
    {
        key: 'turn',
        link: '/turn',
        body: (
            <Fragment>
                <div>
                    Turn Controller
                </div>
                <Icon className='Header-icon' name='chess rook'></Icon>
            </Fragment>
        )
    },
    {
        key: 'combat',
        link: '/combat',
        body: (
            <Fragment>
                <div>
                    Combat Simulator
                </div>
                <Icon className='Header-icon' name='gavel'></Icon>
            </Fragment>
        )
    },
    {
        key: 'units',
        link: '/units',
        body: (
            <Fragment>
                <div>
                    Unit Book
                </div>
                <Icon className='Header-icon' name='book'></Icon>
            </Fragment>
        )
    }
]

export let capitals = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
]

export let statCodes = {
    PW: "power",
    SK: "skill",
    AP: "ap"
}

export let unitTypes = [
    {
        name: "Mordling",
        code: "MD",
        level: 1,
        ap: 3,
        power: 1,
        skill: 2,
        cauldronStrength: 0,
        evolvesInto: [{
            unit: "GS",
            xp: 3
        }]
    },
    {
        name: "Scum",
        code: "SC",
        level: 1,
        ap: 2,
        power: 6,
        skill: 1,
        cauldronStrength: 0,
        evolvesInto: [{
            unit: "BB",
            xp: 3
        }]
    },
    {
        name: "Skeledog",
        code: "SK",
        level: 1,
        ap: 5,
        power: 2,
        skill: 1,
        cauldronStrength: 0,
        evolvesInto: [{
            unit: "GB",
            xp: 5
        }, {
            unit: "SD",
            xp: 5
        }]
    },
    // {
    //     name: "Stekelvarken",
    //     code: "SV",
    //     ap: 3,
    //     power: 2,
    //     skill: 1,
    //     cauldronStrength: 0
    // },
    {
        name: "Skekelvarken",
        code: "SV",
        level: 1,
        ap: 3,
        power: 2,
        skill: 1,
        cauldronStrength: 0,
        evolvesInto: [{
            unit: "DG",
            xp: 7
        }]
    },
    {
        name: "Blob",
        code: "BB",
        level: 2,
        ap: 2,
        power: 10,
        skill: 3,
        evolvesInto: [{
            unit: "SH",
            xp: 10
        }]
    },
    {
        name: "Goblin Sapper",
        code: "GS",
        level: 2,
        ap: 4,
        power: 3,
        skill: 4,
        specials: ["C"],
        evolvesInto: [{
            unit: "BR",
            xp: 8
        }]
    },
    {
        name: "Shade",
        code: "SD",
        level: 3,
        ap: 3,
        power: 8,
        skill: 4,
        evolvesInto: [{
            unit: "SP",
            xp: 15
        }]
    },
    {
        name: "Gabber",
        code: "GB",
        level: 3,
        ap: 7,
        power: 3,
        skill: 3,
        evolvesInto: [{
            unit: "RP",
            xp: 12
        }]
    },
    {
        name: "Brute",
        code: "BR",
        level: 4,
        ap: 3,
        power: 12,
        skill: 5,
        evolvesInto: [{
            unit: "MT",
            xp: 15
        }]
    },
    {
        name: "Shambler",
        code: "SH",
        level: 5,
        ap: 3,
        power: 18,
        skill: 4
    },
    {
        name: "Raptor",
        code: "RP",
        level: 5,
        ap: 8,
        power: 10,
        skill: 3
    },
    {
        name: "Spectre",
        code: "SP",
        level: 6,
        ap: 5,
        power: 15,
        skill: 6
    },
    {
        name: "Minotaur",
        code: "MT",
        level: 6,
        ap: 3,
        power: 20,
        skill: 6
    },
    {
        name: "Digger",
        code: "DG",
        level: 6,
        ap: 4,
        power: 10,
        skill: 2,
        specials: ["B"]
    }
]