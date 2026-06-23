import React from 'react';
import cn from 'classnames';
import propTypes from 'prop-types';

import style from './index.less';

const render = (data) => (
  <div className={style.number}>
    {
      data.map((e, k) => (
        <span className={cn(['bg', style[`s_${e}`]])} key={k} />
      ))
    }
  </div>
);

const formate = (num) => (
  num < 10 ? `0${num}`.split('') : `${num}`.split('')
);


export default function Number({ time, number, length }) {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    if (!time) {
      return undefined;
    }
    const clock = () => {
      Number.timeInterval = setTimeout(() => {
        setCurrentTime(new Date());
        clock();
      }, 1000);
    };
    clock();

    return () => {
      if (Number.timeInterval) {
        clearTimeout(Number.timeInterval);
      }
    };
  }, [time]);

  if (time) { // 右下角时钟
    const now = currentTime;
    const hour = formate(now.getHours());
    const min = formate(now.getMinutes());
    const sec = now.getSeconds() % 2;
    const t = hour.concat(sec ? 'd' : 'd_c', min);
    return (render(t));
  }

  const num = `${number}`.split('');
  for (let i = 0, len = length - num.length; i < len; i++) {
    num.unshift('n');
  }
  return (render(num));
}

Number.statics = {
  timeInterval: null,
  time_count: null,
};

Number.propTypes = {
  number: propTypes.number,
  length: propTypes.number,
  time: propTypes.bool,
};

Number.defaultProps = {
  length: 6,
};
