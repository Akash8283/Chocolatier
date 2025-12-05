import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import HorizontalScroll from "./HorizontalScroll";
import PinReveal from "./PinReveal";
import ParticleMorph from "./ParticleMorph";
import CardStack from "./CardStack";
import ParallaxVideo from "./ParallaxVideo";
import About from "./About";
import Footer from "./Footer";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideo() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useLayoutEffect(() => {
    if (!isVideoLoaded) return;

    const video = videoRef.current;
    const container = containerRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=2000",
          scrub: 1.5,
          pin: true,
          pinSpacing: true,
          id: "video-scroll",
          invalidateOnRefresh: true,
        },
      });

      tl.to(video, {
        currentTime: video.duration - 0.1,
        ease: "none",
      });

    }, containerRef);

    return () => ctx.revert();
  }, [isVideoLoaded]);

  return (
    <div className="relative w-full">
      <section
        ref={containerRef}
        id="home"
        className="w-full h-screen bg-black overflow-hidden relative z-10"
      >
        <video
          ref={videoRef}
          src="/Chocolate-mixed.mp4"
          playsInline
          preload="auto"
          muted
          className="w-full h-full object-cover will-change-transform"
          onLoadedMetadata={() => setIsVideoLoaded(true)}
        />
      </section>

      <section
        id="collections"
        className="relative w-full bg-black z-20 -mt-[20vh] md:-mt-[50vh]"
        style={{ marginBottom: 0 }}
      >
        <HorizontalScroll />
      </section>

      <section className="relative w-full bg-black z-30">
        <PinReveal />
      </section>

      <section className="relative w-full bg-black z-40 overflow-hidden">
        <ParticleMorph />
      </section>

      <section className="relative w-full bg-black z-50">
        <ParallaxVideo />
      </section>

      <section id="ingredients" className="relative w-full bg-black z-60 overflow-hidden">
        <CardStack />
      </section>

      <section id="about" className="relative w-full bg-black z-70">
        <About />
      </section>

      <section id="contact" className="relative w-full bg-black z-80">
        <Footer />
      </section>
    </div>
  )
}