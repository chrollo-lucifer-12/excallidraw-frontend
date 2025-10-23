import { Input } from "@/components/ui/input";
import { Eye, EyeClosed, Mail } from "lucide-react";
import { useState } from "react";

type FormInputProps = {
  type: "email" | "password" | "text";
  id: string;
  name: string;
  placeholder: string;
};

const FormInput = ({ id, name, placeholder, type }: FormInputProps) => {
  const [typeOfInput, setTypeOfInput] = useState(type);

  return (
    <div className="flex items-center gap-2 rounded-md border border-input bg-background px-2 hover:border- focus-within:ring-2 focus-within:ring-gray-400 hover:border-gray-400 hover:border transition duration-300">
      {typeOfInput === "email" ? (
        <Mail size={16} className="text-muted-foreground" />
      ) : typeOfInput === "password" ? (
        <Eye
          onClick={() => setTypeOfInput("text")}
          size={16}
          className="text-muted-foreground cursor-pointer"
        />
      ) : (
        <EyeClosed
          onClick={() => setTypeOfInput("password")}
          size={16}
          className="text-muted-foreground cursor-pointer"
        />
      )}
      <Input
        type={typeOfInput}
        id={id}
        name={name}
        placeholder={placeholder}
        className="flex-1 border-none bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:outline-none"
      />
    </div>
  );
};

export default FormInput;
