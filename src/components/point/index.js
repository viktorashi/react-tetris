import React from 'react';
import propTypes from 'prop-types';

import Number from '../number';
import { i18n, lan } from '../../unit/const';

const DF = i18n.point[lan];
const ZDF = i18n.highestScore[lan];
const SLDF = i18n.lastRound[lan];

export default function Point({ cur, point, max }) {
  const [label, setLabel] = React.useState('');
  const [number, setNumber] = React.useState(0);

  function onChange({ cur: currentCur, point: currentPoint, max: currentMax }) {
    clearInterval(Point.timeout);
    if (currentCur) { // 在游戏进行中
      setLabel(currentPoint >= currentMax ? ZDF : DF);
      setNumber(currentPoint);
    } else { // 游戏未开始
      const toggle = () => { // 最高分与上轮得分交替出现
        setLabel(SLDF);
        setNumber(currentPoint);
        Point.timeout = setTimeout(() => {
          setLabel(ZDF);
          setNumber(currentMax);
          Point.timeout = setTimeout(toggle, 3000);
        }, 3000);
      };

      if (currentPoint !== 0) { // 如果为上轮没玩, 也不用提示了
        toggle();
      } else {
        setLabel(ZDF);
        setNumber(currentMax);
      }
    }
  }

  React.useEffect(() => {
    onChange({ cur, point, max });
  }, [cur, point, max]);

  return (
    <div>
      <p>{ label }</p>
      <Number number={number} />
    </div>
  );
}

Point.statics = {
  timeout: null,
};

Point.propTypes = {
  cur: propTypes.bool,
  max: propTypes.number.isRequired,
  point: propTypes.number.isRequired,
};

