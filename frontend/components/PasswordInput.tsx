"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

// Campo de senha com botão para mostrar ou esconder o que foi digitado
export default function PasswordInput({ className = "", ...props }: Props) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`${className} pr-12`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Esconder senha" : "Mostrar senha"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-500 hover:text-indigo-600"
      >
        <Icon aria-hidden="true" className="h-5 w-5" />
      </button>
    </div>
  );
}
