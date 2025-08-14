import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Test() {
  const [show, setShow] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef(null);

  // Whenever show changes, recalculate height
  useEffect(() => {
    if (contentRef.current) {
      if (show) {
        setHeight(`${contentRef.current.scrollHeight}px`);
      } else {
        setHeight("0px");
      }
    }
  }, [show]);

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={() => setShow((prev) => !prev)}
        style={{ marginBottom: 10 }}
      >
        Toggle "test"
      </button>

      {/* Collapsible container */}
      <motion.div
        animate={{ height }}
        transition={{ duration: 0.3 }}
        style={{
          overflow: "hidden",
          background: "#f9f9f9",
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      >
        <AnimatePresence initial={false}>
          {show && (
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ padding: 20 }}
            >
              test
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
