import React from 'react';
import cn from 'classnames';
import propTypes from 'prop-types';

import style from './index.less';

export default function Pause({ data }) {
  const [showPause, setShowPause] = React.useState(false);

  const setShake = React.useCallback((bool) => {  // 根据props显示闪烁或停止闪烁
    if (bool && !Pause.timeout) {
      Pause.timeout = setInterval(() => {
        setShowPause(prev => !prev);
      }, 250);
    }
    if (!bool && Pause.timeout) {
      clearInterval(Pause.timeout);
      setShowPause(false);
      Pause.timeout = null;
    }
  }, []);

  React.useEffect(() => {
    setShake(data);
  }, [data, setShake]);

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
