import cx from 'classnames';
import Head from 'next/head';
import React, { useCallback, useState } from 'react';
import styles from '../styles/Home.module.css';

const InputBtn = ({ value, onClick, className = '' }) => {
  return (
    <button
      className={cx(styles.inputBtn, className)}
      onClick={() => onClick(value)}
    >
      {value}
    </button>
  );
};

const ActionBtn = ({ onClick, children }) => {
  return (
    <button className={cx(styles.inputBtn, styles.actionBtn)} onClick={onClick}>
      {children}
    </button>
  );
};

const ACTION_PLUS = 'plus';
const ACTION_RESULT = 'result';
const EMPTY_OP = [0];

const isEmptyOp = (operand) => {
  return operand.length === 1 && operand[0] === 0;
};

const calcResult = (leftOp, input) => {
  const left = parseInt(leftOp.join(''), 10);
  const right = parseInt(input.join(''), 10);
  const result = left + right;

  return `${result}`.split('').map((strNum) => parseInt(strNum, 10));
};

const Calculator = () => {
  const [leftOp, setLeftOp] = useState(EMPTY_OP);
  const [lastActionPressed, setLastActionPressed] = useState(null);
  const [input, setInput] = useState([]);
  const handleInput = useCallback(
    (value) => {
      if (lastActionPressed) {
        setInput([value]);
      } else {
        setInput(input[0] === 0 ? input : [...input, value]);
      }
      setLastActionPressed(null);
    },
    [input, lastActionPressed]
  );
  const handleResult = useCallback(() => {
    if (lastActionPressed === ACTION_RESULT) {
      return;
    }

    setInput(calcResult(leftOp, input));
    setLeftOp(EMPTY_OP);
    setLastActionPressed(ACTION_RESULT);
  }, [leftOp, input, lastActionPressed]);
  const handlePlus = useCallback(() => {
    if (lastActionPressed === ACTION_PLUS) {
      return;
    }

    if (isEmptyOp(leftOp)) {
      setLeftOp(input.length > 0 ? input : EMPTY_OP);
    } else {
      const res = calcResult(leftOp, input);
      setLeftOp(res);
      setInput(res);
    }
    setLastActionPressed(ACTION_PLUS);
  }, [input, leftOp, lastActionPressed]);
  const handleClear = useCallback(() => {
    setInput([]);
    setLeftOp(EMPTY_OP);
    setLastActionPressed(null);
  }, []);

  return (
    <React.Fragment>
      <div className={styles.calcWrapper}>
        <div className={styles.calcView}>{input.join('') || '0'}</div>

        <div className={styles.btnGrid}>
          <InputBtn value={7} onClick={handleInput} />
          <InputBtn value={8} onClick={handleInput} />
          <InputBtn value={9} onClick={handleInput} />
          <InputBtn value={4} onClick={handleInput} />
          <InputBtn value={5} onClick={handleInput} />
          <InputBtn value={6} onClick={handleInput} />
          <InputBtn value={1} onClick={handleInput} />
          <InputBtn value={2} onClick={handleInput} />
          <InputBtn value={3} onClick={handleInput} />
          <ActionBtn onClick={handlePlus}>+</ActionBtn>
          <InputBtn value={0} onClick={handleInput} />
          <ActionBtn onClick={handleResult}>=</ActionBtn>
        </div>
      </div>

      <button className={styles.clearBtn} onClick={handleClear}>
        Clear
      </button>
    </React.Fragment>
  );
};

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Basic calc</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Basic calc</h1>

        <Calculator />
      </main>
    </div>
  );
}
