import { useEffect, useMemo, useReducer, useState } from "preact/hooks";
import useInterval from "../hooks/useInterval.ts";
import IconRefresh from "https://deno.land/x/tabler_icons_tsx@0.0.1/tsx/refresh.tsx";
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
  shouldStartTimer: boolean;
  words: Array<string>;
  wordIndex: number;
  typedWords: Array<boolean>;
  typedWord: string;
  result: {
    show: boolean;
    correctKeyStrokes: number;
    wrongKeyStrokes: number;
    correctWords: number;
    wrongWords: number;
  };
}

interface Action {
  type: string;
  payload?: any;
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
  const [state, dispatch] = useReducer(reducer, {
    ...INIT_STATE,
    words: props.words.slice(0, RENDERED_WORD_COUNT),
  });

  useInterval(
    () => {
      if (state.timer)
        return dispatch({
          type: ActionTypes.SET_TIMER,
          payload: state.timer - 1,
        });
      dispatch({
        type: ActionTypes.INIT_STATE,
        payload: {
          ...INIT_STATE,
          words: props.words.slice(0, RENDERED_WORD_COUNT),
        },
      });
      const correctWords = state.typedWords.filter((w) => w === true).length;
      const wrongWords = state.typedWords.length - correctWords;
      dispatch({
        type: ActionTypes.SET_RESULT_INFO,
        payload: { ...state.result, show: true, correctWords, wrongWords },
      });
    },
    state.shouldStartTimer ? INTERVAL : null
  );

  const onKeyDown = (e: any) => {
    if (!state.shouldStartTimer) {
      dispatch({ type: ActionTypes.SET_SHOULD_START_TIMER, payload: true });
    }
    if (e.code === "Space") {
      dispatch({ type: ActionTypes.SET_TYPED_WORD, payload: "" });
      if (state.wordIndex === state.words.length - 1) {
        const newWords = [...state.typedWords];
        newWords[state.count * RENDERED_WORD_COUNT] =
          state.words[state.wordIndex] === state.typedWord;
        dispatch({
          type: ActionTypes.SET_TYPED_WORDS,
          payload: newWords,
        });
        dispatch({
          type: ActionTypes.SET_WORDS,
          payload: props.words.slice(
            (state.count + 1) * RENDERED_WORD_COUNT,
            (state.count + 2) * RENDERED_WORD_COUNT
          ),
        });
        dispatch({ type: ActionTypes.SET_COUNT, payload: state.count + 1 });
        return dispatch({ type: ActionTypes.SET_WORD_INDEX, payload: 0 });
      }
      const newWords = [...state.typedWords];
      newWords[state.count * RENDERED_WORD_COUNT + state.wordIndex] =
        state.words[state.wordIndex] === state.typedWord;
      dispatch({
        type: ActionTypes.SET_TYPED_WORDS,
        payload: newWords,
      });
      dispatch({
        type: ActionTypes.SET_WORD_INDEX,
        payload: state.wordIndex + 1,
      });
    }
  };

  const onInputChange = (e: any) => {
    if (e.data != " ") {
      if (e.data) {
        const isCorrectKey = state.words[state.wordIndex].startsWith(
          e.target.value
        );

        dispatch({
          type: ActionTypes.SET_RESULT_INFO,
          payload: {
            ...state.result,
            ...(isCorrectKey
              ? { correctKeyStrokes: state.result.correctKeyStrokes + 1 }
              : {
                  wrongKeyStrokes: state.result.wrongKeyStrokes + 1,
                }),
          },
        });
      }
      dispatch({ type: ActionTypes.SET_TYPED_WORD, payload: e?.target?.value });
    }
  };

  const renderWords = useMemo(() => {
    return state.words.map((word: string, idx: number) => {
      return (
        <div
          key={idx}
          class={`text-3xl p-2 rounded col-span-1
          ${
            state.typedWords[state.count * RENDERED_WORD_COUNT + idx]
              ? "text-green-500"
              : state.typedWords[state.count * RENDERED_WORD_COUNT + idx] ===
                false
              ? "text-red-500"
              : "text-black"
          } 
          ${state.wordIndex === idx ? "bg-gray-100" : "bg-white"}`}
        >
          {word}
        </div>
      );
    });
  }, [state]);

  return (
    <div>
      <div class="bg-white grid grid-flow-row-dense grid-cols-8 grid-rows-2 gap-1 text-center rounded-lg drop-shadow-lg border border-gray-200 my-3 w-full p-4">
        {renderWords}
      </div>
      <form class="flex items-center">
        <div class="relative w-full flex ">
          <input
            onKeyDown={onKeyDown}
            onInput={onInputChange}
            value={state.typedWord}
            class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-l-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            autoFocus
            type="text"
          />
          <a class="p-3.5 text-lg  font-medium text-black bg-gray-100 border border-gray-300 dark:focus:ring-gray-800">
            {state.timer}
          </a>
          <a
            href="/"
            class="p-3.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <IconRefresh />
          </a>
        </div>
      </form>

      {state.result.show && (
        <div class="bg-gray-100 p-4 mt-8 max-w-sm rounded">
          <div class="w-full bg-white border rounded-lg shadow-md sm:p-6 dark:bg-gray-800 dark:border-gray-700">
            <h5 class="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
              Your result
            </h5>

            <h1 class="text-3xl text-center font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              <span class="text-transparent bg-clip-text bg-gradient-to-r to-indigo-700 from-purple-400">
                {Math.round(state.result.correctKeyStrokes / 5)} WPM
              </span>
            </h1>
            <p class="mb-4 text-gray-300 text-center">(words per minute)</p>
            <ul class="my-2  space-y-3">
              <li>
                <div class="flex items-center p-3 text-base font-bold text-indigo-900 rounded-lg bg-indigo-50 hover:bg-indigo-100 group hover:shadow dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white">
                  <span class="flex-1 whitespace-nowrap">Keystrokes</span>
                  <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-indigo-900 rounded dark:bg-indigo-700 dark:text-indigo-400">
                    ({state.result.correctKeyStrokes} |{" "}
                    {state.result.wrongKeyStrokes}){" "}
                    {state.result.wrongKeyStrokes +
                      state.result.correctKeyStrokes}
                  </span>
                </div>
              </li>
              <li>
                <div class="flex items-center p-3 text-base font-bold text-green-900 rounded-lg bg-green-50 hover:bg-green-100 group hover:shadow dark:bg-green-600 dark:hover:bg-green-500 dark:text-white">
                  <span class="flex-1 whitespace-nowrap">Correct words</span>
                  <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-black rounded dark:bg-green-700 dark:text-green-400">
                    {state.result.correctWords}
                  </span>
                </div>
              </li>
              <li>
                <div class="flex items-center p-3 text-base font-bold text-red-900 rounded-lg bg-red-50 hover:bg-red-100 group hover:shadow dark:bg-red-600 dark:hover:bg-red-500 dark:text-white">
                  <span class="flex-1 whitespace-nowrap">Wrong words</span>
                  <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-red-900 rounded dark:bg-red-700 dark:text-red-400">
                    {state.result.wrongWords}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
