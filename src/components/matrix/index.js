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

  function getResult(matrixVal = matrix) {
    const curVal = cur;
    const shape = curVal && curVal.shape;
    const xy = curVal && curVal.xy;

    let resultMatrix = matrixVal;
    const clearLinesVal = clearLines;
    if (clearLinesVal) {
      const colorVal = animateColor;
      clearLinesVal.forEach((index) => {
        resultMatrix = resultMatrix.set(index, List([
          colorVal,
          colorVal,
          colorVal,
          colorVal,
          colorVal,
          colorVal,
          colorVal,
          colorVal,
          colorVal,
          colorVal,
        ]));
      });
    } else if (shape) {
      shape.forEach((m, k1) => (
        m.forEach((n, k2) => {
          if (n && xy.get(0) + k1 >= 0) { // 竖坐标可以为负
            let line = resultMatrix.get(xy.get(0) + k1);
            let color;
            if (line.get(xy.get(1) + k2) === 1 && !clearLinesVal) { // 矩阵与方块重合
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
  }

  function clearAnimate() {
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
  }

  function over(nextProps) {
    let overStateVal = getResult(nextProps.matrix);
    setOverState(overStateVal);

    const exLine = (index) => {
      if (index <= 19) {
        overStateVal = overStateVal.set(19 - index, List(fillLine));
      } else if (index >= 20 && index <= 39) {
        overStateVal = overStateVal.set(index - 20, List(blankLine));
      } else {
        states.overEnd();
        return;
      }
      setOverState(overStateVal);
    };

    for (let i = 0; i <= 40; i++) {
      t(exLine.bind(null, i), 40 * (i + 1));
    }
  }

  React.useEffect(() => {
    const clears = isClear(matrix);
    const overs = reset;
    setClearLines(clears);
    setIsOver(overs);
    if (clears && !clearLines) {
      clearAnimate();
    }
    if (!clears && overs && !isOver) {
      over({ matrix, cur, reset: overs });
    }
  }, [matrix, cur, reset, clearLines, isOver]);

  let resultMatrix;
  if (isOver) {
    resultMatrix = overState;
  } else {
    resultMatrix = getResult();
  }

  return (
    <div className={style.matrix}>{
      resultMatrix && resultMatrix.map((p, k1) => (<p key={k1}>
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
