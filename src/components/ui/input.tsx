import react from "react";
import styles from "../../style/Input.module.scss";

type Props = {
  name: string;
  placeholder?: string;
  type?: string;
}

export default function Input({ name, placeholder, type }: Props) {
  return (
    <input
      name={name}
      type={type || "text"}
      placeholder={placeholder}
      required
      className={`${styles.input} border-b-2 border-blue-900`}
    />
  );
}