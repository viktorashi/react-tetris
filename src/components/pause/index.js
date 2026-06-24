import React from 'react';
import cn from 'classnames';
import propTypes from 'prop-types';

import style from './index.less';

export default function Pause({data}) {
  const [showPause, setShowPause] = React.useState(false);
  React.useEffect(() => {
    setShake(data);
  }, []);

  function componentWillReceiveProps({ data }) {
    setShake(data);
  }

  function shouldComponentUpdate({ data }) {
    if (data) { // 如果暂停了, 不会有太多的dispatch, 考虑到闪烁效果, 直接返回true
      return true;
    }
    return data !== data;
  }

  function setShake(bool) {  // 根据props显示闪烁或停止闪烁
    if (bool && !Pause.timeout) {
      Pause.timeout = setInterval(() => {
        setShowPause(!showPause);
      }, 250);
    }
    if (!bool && Pause.timeout) {
      clearInterval(Pause.timeout);
      setShowPause(false);
      Pause.timeout = null;
    }
  }

  return (
      <div
        className={cn(
          {
            bg: true,
            [style.pause]: true,
            [style.c]: showPause,
          }
        )}
      />
    );
}

Pause.statics = {
  timeout: null,
};

Pause.propTypes = {
  data: propTypes.bool.isRequired,
};

Pause.defaultProps = {
  data: false,
};
