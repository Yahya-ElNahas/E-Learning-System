import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const ReturnHomeButtonComponent: React.FC = () => {
  return (
    <motion.div
      className="absolute top-4 left-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href="/">
        <motion.button
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:from-blue-700 hover:to-red-700 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Home</span>
        </motion.button>
      </Link>
    </motion.div>
  )
}

export default ReturnHomeButtonComponent

