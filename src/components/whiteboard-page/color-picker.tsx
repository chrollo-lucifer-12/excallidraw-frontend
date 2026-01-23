import { Button } from "../ui/button";

const ColorPicker = ({
  title,
  onChangeColor,
  defaultColors,
  defaultValue,
}: {
  title: string;
  onChangeColor: (c: string) => void;
  defaultColors: { name: string; hex: string; class: string }[];
  defaultValue: string;
}) => {
  return (
    <div className="w-full flex flex-col ">
      <h6 className="text-xs">{title}</h6>
      <div className="flex w-full gap-1">
        {defaultColors.map((color, index) => (
          <Button
            key={index}
            className={`${color.class} h-6 w-6 rounded hover:${color.class} ${color.hex === defaultValue ? "border border-blue-500" : ""}`}
            size="sm"
            onClick={() => {
              onChangeColor(color.hex);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
