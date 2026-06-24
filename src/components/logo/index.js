import React from 'react';
import cn from 'classnames';
import propTypes from 'prop-types';

import style from './index.less';
import { i18n, lan } from '../../unit/const';

export default function Logo({ cur, reset }) {
  const [styleKey, setStyleKey] = React.useState('r1');
  const [displayMode, setDisplayMode] = React.useState('none');
  const timeoutRef = React.useRef(null);

  function animate({ cur: curVal, reset: resetVal }) {
    clearTimeout(timeoutRef.current);
    setStyleKey('r1');
    setDisplayMode('none');

    if (curVal || resetVal) {
      setDisplayMode('none');
      return;
    }

    let m = 'r'; // 方向
    let count = 0;

    const set = (func, delay) => {
      if (!func) {
        return;
      }
      timeoutRef.current = setTimeout(func, delay);
    };

    const show = (func) => { // 显示
      set(() => {
        setDisplayMode('block');
        if (func) {
          func();
        }
      }, 150);
    };

    const hide = (func) => { // 隐藏
      set(() => {
        setDisplayMode('none');
        if (func) {
          func();
        }
      }, 150);
    };

    const eyes = (func, delay1, delay2) => { // 龙在眨眼睛
      set(() => {
        setStyleKey(m + 2);
        set(() => {
          setStyleKey(m + 1);
          if (func) {
            func();
          }
        }, delay2);
      }, delay1);
    };

    const run = (func) => { // 开始跑步啦！
      set(() => {
        setStyleKey(m + 4);
        set(() => {
          setStyleKey(m + 3);
          count++;
          if (count === 10 || count === 20 || count === 30) {
            m = m === 'r' ? 'l' : 'r';
          }
          if (count < 40) {
            run(func);
            return;
          }
          setStyleKey(m + 1);
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
            setStyleKey(m + 2);
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
  }, []);

  React.useEffect(() => {
    // Only animate on cur or reset changes
    if ((
      [cur, false].indexOf(false) !== -1 &&
      cur !== undefined
    ) ||
    (reset !== undefined)) {
      animate({ cur, reset });
    }
  }, [cur, reset]);

  if (cur) {
    return null;
  }
  return (
    <div className={style.logo} style={{ display: displayMode }}>
      <div className={cn({ bg: true, [style.dragon]: true, [style[styleKey]]: true })} />
      <p dangerouslySetInnerHTML={{ __html: i18n.titleCenter[lan] }} />
    </div>
  );
}

Logo.propTypes = {
  cur: propTypes.bool,
  reset: propTypes.bool.isRequired,
};
