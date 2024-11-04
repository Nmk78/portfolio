'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { navItems } from './Nav'

// const navItems = [
//   { name: "Home", link: "/" },
//   { name: "Projects", link: "/projects" },
//   { name: "Contact", link: "/contact" },
//   { name: "Management", link: "/management" },
// ];

const socialLinks = [
  { name: "GitHub", link: "https://github.com/Nmk78" },
  // { name: "LinkedIn", link: "#" },
  // { name: "Twitter", link: "#" },
];

const phrases = [
  "Wanna know more?",
  "Interested?",
  "Let's talk.",
];

export default function InteractiveMinimalistFooter() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
    }, 3000) // Change phrase every 3 seconds

    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="py-16 px-4 bg-background relative">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 flex justify-between items-start">
          <div>
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentPhraseIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-gray-400 mb-4"
              >
                {phrases[currentPhraseIndex]}
              </motion.h2>
            </AnimatePresence>
            <a href="mailto:naymyokhant78@gmail.com" className="text-lg text-primary hover:underline">
              naymyokhant78@gmail.com
            </a>
          </div>
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={scrollToTop}
                className="p-2 bg-primary font-thin text-gray-400 rounded-full hover:bg-primary/90 transition-colors"
                aria-label="Scroll to top"
              >
                <ArrowUp size={40} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        <nav className="mb-12">
          <ul className="flex flex-wrap gap-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.link}
                  className="relative group"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.name}
                  </span>
                  {hoveredItem === item.name && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-px bg-foreground"
                      layoutId="underline"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} naymyokhant. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            {socialLinks.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
          
        </div>
      </div>
    </footer>
  )
}