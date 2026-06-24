import React from 'react';
import propTypes from 'prop-types';

import style from './index.less';
import { blockShape } from '../../unit/const';

const xyCoords = { // 方块在下一个中的坐标
  I: [1, 0],
  L: [0, 0],
  J: [0, 0],
  Z: [0, 0],
  S: [0, 0],
  O: [0, 1],
  T: [0, 0],
};

const empty = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function Next({ data }) {
  const [block, setBlock] = React.useState(empty);

  const build = React.useCallback((type) => {
    const shape = blockShape[type];
    const newBlock = empty.map(e => ([...e]));
    shape.forEach((m, k1) => {
      m.forEach((n, k2) => {
        if (n) {
          newBlock[k1 + xyCoords[type][0]][k2 + xyCoords[type][1]] = 1;
        }
      });
    });
    setBlock(newBlock);
  }, []);

  React.useEffect(() => {
    build(data);
  }, [data, build]);

  return (
    <div className={style.next}>
      {
        block.map((arr, k1) => (
          <div key={k1}>
            {
              arr.map((e, k2) => (
                <b className={e ? 'c' : ''} key={k2} />
              ))
            }
          </div>
        ))
      }
    </div>
  );
}

export default Next;

Next.propTypes = {
  data: propTypes.string,
};
