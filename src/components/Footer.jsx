import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const MagneticButton = ({ children, className = "" }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;
    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default function Footer() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const y = useTransform(smoothProgress, [0, 1], [-100, 0]);

    return (
        <footer
            ref={containerRef}
            className="relative w-full h-auto bg-[#050505] text-white overflow-hidden flex flex-col justify-between pt-20 pb-10 px-6 lg:px-20"
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-amber-600/5 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="relative z-10 flex-grow flex flex-col justify-center">

                <div className="mb-24 lg:mb-32">
                    <motion.h2
                        initial={{ y: 100, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true }}
                        className="text-[12vw] leading-[0.8] font-serif font-light tracking-tighter text-white/90 mix-blend-difference"
                    >
                        Let's start <br />
                        <span className="italic text-amber-500/80">something</span> <br />
                        <span className="ml-[10vw]">timeless.</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-white/10 pt-16">

                    <div className="lg:col-span-4 flex flex-col justify-between h-full">
                        <div>
                            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-8">Get in touch</h4>
                            <MagneticButton className="inline-block">
                                <a href="mailto:hello@chocolatier.com" className="text-2xl lg:text-3xl font-light hover:text-amber-500 transition-colors duration-300">
                                    hello@chocolatier.com
                                </a>
                            </MagneticButton>
                        </div>
                        <div className="mt-12 lg:mt-0">
                            <address className="not-italic text-white/60 font-light leading-relaxed">
                                12 Rue de la Paix<br />
                                75002 Paris, France
                            </address>
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-4">Menu</h4>
                        {["Home", "Collections", "Ingredients", "About"].map((item, i) => (
                            <MagneticButton key={item} className="w-fit">
                                <button
                                    onClick={() => {
                                        const element = document.getElementById(item.toLowerCase());
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" });
                                        }
                                    }}
                                    className="text-4xl lg:text-5xl font-serif text-white/80 hover:text-white hover:italic transition-all duration-300 block text-left"
                                >
                                    {item}
                                </button>
                            </MagneticButton>
                        ))}
                    </div>

                    <div className="lg:col-span-4 flex flex-col justify-between">
                        <div>
                            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-8">Socials</h4>
                            <div className="flex flex-wrap gap-x-8 gap-y-4">
                                {["Instagram", "LinkedIn", "Pinterest", "Twitter"].map((social) => (
                                    <MagneticButton key={social} className="inline-block">
                                        <a href="#" className="text-lg text-white/60 hover:text-amber-500 transition-colors duration-300 border-b border-transparent hover:border-amber-500">
                                            {social}
                                        </a>
                                    </MagneticButton>
                                ))}
                            </div>
                        </div>

                        <div className="mt-16">
                            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-6">Newsletter</h4>
                            <div className="relative border-b border-white/20 pb-2 flex items-center">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full bg-transparent outline-none text-white placeholder-white/20 text-lg"
                                />
                                <button className="text-amber-500 uppercase text-xs font-bold tracking-widest hover:text-white transition-colors">
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-end md:items-center mt-24 pt-8 border-t border-white/5">
                <h1 className="text-[10vw] md:text-[4vw] font-serif leading-none text-white/5 select-none absolute bottom-0 left-0 pointer-events-none">
                    CHOCOLATIER
                </h1>

                <div className="flex gap-8 text-xs font-mono uppercase tracking-widest text-white/30 z-20">
                    <span>© {new Date().getFullYear()}</span>
                    <Link to="/" className="hover:text-white transition-colors">Privacy</Link>
                    <Link to="/" className="hover:text-white transition-colors">Terms</Link>
                </div>

                <MagneticButton className="z-20 mt-8 md:mt-0">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 group"
                    >
                        <span className="transform -rotate-90 group-hover:-translate-y-1 transition-transform duration-300">→</span>
                    </button>
                </MagneticButton>
            </div>
        </footer>
    );
}
