import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        const onMouseMove = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0,
            });
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.6,
                ease: "power3.out"
            });
        };

        const onMouseEnter = () => setIsHovering(true);
        const onMouseLeave = () => setIsHovering(false);

        const addHoverListeners = () => {
            const hoverables = document.querySelectorAll("a, button, .cursor-pointer");
            hoverables.forEach((el) => {
                el.addEventListener("mouseenter", onMouseEnter);
                el.addEventListener("mouseleave", onMouseLeave);
            });
            return hoverables;
        };

        window.addEventListener("mousemove", onMouseMove);
        const hoverables = addHoverListeners();

        const observer = new MutationObserver(addHoverListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            hoverables.forEach((el) => {
                el.removeEventListener("mouseenter", onMouseEnter);
                el.removeEventListener("mouseleave", onMouseLeave);
            });
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        const follower = followerRef.current;
        if (isHovering) {
            gsap.to(follower, {
                scale: 3,
                backgroundColor: "rgba(217, 119, 6, 0.1)",
                borderColor: "rgba(217, 119, 6, 0.5)",
                boxShadow: "0 0 30px rgba(217, 119, 6, 0.4)",
                duration: 0.3,
            });
        } else {
            gsap.to(follower, {
                scale: 1,
                backgroundColor: "transparent",
                borderColor: "#d97706",
                boxShadow: "0 0 15px rgba(217, 119, 6, 0.2)",
                duration: 0.3,
            });
        }
    }, [isHovering]);

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 bg-amber-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference shadow-[0_0_10px_rgba(217,119,6,0.8)]"
            />
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-8 h-8 border border-amber-600 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 shadow-[0_0_15px_rgba(217,119,6,0.2)]"
            />
        </>
    );
}
