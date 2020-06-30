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
        ap: 3,
        power: 1,
        skill: 2,
        cauldronStrength: 0,
        specials: ["B"]
    },
    {
        name: "Scum",
        code: "SC",
        ap: 2,
        power: 6,
        skill: 1,
        cauldronStrength: 0
    },
    {
        name: "Skeledog",
        code: "SK",
        ap: 5,
        power: 2,
        skill: 1,
        cauldronStrength: 0
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
        ap: 3,
        power: 2,
        skill: 1,
        cauldronStrength: 0
    },
    {
        name: "Blob",
        code: "BB",
        ap: 2,
        power: 10,
        skill: 3
    },
    {
        name: "Goblin Sapper",
        code: "GS",
        ap: 4,
        power: 3,
        skill: 4
    },
    {
        name: "Shade",
        code: "SD",
        ap: 3,
        power: 8,
        skill: 4
    },
    {
        name: "Gabber",
        code: "GB",
        ap: 7,
        power: 3,
        skill: 3
    },
    {
        name: "Brute",
        code: "BR",
        ap: 3,
        power: 12,
        skill: 5
    },
    {
        name: "Shambler",
        code: "SH",
        ap: 3,
        power: 18,
        skill: 4
    },
    {
        name: "Raptor",
        code: "RP",
        ap: 8,
        power: 10,
        skill: 3
    },
    {
        name: "Spectre",
        code: "SP",
        ap: 5,
        power: 15,
        skill: 6
    },
    {
        name: "Minotaur",
        code: "MT",
        ap: 3,
        power: 20,
        skill: 6
    },
    {
        name: "Digger",
        code: "DG",
        ap: 4,
        power: 10,
        skill: 2,
        specials: ["B"]
    }
]