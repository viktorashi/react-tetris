import React from 'react';
import propTypes from 'prop-types';

import style from './index.less';
import Button from './button';
import store from '../../store';
import todo from '../../control/todo';
import { i18n, lan } from '../../unit/const';

export default function Keyboard({ keyboard, filling }) {
  const domRefsRef = React.useRef({});

  React.useEffect(() => {
    const touchEventCatch = {};
    const mouseDownEventCatch = {};

    document.addEventListener('touchstart', (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
    }, true);

    // 解决issue: https://github.com/chvin/react-tetris/issues/24
    document.addEventListener('touchend', (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
    }, true);

    // 阻止双指放大
    document.addEventListener('gesturestart', (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
    }, true);

    Object.keys(todo).forEach((key) => {
      const domElement = domRefsRef.current[`dom_${key}`];
      if (!domElement) return;

      const domNode = domElement.dom || domElement;

      domNode.addEventListener('mousedown', () => {
        if (touchEventCatch[key] === true) {
          return;
        }
        todo[key].down(store);
        mouseDownEventCatch[key] = true;
      }, true);

      domNode.addEventListener('mouseup', () => {
        if (touchEventCatch[key] === true) {
          touchEventCatch[key] = false;
          return;
        }
        todo[key].up(store);
        mouseDownEventCatch[key] = false;
      }, true);

      domNode.addEventListener('mouseout', () => {
        if (mouseDownEventCatch[key] === true) {
          todo[key].up(store);
        }
      }, true);

      domNode.addEventListener('touchstart', () => {
        touchEventCatch[key] = true;
        todo[key].down(store);
      }, true);

      domNode.addEventListener('touchend', () => {
        todo[key].up(store);
      }, true);
    });

    return () => {
      // Cleanup listeners if needed
    };
  }, []);

  return (
    <div
      className={style.keyboard}
      style={{
        marginTop: 20 + filling,
      }}
    >
      <Button
        color="blue"
        size="s1"
        top={0}
        left={374}
        label={i18n.rotation[lan]}
        arrow="translate(0, 63px)"
        position
        active={keyboard.get('rotate')}
        ref={(c) => { domRefsRef.current.dom_rotate = c; }}
      />
      <Button
        color="blue"
        size="s1"
        top={180}
        left={374}
        label={i18n.down[lan]}
        arrow="translate(0,-71px) rotate(180deg)"
        active={keyboard.get('down')}
        ref={(c) => { domRefsRef.current.dom_down = c; }}
      />
      <Button
        color="blue"
        size="s1"
        top={90}
        left={284}
        label={i18n.left[lan]}
        arrow="translate(60px, -12px) rotate(270deg)"
        active={keyboard.get('left')}
        ref={(c) => { domRefsRef.current.dom_left = c; }}
      />
      <Button
        color="blue"
        size="s1"
        top={90}
        left={464}
        label={i18n.right[lan]}
        arrow="translate(-60px, -12px) rotate(90deg)"
        active={keyboard.get('right')}
        ref={(c) => { domRefsRef.current.dom_right = c; }}
      />
      <Button
        color="blue"
        size="s0"
        top={100}
        left={52}
        label={`${i18n.drop[lan]} (SPACE)`}
        active={keyboard.get('drop')}
        ref={(c) => { domRefsRef.current.dom_space = c; }}
      />
      <Button
        color="red"
        size="s2"
        top={0}
        left={196}
        label={`${i18n.reset[lan]}(R)`}
        active={keyboard.get('reset')}
        ref={(c) => { domRefsRef.current.dom_r = c; }}
      />
      <Button
        color="green"
        size="s2"
        top={0}
        left={106}
        label={`${i18n.sound[lan]}(S)`}
        active={keyboard.get('music')}
        ref={(c) => { domRefsRef.current.dom_s = c; }}
      />
      <Button
        color="green"
        size="s2"
        top={0}
        left={16}
        label={`${i18n.pause[lan]}(P)`}
        active={keyboard.get('pause')}
        ref={(c) => { domRefsRef.current.dom_p = c; }}
      />
    </div>
  );
}

Keyboard.propTypes = {
  filling: propTypes.number.isRequired,
  keyboard: propTypes.object.isRequired,
};
