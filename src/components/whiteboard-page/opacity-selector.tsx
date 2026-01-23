import { Slider } from "@/components/ui/slider";

const OpacitySelector = ({
  onOpacityChange,
}: {
  onOpacityChange: (w: number) => void;
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <h6 className="text-xs font-medium">Opacity</h6>

      <Slider
        defaultValue={[100]}
        max={100}
        min={0}
        step={1}
        onValueChange={(value) => {
          const opacity = value[0] / 100;
          onOpacityChange(opacity);
        }}
      />
    </div>
  );
};

export default OpacitySelector;
