'use client';
import { motion } from "framer-motion";

export default function TestAnim() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        className="w-32 h-32 rounded-full bg-pink-400"
        animate={{ x: [0, 100, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </div>
  );
}
