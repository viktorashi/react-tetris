import React from 'react';
import cn from 'classnames';
import propTypes from 'prop-types';

import style from './index.less';

export default function Pause({ data }) {
  const [showPause, setShowPause] = React.useState(false);
  const timeoutRef = React.useRef(null);

  function setShake(bool) {  // 根据props显示闪烁或停止闪烁
    if (bool && !timeoutRef.current) {
      timeoutRef.current = setInterval(() => {
        setShowPause(prev => !prev);
      }, 250);
    }
    if (!bool && timeoutRef.current) {
      clearInterval(timeoutRef.current);
      setShowPause(false);
      timeoutRef.current = null;
    }
  }

  React.useEffect(() => {
    setShake(data);

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [data]);

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
