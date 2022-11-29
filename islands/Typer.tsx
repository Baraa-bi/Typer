import { useCallback, useMemo, useReducer, useRef } from "preact/hooks";
import useInterval from "../hooks/useInterval.ts";
import IconRefresh from "https://deno.land/x/tabler_icons_tsx@0.0.1/tsx/refresh.tsx";
import Results from "../components/Results.tsx";
import Word from "../components/Word.tsx";
import InputForm from "../components/InputForm.tsx";

interface TyperProps {
  words: Array<string>;
}
const INTERVAL = 1000;
const DURATION_IN_SECONDS = 60;
const RENDERED_WORD_COUNT = 16;

const ActionTypes = {
  SET_WORDS: "WORDS",
  SET_COUNT: "SET_COUNT",
  SET_TIMER: "SET_TIMER",
  INIT_STATE: "INIT_STATE",
  SET_TYPED_WORD: "SET_TYPED_WORD",
  SET_WORD_INDEX: "SET_WORD_INDEX",
  SET_TYPED_WORDS: "SET_TYPED_WORDS",
  SET_RESULT_INFO: "SET_RESULT_INFO",
  SET_SHOULD_START_TIMER: "SET_SHOULD_START_TIMER",
};

const INIT_STATE = {
  count: 0,
  timer: DURATION_IN_SECONDS,
  shouldStartTimer: false,
  words: [],
  wordIndex: 0,
  typedWords: [],
  typedWord: "",
  result: {
    show: false,
    wrongWords: 0,
    correctWords: 0,
    wrongKeyStrokes: 0,
    correctKeyStrokes: 0,
  },
};

interface IState {
  count: number;
  timer: number;
  result: IResult;
  typedWord: string;
  wordIndex: number;
  words: Array<string>;
  shouldStartTimer: boolean;
  typedWords: Array<boolean>;
}

interface Action {
  type: string;
  payload?: any;
}

export interface IResult {
  show: boolean;
  wrongWords: number;
  correctWords: number;
  wrongKeyStrokes: number;
  correctKeyStrokes: number;
}

const reducer = (state: IState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_COUNT:
      return { ...state, count: action.payload };
    case ActionTypes.SET_TIMER:
      return { ...state, timer: action.payload };
    case ActionTypes.SET_SHOULD_START_TIMER:
      return { ...state, shouldStartTimer: action.payload };
    case ActionTypes.SET_WORDS:
      return { ...state, words: action.payload };
    case ActionTypes.SET_TYPED_WORD:
      return { ...state, typedWord: action.payload };
    case ActionTypes.SET_TYPED_WORDS:
      return { ...state, typedWords: action.payload };
    case ActionTypes.SET_WORD_INDEX:
      return { ...state, wordIndex: action.payload };
    case ActionTypes.SET_RESULT_INFO:
      return { ...state, result: action.payload };
    case ActionTypes.INIT_STATE:
      return { ...state, ...action.payload };
    default:
      throw new Error();
  }
};

export default function Typer(props: TyperProps) {
  const input = useRef<any>();
  const [state, dispatch] = useReducer(reducer, {
    ...INIT_STATE,
    words: props.words.slice(0, RENDERED_WORD_COUNT),
  });

  const setTimer = (timer: number) => {
    dispatch({ type: ActionTypes.SET_TIMER, payload: timer });
  };

  const setResultInfo = (result: IResult) => {
    dispatch({ type: ActionTypes.SET_RESULT_INFO, payload: result });
  };

  const setShouldStartTimer = (showTimer: boolean) => {
    dispatch({ type: ActionTypes.SET_SHOULD_START_TIMER, payload: showTimer });
  };

  const setTypedWord = (word: string) => {
    dispatch({ type: ActionTypes.SET_TYPED_WORD, payload: word });
  };

  const setTypedWords = (words: Array<boolean>) => {
    dispatch({ type: ActionTypes.SET_TYPED_WORDS, payload: words });
  };

  const setWordIndex = (index: number) => {
    dispatch({ type: ActionTypes.SET_WORD_INDEX, payload: index });
  };

  const setWords = (words: Array<string>) => {
    dispatch({ type: ActionTypes.SET_WORDS, payload: words });
  };

  const setCount = (count: number) => {
    dispatch({ type: ActionTypes.SET_COUNT, payload: count });
  };

  const resetState = () => {
    const words = props.words.slice(0, RENDERED_WORD_COUNT);
    dispatch({
      type: ActionTypes.INIT_STATE,
      payload: { ...INIT_STATE, words },
    });
  };

  const getTypedWordState = useCallback(
    (index: number) => {
      return state.typedWords[state.count * RENDERED_WORD_COUNT + index];
    },
    [state.typedWords, state.count]
  );

  useInterval(
    () => {
      if (state.timer) return setTimer(state.timer - 1);
      input?.current?.blur?.();
      resetState();
      const correctWords = state.typedWords.filter((w) => w).length;
      const wrongWords = state.typedWords.length - correctWords;
      setResultInfo({ ...state.result, show: true, correctWords, wrongWords });
    },
    state.shouldStartTimer ? INTERVAL : null
  );

  const onKeyDown = (e: any) => {
    if (!state.shouldStartTimer) setShouldStartTimer(true);

    if (e.code === "Space") {
      setTypedWord("");
      if (state.wordIndex === state.words.length - 1) {
        const newWords = [...state.typedWords];
        newWords[state.count * RENDERED_WORD_COUNT] =
          state.words[state.wordIndex] === state.typedWord;
        setTypedWords(newWords);
        setWords(
          props.words.slice(
            (state.count + 1) * RENDERED_WORD_COUNT,
            (state.count + 2) * RENDERED_WORD_COUNT
          )
        );
        setCount(state.count + 1);
        return setWordIndex(0);
      }
      const newWords = [...state.typedWords];
      newWords[state.count * RENDERED_WORD_COUNT + state.wordIndex] =
        state.words[state.wordIndex] === state.typedWord;
      setTypedWords(newWords);
      setWordIndex(state.wordIndex + 1);
    }
  };

  const onInputChange = (e: any) => {
    if (e.data != " ") {
      if (e.data) {
        const isCorrectKey = state.words[state.wordIndex].startsWith(
          e.target.value
        );
        setResultInfo({
          ...state.result,
          show: false,
          ...(isCorrectKey
            ? { correctKeyStrokes: state.result.correctKeyStrokes + 1 }
            : {
                wrongKeyStrokes: state.result.wrongKeyStrokes + 1,
              }),
        });
      }
      setTypedWord(e?.target?.value);
    }
  };

  const renderWords = useMemo(() => {
    return state.words.map((word: string, idx: number) => {
      const typedWordState = getTypedWordState(idx);
      return (
        <Word
          key={idx}
          word={word}
          isCorrect={typedWordState}
          isSelected={state.wordIndex === idx}
        />
      );
    });
  }, [state]);

  return (
    <div>
      <div class="bg-white grid grid-flow-row-dense md:grid-cols-8 grid-cols-2 grid-rows-2 text-center rounded-lg drop-shadow-lg border border-gray-200 my-3 w-full p-4">
        {renderWords}
      </div>
      <InputForm
        ref={input}
        timer={state.timer}
        onKeyDown={onKeyDown}
        value={state.typedWord}
        onInputChange={onInputChange}
      />
      {state.result.show && <Results {...state.result} />}
    </div>
  );
}
