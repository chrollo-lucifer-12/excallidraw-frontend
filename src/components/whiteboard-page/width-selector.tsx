import { useState } from "react";

const WidthSelector = ({
  onWidthChange,
  width,
}: {
  onWidthChange: (w: number) => void;
  width: number;
}) => {
  const [active, setActive] = useState<number>(1);

  const widths = [1, 2, 4];

  return (
    <div className="w-full flex flex-col gap-2">
      <h6 className="text-xs">Stroke width</h6>

      <div className="flex gap-2">
        {widths.map((w) => {
          const isActive = active === w;
          return (
            <button
              key={w}
              onClick={() => {
                setActive(w);
                onWidthChange(w);
              }}
              className={
                "h-10 w-10 rounded-lg flex items-center justify-center " +
                (isActive
                  ? "bg-indigo-200 border border-indigo-400"
                  : "bg-gray-100 border border-gray-200")
              }
            >
              <div
                className="bg-black"
                style={{
                  width: w === 1 ? 8 : w === 2 ? 12 : 18,
                  height: 2,
                  borderRadius: 999,
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WidthSelector;
