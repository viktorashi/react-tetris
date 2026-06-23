import React from 'react';
import cn from 'classnames';
import propTypes from 'prop-types';

import style from './index.less';
import { i18n, lan } from '../../unit/const';

export default function Logo({ cur, reset }) {
  const [displayStyle, setDisplayStyle] = React.useState(style.r1);
  const [display, setDisplay] = React.useState('none');
  const countRef = React.useRef(0);
  const mRef = React.useRef('r');

  function animate({ cur: currentCur, reset: currentReset }) {
    clearTimeout(Logo.timeout);
    setDisplayStyle(style.r1);
    setDisplay('none');

    if (currentCur || currentReset) {
      return;
    }

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
        setDisplayStyle(style[mRef.current + 2]);
        set(() => {
          setDisplayStyle(style[mRef.current + 1]);
          if (func) {
            func();
          }
        }, delay2);
      }, delay1);
    };

    const run = (func) => { // 开始跑步啦！
      set(() => {
        setDisplayStyle(style[mRef.current + 4]);
        set(() => {
          setDisplayStyle(style[mRef.current + 3]);
          countRef.current++;
          if (countRef.current === 10 || countRef.current === 20 || countRef.current === 30) {
            mRef.current = mRef.current === 'r' ? 'l' : 'r';
          }
          if (countRef.current < 40) {
            run(func);
            return;
          }
          setDisplayStyle(style[mRef.current + 1]);
          if (func) {
            set(func, 4000);
          }
        }, 100);
      }, 100);
    };

    const dra = () => {
      countRef.current = 0;
      eyes(() => {
        eyes(() => {
          eyes(() => {
            setDisplayStyle(style[mRef.current + 2]);
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

  React.useEffect(() => {
    animate({ cur, reset });
  }, [cur, reset]);

  if (cur) {
    return null;
  }
  return (
    <div className={style.logo} style={{ display }}>
      <div className={cn({ bg: true, [style.dragon]: true, [displayStyle]: true })} />
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
