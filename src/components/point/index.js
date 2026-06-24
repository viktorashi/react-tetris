import React from 'react';
import propTypes from 'prop-types';

import Number from '../number';
import { i18n, lan } from '../../unit/const';

const DF = i18n.point[lan];
const ZDF = i18n.highestScore[lan];
const SLDF = i18n.lastRound[lan];

export default function Point({cur, point, max, props}) {
  const [label, setLabel] = React.useState('');
  const [number, setNumber] = React.useState(0);

  function componentWillMount() {
    onChange(this.props);
  }

  function componentWillReceiveProps(nextProps) {
    onChange(nextProps);
  }

  function shouldComponentUpdate({ cur, point, max }) {
    const props = this.props;
    return cur !== props.cur || point !== props.point || max !== props.max || !props.cur;
  }

  function onChange({ cur, point, max }) {
    clearInterval(Point.timeout);
    if (cur) { // 在游戏进行中
      this.setState({
        label: point >= max ? ZDF : DF,
        number: point,
      });
    } else { // 游戏未开始
      const toggle = () => { // 最高分与上轮得分交替出现
        this.setState({
          label: SLDF,
          number: point,
        });
        Point.timeout = setTimeout(() => {
          this.setState({
            label: ZDF,
            number: max,
          });
          Point.timeout = setTimeout(toggle, 3000);
        }, 3000);
      };

      if (point !== 0) { // 如果为上轮没玩, 也不用提示了
        toggle();
      } else {
        this.setState({
          label: ZDF,
          number: max,
        });
      }
    }
  }

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

