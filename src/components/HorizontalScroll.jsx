import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    id: 1,
    title: "Velvet Truffle",
    desc: "A smooth, rich ganache center enrobed in 70% dark chocolate.",
    img: "/choco1.jpg",
  },
  {
    id: 2,
    title: "Golden Hazelnut",
    desc: "Roasted hazelnuts coated in creamy milk chocolate and gold dust.",
    img: "/choco2.jpg",
  },
  {
    id: 3,
    title: "Ruby Raspberry",
    desc: "Exquisite ruby chocolate paired with tart raspberry filling.",
    img: "/choco3.jpg",
  },
  {
    id: 4,
    title: "Salted Caramel",
    desc: "Buttery caramel with a hint of sea salt, encased in dark shells.",
    img: "/choco4.jpg",
  },
  {
    id: 5,
    title: "Espresso Delight",
    desc: "Bold espresso beans enrobed in premium dark chocolate with a velvety finish.",
    img: "/choco5.jpg",
  },
  {
    id: 6,
    title: "Vanilla Bean",
    desc: "Creamy white chocolate infused with Madagascar vanilla bean essence.",
    img: "/choco6.jpg",
  },
  {
    id: 7,
    title: "Strawberry Zest",
    desc: "Zesty strawberry peel combined with smooth dark chocolate for a citrus symphony.",
    img: "/choco7.jpg",
  },
  {
    id: 8,
    title: "Mint Elegance",
    desc: "Refreshing mint cream center wrapped in rich dark chocolate perfection.",
    img: "/choco8.jpg",
  },
];

export default function HorizontalScroll() {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const content = contentRef.current;

      if (!container || !content) return;

      gsap.set(container, { opacity: 0 });
      gsap.set(content, { opacity: 0, visibility: "hidden" });

      const getScrollAmount = () => {
        let contentWidth = content.scrollWidth;
        let viewportWidth = window.innerWidth;
        const amount = contentWidth - viewportWidth;
        return amount > 0 ? -amount : 0;
      };

      const tween = gsap.to(content, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => {
            const amount = Math.abs(getScrollAmount());
            return `+=${amount > 100 ? amount : 100}`;
          },
          pin: true,
          pinSpacing: true,
          scrub: 1.5,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          id: "horizontal-scroll",
          refreshPriority: -1,
          onEnter: () => {
            gsap.to([container, content], {
              opacity: 1,
              visibility: "visible",
              duration: 0.5
            });
          },
          onLeave: () => {
            gsap.set([container, content], { opacity: 1, visibility: "visible" });
            ScrollTrigger.refresh();
          },
          onLeaveBack: () => {
            gsap.to([container, content], {
              opacity: 0,
              visibility: "hidden",
              duration: 0.3
            });
          },
        },
      });

      const images = content.querySelectorAll("img");
      let loadedCount = 0;
      const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount >= images.length) {
          ScrollTrigger.refresh();
        }
      };

      if (images.length > 0) {
        images.forEach((img) => {
          if (img.complete) checkAllLoaded();
          else img.addEventListener("load", checkAllLoaded);
        });
      } else {
        ScrollTrigger.refresh();
      }

      return () => {
        tween.kill();
        images.forEach((img) =>
          img.removeEventListener("load", checkAllLoaded)
        );
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="bg-[#0a0a0a] text-white overflow-hidden h-screen flex flex-col md:flex-row items-center relative w-full"
      style={{ margin: 0, padding: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(217,119,6,0.03),transparent_50%)] pointer-events-none z-0" />

      <div className="relative w-full h-[30vh] md:absolute md:left-0 md:top-0 md:h-full md:w-[35vw] lg:w-[30vw] xl:w-[28vw] flex items-center justify-center md:justify-start pl-0 md:pl-12 lg:pl-16 xl:pl-24 z-20 pointer-events-none">
        <div className="pointer-events-auto text-center md:text-left px-6 md:px-0">
          <h2 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-serif text-amber-500 mb-4 md:mb-6 tracking-tight leading-[0.9]">
            Our <br className="hidden md:block" />
            <span className="text-white italic font-light">Collections</span>
          </h2>
          <div className="w-16 md:w-20 lg:w-24 h-[2px] bg-gradient-to-r from-amber-500 via-amber-400 to-transparent mb-4 md:mb-8 mx-auto md:mx-0" />
          <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-400 font-extralight leading-relaxed max-w-sm mx-auto md:mx-0">
          </p>
        </div>
      </div>

      <div
        ref={contentRef}
        className="flex gap-6 md:gap-12 lg:gap-16 xl:gap-20 items-center pl-6 md:pl-[40vw] lg:pl-[35vw] xl:pl-[32vw] pr-6 md:pr-12 lg:pr-16 xl:pr-24 z-10 whitespace-nowrap will-change-transform h-[70vh] md:h-full"
      >
        {items.map((item) => (
          <div
            key={item.id}
            data-card={item.id}
            className="group relative w-[85vw] md:w-[380px] lg:w-[420px] xl:w-[480px] h-[55vh] md:h-[70vh] flex-shrink-0 overflow-visible"
          >
            <div className="absolute -inset-[2px] rounded-lg bg-[conic-gradient(from_0deg,transparent_0deg,#d97706_90deg,transparent_180deg,#d97706_270deg,transparent_360deg)] opacity-0 group-hover:opacity-100 animate-spin-slow transition-opacity duration-500" />
            <div className="relative w-full h-full bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border border-white/5 rounded-lg overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:shadow-[0_30px_80px_rgba(217,119,6,0.2)] group-hover:border-transparent group-hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:via-amber-500/10 group-hover:to-amber-500/5 transition-all duration-700 pointer-events-none z-10" />

              <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center rounded-full text-black font-bold text-lg md:text-xl shadow-[0_10px_30px_rgba(217,119,6,0.4)] z-30 group-hover:scale-110 group-hover:shadow-[0_15px_40px_rgba(217,119,6,0.6)] transition-all duration-500">
                <span className="relative z-10">{item.id}</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
              </div>

              <div className="w-full h-[60%] md:h-[65%] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine pointer-events-none z-20"
                  style={{
                    background: 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
                    animation: 'shine 2s infinite'
                  }}
                />
              </div>

              <div className="p-6 md:p-8 lg:p-10 h-[40%] md:h-[35%] flex flex-col justify-center relative bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]">
                <div className="absolute top-0 left-6 md:left-8 w-12 h-[1px] bg-gradient-to-r from-amber-500 to-transparent opacity-50" />

                <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif text-white mb-2 md:mb-3 group-hover:text-amber-400 transition-colors duration-500 tracking-tight whitespace-normal">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-gray-400 font-extralight leading-relaxed mb-3 md:mb-4 group-hover:text-gray-300 transition-colors duration-500 whitespace-normal line-clamp-3">
                  {item.desc}
                </p>

                <button className="self-start mt-auto px-4 py-2 md:px-6 md:py-2.5 text-[10px] md:text-xs uppercase tracking-[0.15em] text-amber-500 border border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/10 transition-all duration-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                  Discover
                </button>
              </div>

              <div className="absolute top-4 right-4 w-2 h-2 bg-amber-500/0 group-hover:bg-amber-500 rounded-full transition-all duration-700 group-hover:scale-150" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
