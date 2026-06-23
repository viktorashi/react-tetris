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
  const timeoutRef = React.useRef(null);

  const onChange = React.useCallback(({ curVal, pointVal, maxVal }) => {
    clearInterval(timeoutRef.current);
    if (curVal) { // 在游戏进行中
      setLabel(pointVal >= maxVal ? ZDF : DF);
      setNumber(pointVal);
    } else { // 游戏未开始
      const toggle = () => { // 最高分与上轮得分交替出现
        setLabel(SLDF);
        setNumber(pointVal);
        timeoutRef.current = setTimeout(() => {
          setLabel(ZDF);
          setNumber(maxVal);
          timeoutRef.current = setTimeout(toggle, 3000);
        }, 3000);
      };

      if (pointVal !== 0) { // 如果为上轮没玩, 也不用提示了
        toggle();
      } else {
        setLabel(ZDF);
        setNumber(maxVal);
      }
    }
  }, []);

  React.useEffect(() => {
    onChange({ curVal: cur, pointVal: point, maxVal: max });
  }, [cur, point, max, onChange]);

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

