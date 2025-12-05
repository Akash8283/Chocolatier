import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxVideo() {
    const containerRef = useRef(null);
    const videoRef = useRef(null);

    useLayoutEffect(() => {
        const container = containerRef.current;
        const video = videoRef.current;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add({
                isMobile: "(max-width: 768px)",
                isDesktop: "(min-width: 769px)",
            }, (context) => {
                const { isMobile } = context.conditions;

                gsap.fromTo(
                    video,
                    {
                        width: isMobile ? "80%" : "30%",
                        height: isMobile ? "40%" : "30%",
                        borderRadius: "10%"
                    },
                    {
                        width: isMobile ? "100%" : "60%",
                        height: isMobile ? "60%" : "80%",
                        borderRadius: "0%", 
                        ease: "none",
                        scrollTrigger: {
                            trigger: container,
                            start: "top top",
                            end: "+=4000",
                            scrub: 1.5,
                            pin: true,
                            pinSpacing: false,
                            invalidateOnRefresh: true,
                            onLeave: () => gsap.set(container, { autoAlpha: 0 }),
                            onEnterBack: () => gsap.set(container, { autoAlpha: 1 }),
                        },
                    }
                );
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-screen flex items-center justify-center bg-black overflow-hidden">
            <video
                ref={videoRef}
                src="/parallax.mp4"
                className="h-full object-cover will-change-transform"
                autoPlay
                muted
                loop
                playsInline
            />
        </div>
    );
}
