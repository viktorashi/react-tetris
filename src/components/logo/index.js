import React from 'react';
import cn from 'classnames';
import propTypes from 'prop-types';

import style from './index.less';
import { i18n, lan } from '../../unit/const';

export default function Logo({cur, reset}) {
  const [style, setStyle] = React.useState(style.r1);
  const [display, setDisplay] = React.useState('none');

  function componentWillMount() {
    animate(this.props);
  }

  function componentWillReceiveProps(nextProps) {
    if ( // 只有在游戏进入开始, 或结束时 触发改变
      (
        [cur, nextProps.cur].indexOf(false) !== -1 &&
        (cur !== nextProps.cur)
      ) ||
      (reset !== nextProps.reset)
    ) {
      animate(nextProps);
    }
  }

  function shouldComponentUpdate({ cur, reset }) {
    return cur !== cur || reset !== reset || !cur;
  }

  function animate({ cur, reset }) {
    clearTimeout(Logo.timeout);
    this.setState({
      style: style.r1,
      display: 'none',
    });
    if (cur || reset) {
      setDisplay('none');
      return;
    }

    let m = 'r'; // 方向
    let count = 0;

    const set = (func, delay) => {
      if (!func) {
        return;
      }
      Logo.timeout = setTimeout(func, delay);
    };

    const show = (func) => { // 显示
      set(() => {
        setDisplay('block');
        if (func) {
          func();
        }
      }, 150);
    };

    const hide = (func) => { // 隐藏
      set(() => {
        setDisplay('none');
        if (func) {
          func();
        }
      }, 150);
    };

    const eyes = (func, delay1, delay2) => { // 龙在眨眼睛
      set(() => {
        setStyle(style[m + 2]);
        set(() => {
          setStyle(style[m + 1]);
          if (func) {
            func();
          }
        }, delay2);
      }, delay1);
    };

    const run = (func) => { // 开始跑步啦！
      set(() => {
        setStyle(style[m + 4]);
        set(() => {
          setStyle(style[m + 3]);
          count++;
          if (count === 10 || count === 20 || count === 30) {
            m = m === 'r' ? 'l' : 'r';
          }
          if (count < 40) {
            run(func);
            return;
          }
          this.setState({ style: style[m + 1] });
          if (func) {
            set(func, 4000);
          }
        }, 100);
      }, 100);
    };

    const dra = () => {
      count = 0;
      eyes(() => {
        eyes(() => {
          eyes(() => {
            this.setState({ style: style[m + 2] });
            run(dra);
          }, 150, 150);
        }, 150, 150);
      }, 1000, 1500);
    };

    show(() => { // 忽隐忽现
      hide(() => {
        show(() => {
          hide(() => {
            show(() => {
              dra(); // 开始运动
            });
          });
        });
      });
    });
  }

  if (cur) {
      return null;
    }
    return (
      <div className={style.logo} style={{ display: display }}>
        <div className={cn({ bg: true, [style.dragon]: true, [style]: true })} />
        <p dangerouslySetInnerHTML={{ __html: i18n.titleCenter[lan] }} />
      </div>
    );
}

Logo.propTypes = {
  cur: propTypes.bool,
  reset: propTypes.bool.isRequired,
};
Logo.statics = {
  timeout: null,
};
