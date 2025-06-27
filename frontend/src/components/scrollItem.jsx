import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const ScrollItem = ({ children, styles, onClick, hoverEffect = false }) => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 });

  return (
    <motion.div
      onClick={onClick}
      ref={ref}
      className={styles}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
      whileHover={hoverEffect ? { scale: 1.06 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};


export default ScrollItem;
