import LemonIcon from "https://deno.land/x/tabler_icons_tsx@0.0.1/tsx/lemon-2.tsx";

type Props = {
  active: string;
};

export default function Header({ active }: Props) {
  return (
    <div class="bg-gray-50 w-full rounded py-6 px-8 flex flex-col md:flex-row gap-4">
      <div class="flex items-center flex-1">
        <LemonIcon color={"#6366f1"}/>
        <div class="text-2xl text-indigo-500 ml-1 font-bold">Typer</div>
      </div> 
    </div>
  );
}
