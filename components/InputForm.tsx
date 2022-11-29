import IconRefresh from "https://deno.land/x/tabler_icons_tsx@0.0.1/tsx/refresh.tsx";
import { forwardRef, Ref } from "preact/compat";
interface Props {
  timer: number;
  value: string;
  ref: any;
  onInputChange: (_: any) => void;
  onKeyDown: (_: any) => void;
}

const InputForm = forwardRef((props: Props, input: Ref<HTMLInputElement>) => {
  return (
    <form class="flex items-center">
      <div class="relative w-full flex ">
        <input
          autoFocus
          type="text"
          ref={input}
          value={props.value}
          onKeyDown={props.onKeyDown}
          onInput={props.onInputChange}
          class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-2xl font-medium rounded-l-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
        />
        <a class="p-3.5 text-lg w-16 text-center font-medium text-black bg-gray-100 border border-gray-300 dark:focus:ring-gray-800">
          {props.timer}
        </a>
        <a
          href="/"
          class="p-3.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <IconRefresh />
        </a>
      </div>
    </form>
  );
});

export default InputForm;
