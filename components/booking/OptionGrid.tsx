"use client";

import { motion } from "framer-motion";

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface Props {
  options: Option[];
  value?: string | null;
  onSelect: (value: string) => void;
  multiSelect?: boolean;
  selectedValues?: string[];
}

export default function OptionGrid({ options, value, onSelect, multiSelect, selectedValues }: Props) {
  return (
    <div className="option-grid">
      {options.map((opt, i) => {
        const selected = multiSelect ? (selectedValues ?? []).includes(opt.value) : value === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`option-btn ${selected ? "selected" : ""}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="font-medium">{opt.label}</div>
            {opt.description && <div className="mt-0.5 text-[13px]" style={{ color: "var(--text-faint)" }}>{opt.description}</div>}
          </motion.button>
        );
      })}
    </div>
  );
}
