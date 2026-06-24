import React from 'react';
import cn from 'classnames';
import propTypes from 'prop-types';

import logoStyle from './index.less';
import { i18n, lan } from '../../unit/const';

function Logo({ cur, reset }) {
  const [styleKey, setStyleKey] = React.useState('r1');
  const [display, setDisplay] = React.useState('none');

  function animate(props) {
    const { cur: currentCur, reset: currentReset } = props;
    clearTimeout(Logo.timeout);
    setStyleKey('r1');
    setDisplay('none');
    if (currentCur || currentReset) {
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
  }, [cur, reset]);

  if (cur) {
    return null;
  }
  return (
    <div className={logoStyle.logo} style={{ display }}>
      <div className={cn({ bg: true, [logoStyle.dragon]: true, [logoStyle[styleKey]]: true })} />
      <p dangerouslySetInnerHTML={{ __html: i18n.titleCenter[lan] }} />
    </div>
  );
}

export default Logo;

Logo.propTypes = {
  cur: propTypes.bool,
  reset: propTypes.bool.isRequired,
};
Logo.timeout = null;
