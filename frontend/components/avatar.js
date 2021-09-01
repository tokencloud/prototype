import Identicon from 'identicon.js';
var crypto = require('crypto');

export default function Avatar({ uid }) {
  function _generateIcon(uid) {
    var options = {
      foreground: [49, 103, 227, 255], // rgba black
      background: [240, 240, 240, 255],
      margin: 0.2, // 20% margin
      size: 420, // 420px square
      format: 'png', // use SVG instead of PNG
    };
    return new Identicon(
      crypto.randomBytes(15).toString('hex'),
      options
    ).toString();
  }
  return (
    <>
      <img
        className='rounded-full'
        src={`data:image/png;base64,` + _generateIcon(uid)}
        alt=''
      />
    </>
  );
}
