import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { scrollY } = useScroll();
    const headerBlur = useTransform(scrollY, [0, 100], [0, 12]);
    const headerHeight = useTransform(scrollY, [0, 100], ["6rem", "4.5rem"]);
    const logoScale = useTransform(scrollY, [0, 100], [1, 0.9]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [menuOpen]);

    const navItems = ["Home", "Collections", "Ingredients", "About", "Contact"];

    const handleScroll = (id) => {
        setMenuOpen(false);
        const element = document.getElementById(id.toLowerCase());
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const containerVariants = {
        hidden: { y: -100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const menuVariants = {
        closed: {
            opacity: 0,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        open: {
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const linkVariants = {
        closed: { y: 60, opacity: 0 },
        open: (i) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: i * 0.1 + 0.3,
                duration: 1,
                ease: [0.22, 1, 0.36, 1]
            }
        })
    };

    return (
        <>
            <motion.header
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    height: headerHeight,
                    backgroundColor: scrolled ? "rgba(10, 10, 10, 0.8)" : "transparent",
                    backdropFilter: `blur(${headerBlur}px)`,
                    WebkitBackdropFilter: `blur(${headerBlur}px)`,
                    borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid transparent",
                }}
                className="fixed top-0 left-0 w-full z-50 flex items-center justify-center transition-colors duration-500"
            >
                <div className="w-full max-w-[1920px] px-8 lg:px-16 xl:px-24 flex justify-between items-center relative">

                    <motion.div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-50"
                        style={{ scale: logoScale }}
                    >
                        <Link to="/" className="block group" onClick={() => setMenuOpen(false)}>
                            <h1 className="text-2xl lg:text-3xl font-serif text-white tracking-[0.2em] font-light group-hover:tracking-[0.25em] transition-all duration-500">
                                CHOCOLATIER
                            </h1>
                            <div className="w-1 h-1 bg-amber-500 rounded-full mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                    </motion.div>

                    <button
                        onClick={() => setMenuOpen(true)}
                        className="absolute right-8 lg:right-16 xl:right-24 text-white p-2 group z-50"
                    >
                        <div className="flex flex-col items-end gap-1.5">
                            <span className="w-8 h-[1px] bg-white transition-all duration-300 group-hover:w-10" />
                            <span className="w-6 h-[1px] bg-white transition-all duration-300 group-hover:w-10" />
                            <span className="w-4 h-[1px] bg-white transition-all duration-300 group-hover:w-10" />
                        </div>
                    </button>
                </div>
            </motion.header>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 bg-[#050505] z-[100] flex flex-col items-center justify-center"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.03),transparent_70%)] pointer-events-none" />

                        <button
                            onClick={() => setMenuOpen(false)}
                            className="absolute top-8 right-8 lg:top-12 lg:right-16 xl:right-24 text-white/50 hover:text-white transition-colors p-4 z-20"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <nav className="flex flex-col items-center gap-6 lg:gap-10 relative z-10">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item}
                                    custom={index}
                                    variants={linkVariants}
                                    className="overflow-hidden"
                                >
                                    <a
                                        href={`#${item.toLowerCase()}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleScroll(item);
                                        }}
                                        className="text-6xl lg:text-8xl font-serif text-white/80 hover:text-amber-500 transition-colors duration-500 block tracking-tight"
                                    >
                                        {item}
                                    </a>
                                </motion.div>
                            ))}
                        </nav>

                        <motion.div
                            custom={navItems.length}
                            variants={linkVariants}
                            className="mt-16 lg:mt-20 relative z-10"
                        >
                            <button className="px-12 py-4 border border-white/20 text-white text-sm uppercase tracking-[0.25em] hover:bg-white hover:text-black transition-all duration-500">
                                Shop Collection
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.8, duration: 1 } }}
                            className="absolute bottom-12 text-white/30 text-xs tracking-[0.2em] uppercase"
                        >
                            Est. 1984 • Paris, France
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
