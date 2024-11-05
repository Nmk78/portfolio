// app/404.tsx
"use client"; // This line makes the component a client component
import { motion } from "framer-motion";
import { IconHome, IconCode, IconMessage } from "@tabler/icons-react"; // Adjust import based on where your icons are


const Custom404 = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-4xl font-semibold text-gray-800 mb-8">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-md mx-auto">
          Oops! The page you&apos;re looking for seems to have vanished into the
          digital abyss.
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {/* Hard-coded navigation items */}
        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center px-6 py-3 bg-red-100 text-red-700 font-semibold hover:bg-red-300 transition-colors"
        >
          <motion.div
            className="p-2"
            whileHover={{ scale: 2, rotate: 10, color: "#d33" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
          >
            Home
          </motion.span>
        </motion.a>

        <motion.a
          href="/project"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center px-6 py-3 bg-red-100 text-red-700 font-semibold hover:bg-red-300 transition-colors"
        >
          <motion.div
            className="p-2"
            whileHover={{ scale: 2, rotate: 10, color: "#d33" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <IconCode className="h-4 w-4 text-neutral-500 dark:text-white" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
          >
            Projects
          </motion.span>
        </motion.a>

        <motion.a
          href="/contact"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center px-6 py-3 bg-red-100 text-red-700 font-semibold hover:bg-red-300 transition-colors"
        >
          <motion.div
            className="p-2"
            whileHover={{ scale: 2, rotate: 10, color: "#d33" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
          >
            Contact
          </motion.span>
        </motion.a>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-gray-500 text-sm"
      >
        Lost? Try refreshing your perspective (and maybe your browser too).
      </motion.p>
    </div>
  );
};

export default Custom404;
