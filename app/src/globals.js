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
    "Y",,
    "Z"
]

export let unitTypes = [
    {
        name: "Mordling",
        ap: 3,
        power: 1,
        skill: 2
    },
    {
        name: "Scum",
        ap: 2,
        power: 6,
        skill: 1
    },
    {
        name: "Skeledog",
        ap: 5,
        power: 2,
        skill: 1
    },
    {
        name: "Stekelvarken",
        ap: 3,
        power: 2,
        skill: 1
    },
    {
        name: "Blob",
        ap: 2,
        power: 10,
        skill: 3
    },
    {
        name: "Goblin Sapper",
        ap: 4,
        power: 3,
        skill: 4
    },
    {
        name: "Shade",
        ap: 3,
        power: 8,
        skill: 4
    },
    {
        name: "Gabber",
        ap: 7,
        power: 3,
        skill: 3
    },
    {
        name: "Brute",
        ap: 3,
        power: 12,
        skill: 5
    },
    {
        name: "Shambler",
        ap: 3,
        power: 18,
        skill: 4
    },
    {
        name: "Raptor",
        ap: 8,
        power: 10,
        skill: 3
    },
    {
        name: "Spectre",
        ap: 5,
        power: 15,
        skill: 6
    },
    {
        name: "Minotaur",
        ap: 3,
        power: 20,
        skill: 6
    },
    {
        name: "Digger",
        ap: 4,
        power: 10,
        skill: 2
    }
]