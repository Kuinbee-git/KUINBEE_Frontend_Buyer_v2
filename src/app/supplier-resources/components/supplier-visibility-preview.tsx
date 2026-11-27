import { useId } from "react";
import styles from "./suppliers-value.module.css";

const options = [
  { label: "Public", description: "Shown in marketplace discovery" },
  { label: "Unlisted", description: "Removed from marketplace discovery" },
  { label: "Private", description: "Kept out of the public catalogue" },
];

export function SupplierVisibilityPreview() {
  const group = useId();

  return (
    <fieldset className={styles.visibility}>
      <legend className="sr-only">Try a collection visibility setting</legend>
      <div className={styles.scale}>
        {options.map(({ label, description }, index) => (
          <label key={label} className={styles.stop}>
            <input
              className="sr-only"
              type="radio"
              name={group}
              value={label}
              defaultChecked={index === 0}
              aria-labelledby={group + label + "-label"}
              aria-describedby={group + label}
            />
            <span id={group + label + "-label"} className={styles.stopName}>
              {label}
            </span>
            <span className={styles.readout} id={group + label}>
              {description}
            </span>
          </label>
        ))}
        <span aria-hidden="true" className={styles.indicator} />
      </div>
    </fieldset>
  );
}
