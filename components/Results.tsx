import { IResult } from "../islands/Typer.tsx";

export default function Results(props: IResult) {
  return (
    <div class="bg-gray-100 p-4 mt-8 max-w-sm rounded">
      <div class="w-full bg-white border rounded-lg shadow-md p-6 dark:bg-gray-800 dark:border-gray-700">
        <h5 class="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
          Your result
        </h5>
        <h1 class="text-3xl text-center font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          <span class="text-transparent bg-clip-text bg-gradient-to-r to-indigo-700 from-purple-400">
            {Math.round(props.correctKeyStrokes / 5)} WPM
          </span>
        </h1>
        <p class="mb-4 text-gray-300 text-center">(words per minute)</p>
        <ul class="my-2  space-y-3">
          <li>
            <div class="flex items-center p-3 text-base font-bold text-indigo-900 rounded-lg bg-indigo-50 hover:bg-indigo-100 group hover:shadow dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white">
              <span class="flex-1 whitespace-nowrap">Keystrokes</span>
              <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-indigo-900 rounded dark:bg-indigo-700 dark:text-indigo-400">
                ({props.correctKeyStrokes} | {props.wrongKeyStrokes}){" "}
                {props.wrongKeyStrokes + props.correctKeyStrokes}
              </span>
            </div>
          </li>
          <li>
            <div class="flex items-center p-3 text-base font-bold text-yellow-900 rounded-lg bg-yellow-50 hover:bg-yellow-100 group hover:shadow dark:bg-yellow-600 dark:hover:bg-yellow-500 dark:text-white">
              <span class="flex-1 whitespace-nowrap">Accuracy</span>
              <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-black rounded dark:bg-yellow-700 dark:text-yellow-400">
                {parseFloat(
                  `${
                    (props.correctKeyStrokes / props.wrongKeyStrokes +
                      props.correctKeyStrokes) *
                    100
                  }`
                ).toFixed(2)}
                %
              </span>
            </div>
          </li>
          <li>
            <div class="flex items-center p-3 text-base font-bold text-green-900 rounded-lg bg-green-50 hover:bg-green-100 group hover:shadow dark:bg-green-600 dark:hover:bg-green-500 dark:text-white">
              <span class="flex-1 whitespace-nowrap">Correct words</span>
              <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-black rounded dark:bg-green-700 dark:text-green-400">
                {props.correctWords}
              </span>
            </div>
          </li>
          <li>
            <div class="flex items-center p-3 text-base font-bold text-red-900 rounded-lg bg-red-50 hover:bg-red-100 group hover:shadow dark:bg-red-600 dark:hover:bg-red-500 dark:text-white">
              <span class="flex-1 whitespace-nowrap">Wrong words</span>
              <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-red-900 rounded dark:bg-red-700 dark:text-red-400">
                {props.wrongWords}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
