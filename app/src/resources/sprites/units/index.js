import Blob from './Blob.png';
import BlobAnim from './BlobAnim.png';
import Scum from './Scum.png';
import ScumAnim from './ScumAnim.png';
import Mordling from './Mordling.png';
import Skeledog from './Skeledog.png';
import SkeledogAnim from './SkeledogAnim.png';
import Stekelvarken from './Stekelvarken.png';
import Skekelvarken from './Skekelvarken.png';
import SkekelvarkenAnim from './SkekelvarkenAnim.png';
import Shambler from './Shambler.png';
import ShamblerAnim from './ShamblerAnim.png';
import Digger from './Digger.png';
import DiggerAnim from './DiggerAnim.png';

export const units =  {
    Blob,
    BlobAnim,
    Scum,
    ScumAnim,
    Mordling,
    Skeledog,
    SkeledogAnim,
    Stekelvarken,
    Skekelvarken,
    SkekelvarkenAnim,
    Shambler,
    ShamblerAnim,
    Digger,
    DiggerAnim
}

export default (type) => {
    return units[type]
}