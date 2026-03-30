import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.01 } : {}}
      className={`glass-card rounded-2xl p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
