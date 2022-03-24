import Blob from './Blob.png';
import BlobAnim from './BlobAnim.png';
import Scum from './Scum.png';
import ScumAnim from './ScumAnim.png';
import Mordling from './Mordling.png';
import MordlingAnim from './MordlingAnim.png';
import Skeledog from './Skeledog.png';
import SkeledogAnim from './SkeledogAnim.png';
import Stekelvarken from './Stekelvarken.png';
import Skekelvarken from './Skekelvarken.png';
import SkekelvarkenAnim from './SkekelvarkenAnim.png';
import Shambler from './Shambler.png';
import ShamblerAnim from './ShamblerAnim.png';
import Digger from './Digger.png';
import DiggerAnim from './DiggerAnim.png';
import Spectre from './Spectre.png';
import SpectreAnim from './SpectreAnim.png';
import Shade from './Shade.png';
import ShadeAnim from './ShadeAnim.png';
import GoblinSapper from './Goblin Sapper.png';
import GoblinSapperAnim from './Goblin SapperAnim.png';
import Gabber from './Gabber.png';
import GabberAnim from './GabberAnim.png';
import Brute from './Brute.png';
import BruteAnim from './BruteAnim.png';
import Minotaur from './Minotaur.png';
import MinotaurAnim from './MinotaurAnim.png';
import Raptor from './Raptor.png';
import RaptorAnim from './RaptorAnim.png';

export const units =  {
    Blob,
    BlobAnim,
    Scum,
    ScumAnim,
    Mordling,
    MordlingAnim,
    Skeledog,
    SkeledogAnim,
    Stekelvarken,
    Skekelvarken,
    SkekelvarkenAnim,
    Shambler,
    ShamblerAnim,
    Digger,
    DiggerAnim,
    Spectre,
    SpectreAnim,
    Shade,
    ShadeAnim,
    "Goblin Sapper": GoblinSapper,
    "Goblin SapperAnim": GoblinSapperAnim,
    Gabber,
    GabberAnim,
    Brute,
    BruteAnim,
    Minotaur,
    MinotaurAnim,
    Raptor,
    RaptorAnim
}

export default (type) => {
    return units[type]
}