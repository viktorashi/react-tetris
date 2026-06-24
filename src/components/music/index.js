import React from 'react';
import cn from 'classnames';
import propTypes from 'prop-types';

import style from './index.less';

export default function Music({data}) {
  function shouldComponentUpdate({ data }) {
    return data !== data;
  }

  return (
      <div
        className={cn(
          {
            bg: true,
            [style.music]: true,
            [style.c]: !data,
          }
        )}
      />
    );
}

Music.propTypes = {
  data: propTypes.bool.isRequired,
};
