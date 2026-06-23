import React from 'react';
import { List } from 'immutable';
import classnames from 'classnames';
import propTypes from 'prop-types';

import style from './index.less';
import { isClear } from '../../unit/';
import { fillLine, blankLine } from '../../unit/const';
import states from '../../control/states';

const t = setTimeout;

export default function Matrix({ matrix, cur, reset }) {
  const [clearLines, setClearLines] = React.useState(false);
  const [animateColor, setAnimateColor] = React.useState(2);
  const [isOver, setIsOver] = React.useState(false);
  const [overState, setOverState] = React.useState(null);

  const getResult = React.useCallback((propsMatrix, propsCur, propsClearLines, propsAnimateColor) => {
    const shape = propsCur && propsCur.shape;
    const xy = propsCur && propsCur.xy;

    let resultMatrix = propsMatrix || matrix;
    if (propsClearLines) {
      propsClearLines.forEach((index) => {
        resultMatrix = resultMatrix.set(index, List([
          propsAnimateColor || animateColor,
          propsAnimateColor || animateColor,
          propsAnimateColor || animateColor,
          propsAnimateColor || animateColor,
          propsAnimateColor || animateColor,
          propsAnimateColor || animateColor,
          propsAnimateColor || animateColor,
          propsAnimateColor || animateColor,
          propsAnimateColor || animateColor,
          propsAnimateColor || animateColor,
        ]));
      });
    } else if (shape) {
      shape.forEach((m, k1) => (
        m.forEach((n, k2) => {
          if (n && xy.get(0) + k1 >= 0) { // 竖坐标可以为负
            let line = resultMatrix.get(xy.get(0) + k1);
            let color;
            if (line.get(xy.get(1) + k2) === 1 && !propsClearLines) { // 矩阵与方块重合
              color = 2;
            } else {
              color = 1;
            }
            line = line.set(xy.get(1) + k2, color);
            resultMatrix = resultMatrix.set(xy.get(0) + k1, line);
          }
        })
      ));
    }
    return resultMatrix;
  }, [matrix, cur, clearLines, animateColor]);

  const clearAnimate = React.useCallback(() => {
    const anima = (callback) => {
      t(() => {
        setAnimateColor(0);
        t(() => {
          setAnimateColor(2);
          if (typeof callback === 'function') {
            callback();
          }
        }, 100);
      }, 100);
    };
    anima(() => {
      anima(() => {
        anima(() => {
          t(() => {
            states.clearLines(matrix, clearLines);
          }, 100);
        });
      });
    });
  }, [matrix, clearLines]);

  const over = React.useCallback((nextMatrix) => {
    let resultOverState = getResult(nextMatrix, cur, clearLines, animateColor);
    setOverState(resultOverState);

    const exLine = (index) => {
      if (index <= 19) {
        resultOverState = resultOverState.set(19 - index, List(fillLine));
      } else if (index >= 20 && index <= 39) {
        resultOverState = resultOverState.set(index - 20, List(blankLine));
      } else {
        states.overEnd();
        return;
      }
      setOverState(resultOverState);
    };

    for (let i = 0; i <= 40; i++) {
      t(exLine.bind(null, i), 40 * (i + 1));
    }
  }, [cur, clearLines, animateColor, getResult]);

  React.useEffect(() => {
    const clears = isClear(matrix);
    const overs = reset;
    setClearLines(clears);
    setIsOver(overs);
    if (clears && !clearLines) {
      clearAnimate();
    }
    if (!clears && overs && !isOver) {
      over(matrix);
    }
  }, [matrix, reset, clearLines, isOver, clearAnimate, over]);

  let displayMatrix;
  if (isOver) {
    displayMatrix = overState;
  } else {
    displayMatrix = getResult(matrix, cur, clearLines, animateColor);
  }

  return (
    <div className={style.matrix}>{
        displayMatrix.map((p, k1) => (<p key={k1}>
          {
            p.map((e, k2) => <b
              className={classnames({
                c: e === 1,
                d: e === 2,
              })}
              key={k2}
            />)
          }
        </p>))
    }
    </div>
  );
}

Matrix.propTypes = {
  matrix: propTypes.object.isRequired,
  cur: propTypes.object,
  reset: propTypes.bool.isRequired,
};
