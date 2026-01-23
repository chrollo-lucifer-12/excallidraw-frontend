import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";

const ZoomControls = () => {
  return (
    <ButtonGroup
      orientation="horizontal"
      aria-label="Media controls"
      className="h-fit"
    >
      <Button variant="outline" size="icon">
        <PlusIcon />
      </Button>
      <Button variant="outline" size="icon">
        <MinusIcon />
      </Button>
    </ButtonGroup>
  );
};

export default ZoomControls;
