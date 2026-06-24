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


export default function Number({time, number, length}) {
  const [time_count, setTime_count] = React.useState(false);
  const [time, setTime] = React.useState(new Date());

  function componentWillMount() {
    if (!time) {
      return;
    }
    const clock = () => {
      const count = +Number.timeInterval;
      Number.timeInterval = setTimeout(() => {
        this.setState({
          time: new Date(),
          time_count: count, // 用来做 shouldComponentUpdate 优化
        });
        clock();
      }, 1000);
    };
    clock();
  }

  function shouldComponentUpdate({ number }) {
    if (time) { // 右下角时钟
      if (time_count !== Number.time_count) {
        if (time_count !== false) {
          Number.time_count = time_count; // 记录clock上一次的缓存
        }
        return true;
      }
      return false; // 经过判断这次的时间已经渲染, 返回false
    }
    return number !== number;
  }

  if (time) { // 右下角时钟
      const now = time;
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
