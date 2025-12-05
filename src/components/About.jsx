import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

export default function About() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const y = useTransform(smoothProgress, [0, 1], [100, -100]);
    const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.8,
                ease: [0.2, 0.65, 0.3, 0.9],
            },
        }),
    };

    const RevealText = ({ children, delay = 0 }) => {
        const words = String(children).trim().split(/\s+/);

        return (
            <motion.p
                initial="hidden"
                whileInView="visible"
                whileHover="scatter"
                viewport={{ once: true, margin: "-10%" }}
                className="inline-block cursor-pointer"
            >
                {words.map((word, wordIndex) => (
                    <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: "0.35em" }}>
                        {word.split("").map((char, charIndex) => {
                            const randomX = Math.random() * 100 - 50;
                            const randomY = Math.random() * 60 - 30;
                            const randomRotate = Math.random() * 90 - 45;

                            return (
                                <motion.span
                                    key={charIndex}
                                    variants={{
                                        hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            filter: "blur(0px)",
                                            x: 0,
                                            rotate: 0,
                                            transition: {
                                                duration: 0.6,
                                                delay: delay + wordIndex * 0.1 + charIndex * 0.02,
                                                ease: [0.2, 0.65, 0.3, 0.9]
                                            }
                                        },
                                        scatter: {
                                            x: randomX,
                                            y: randomY,
                                            rotate: randomRotate,
                                            color: "#fbbf24",
                                            filter: "blur(2px)",
                                            transition: {
                                                duration: 0.4,
                                                ease: "backOut"
                                            }
                                        }
                                    }}
                                    style={{ display: "inline-block" }}
                                >
                                    {char}
                                </motion.span>
                            );
                        })}
                    </span>
                ))}
            </motion.p>
        );
    };

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center py-32 px-6 lg:px-20 overflow-hidden"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
                <motion.div
                    style={{ y, opacity }}
                    className="relative w-full aspect-[3/4] lg:aspect-[4/5] overflow-hidden rounded-sm"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/20 to-transparent mix-blend-overlay z-10" />
                    <img
                        src="/choco3.jpg"
                        alt="Artisan Chocolate Crafting"
                        className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-1000 ease-out scale-105 hover:scale-100"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="absolute bottom-8 right-8 w-32 h-32 bg-black/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center z-20"
                    >
                        <p className="text-xs font-mono text-center uppercase tracking-widest leading-relaxed text-amber-500">
                            Est.<br />1924
                        </p>
                    </motion.div>
                </motion.div>

                <div className="flex flex-col justify-center">
                    <motion.div
                        custom={0}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-10%" }}
                        variants={textVariants}
                    >
                        <h5 className="text-amber-500 font-mono text-sm uppercase tracking-[0.2em] mb-6">
                            Our Philosophy
                        </h5>
                    </motion.div>

                    <motion.h2
                        custom={1}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-10%" }}
                        variants={textVariants}
                        className="text-5xl lg:text-7xl font-serif leading-[1.1] mb-10 text-white/90"
                    >
                        Crafting <span className="italic text-white/40">moments</span> of pure indulgence.
                    </motion.h2>

                    <div className="space-y-8 text-lg lg:text-xl font-light text-white/60 leading-relaxed max-w-xl">
                        <RevealText delay={0.2}>
                            We believe that chocolate is more than just a confection; it is an art form.
                            Every piece is a testament to our dedication to sourcing the finest cacao
                            from sustainable farms across the globe.
                        </RevealText>
                        <RevealText delay={0.4}>
                            Our master chocolatiers blend tradition with innovation, creating textures
                            and flavors that defy expectation. From the snap of the shell to the
                            velvety ganache within, every detail is obsessed over.
                        </RevealText>
                    </div>

                    <motion.div
                        custom={3}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-10%" }}
                        variants={textVariants}
                        className="mt-12"
                    >
                        <button className="group relative px-8 py-4 bg-transparent overflow-hidden border border-white/20 hover:border-amber-500 transition-colors duration-500">
                            <span className="relative z-10 text-sm uppercase tracking-[0.2em] group-hover:text-black transition-colors duration-500">
                                Read Our Story
                            </span>
                            <div className="absolute inset-0 bg-amber-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[0.2,0.65,0.3,0.9]" />
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
