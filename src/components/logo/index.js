import React from 'react';
import cn from 'classnames';
import propTypes from 'prop-types';

import styles from './index.less';
import { i18n, lan } from '../../unit/const';

export default function Logo({ cur, reset }) {
  const [styleClass, setStyleClass] = React.useState(styles.r1);
  const [display, setDisplay] = React.useState('none');
  const timeoutRef = React.useRef(null);

  const animate = React.useCallback(({ curVal, resetVal }) => {
    clearTimeout(timeoutRef.current);
    setStyleClass(styles.r1);
    setDisplay('none');
    if (curVal || resetVal) {
      setDisplay('none');
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
        setStyleClass(styles[m + 2]);
        set(() => {
          setStyleClass(styles[m + 1]);
          if (func) {
            func();
          }
        }, delay2);
      }, delay1);
    };

    const run = (func) => { // 开始跑步啦！
      set(() => {
        setStyleClass(styles[m + 4]);
        set(() => {
          setStyleClass(styles[m + 3]);
          count++;
          if (count === 10 || count === 20 || count === 30) {
            m = m === 'r' ? 'l' : 'r';
          }
          if (count < 40) {
            run(func);
            return;
          }
          setStyleClass(styles[m + 1]);
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
            setStyleClass(styles[m + 2]);
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
  }, []);

  React.useEffect(() => {
    animate({ curVal: cur, resetVal: reset });
  }, [cur, reset, animate]);

  if (cur) {
    return null;
  }
  return (
    <div className={styles.logo} style={{ display }}>
      <div className={cn({ bg: true, [styles.dragon]: true, [styleClass]: true })} />
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
