interface Props {
  word: string;
  isSelected: boolean;
  isCorrect: boolean;
}

export default function Word(props: Props) {
  const { word, isSelected, isCorrect } = props;
  const textColor = isCorrect ? "green" : isCorrect === false ? "red" : "gray";
  const backgroundColor = isSelected ? "bg-gray-100" : "bg-white";
  return (
    <div
      class={`text-3xl font-medium py-2 rounded col-span-1 ${backgroundColor}`}
    >
      <span class={`${`text-${textColor}-500`}`}>{word}</span>
    </div>
  );
}
