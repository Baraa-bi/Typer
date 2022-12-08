interface Props {
  word: string;
  isSelected: boolean;
  isCorrect: boolean;
}

export default function Word(props: Props) {
  const { word, isSelected, isCorrect } = props;
  const textColor = isCorrect ? "green" : isCorrect === false ? "red" : "black";
  const backgroundColor = isSelected
    ? "bg-gray-100 transition scale-110 duration-200 ease-in-out"
    : "bg-white";
  return (
    <div
      class={`text-2xl font-medium rounded py-2 col-span-1 ${backgroundColor}`}
    >
      <span class={`${`text-${textColor}-500`}`}>{word}</span>
    </div>
  );
}
