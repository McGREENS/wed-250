"use client";

import { motion } from "framer-motion";

export const ExploreIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <motion.circle
            cx="11" cy="11" r="7"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
        />
        <motion.path
            d="M20 20L16 16"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
        />
        {/* Floating elements inside to simulate 'finding' */}
        <motion.circle cx="11" cy="11" r="3" fill="currentColor" fillOpacity="0.2"
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
    </svg>
);

export const PlanIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <motion.rect
            x="3" y="4" width="18" height="18" rx="2" ry="2"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1 }}
        />
        <motion.path
            d="M16 2V6"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0, y: -5 }}
            whileInView={{ pathLength: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        />
        <motion.path
            d="M8 2V6"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0, y: -5 }}
            whileInView={{ pathLength: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        />
        <motion.path
            d="M3 10H21"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
        />
        {/* Animated Checkmarks */}
        <motion.path d="M7 14H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 0.4 }} />
        <motion.path d="M7 18H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 1.4, duration: 0.4 }} />
    </svg>
);

export const MatchIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Left piece */}
        <motion.path
            d="M16 5L9 12L16 19"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            initial={{ x: 10, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
        />
        {/* Right piece */}
        <motion.path
            d="M8 5L15 12L8 19"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            initial={{ x: -10, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
        />
        {/* Sparkle in middle */}
        <motion.path
            d="M12 2V22" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.3 }}
            transition={{ delay: 0.8 }}
        />
        <motion.circle cx="12" cy="12" r="2" fill="currentColor"
            initial={{ scale: 0 }}
            whileInView={{ scale: [0, 1.5, 1] }}
            transition={{ delay: 0.6, duration: 0.4 }}
        />
    </svg>
);

export const ManageIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <motion.rect
            x="3" y="3" width="18" height="18" rx="2" ry="2"
            stroke="currentColor" strokeWidth="2"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }}
        />
        <motion.path d="M9 21V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.5 }} />
        <motion.path d="M15 21V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.5 }} />
        <motion.path d="M12 8L12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            initial={{ y: 5, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 1 }} />
        {/* Pie chartish circle */}
        <motion.circle cx="16" cy="7" r="2" stroke="currentColor" strokeWidth="1"
            initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 1.2 }} />
    </svg>
);
