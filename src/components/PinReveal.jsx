import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    id: 1,
    number: "01",
    title: "Single Origin",
    subtitle: "Premium Sourcing",
    description: "Sourced directly from the finest plantations in Ecuador, Madagascar, and Venezuela. Each origin brings unique flavor profiles—from fruity notes to deep, complex tones.",
    highlight: "Ethical sourcing practices.",
    image: "https://images.unsplash.com/photo-1623660073608-25d214696f87?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 2,
    number: "02",
    title: "Artisan Craft",
    subtitle: "Handcrafted Excellence",
    description: "Meticulously crafted by master chocolatiers using traditional techniques. Small-batch production ensures attention to detail and consistency in every creation.",
    highlight: "72-hour conching process.",
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 3,
    number: "03",
    title: "Sustainable",
    subtitle: "Ethical Practices",
    description: "Committed to sustainable and ethical sourcing. Our partnerships with certified fair-trade cooperatives support local communities while preserving the environment.",
    highlight: "100% traceable supply chain.",
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: 4,
    number: "04",
    title: "Quality First",
    subtitle: "Rigorous Standards",
    description: "Each batch undergoes rigorous quality control. We personally select only the finest beans, rejecting any that don't meet our exacting standards.",
    highlight: "Top 1% bean selection.",
    image: "https://images.unsplash.com/photo-1511381971716-230df81570ce?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    number: "05",
    title: "The Masters",
    subtitle: "Expert Artisans",
    description: "Our team brings decades of combined experience. Trained in the finest European traditions, they blend artistry with science to create chocolates that are both beautiful and delicious.",
    highlight: "Award-winning craftsmanship.",
    image: "https://images.unsplash.com/photo-1575372587010-0254293988c8?q=80&w=2070&auto=format&fit=crop"
  },
];

export default function PinReveal() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const pinSections = containerRef.current?.querySelectorAll(".pin-section");
      if (!pinSections || pinSections.length === 0) return;

      pinSections.forEach((section, index) => {
        const content = section.querySelector(".content-col");
        const image = section.querySelector(".image-col");
        const progressBar = section.querySelector(".progress-bar");

        gsap.set(content.children, { y: 50, opacity: 0 });
        gsap.set(image, { scale: 1.2, filter: "brightness(0.5)" });
        if (progressBar) gsap.set(progressBar, { scaleY: 0 });

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=100%",
          pin: true,
          pinSpacing: true,
          scrub: 1.5,
          onEnter: () => {
            gsap.to(content.children, {
              y: 0,
              opacity: 1,
              stagger: 0.1,
              duration: 0.8,
              ease: "power3.out"
            });
            gsap.to(image, {
              scale: 1,
              filter: "brightness(1)",
              duration: 1.5,
              ease: "power2.out"
            });
            if (progressBar) {
              gsap.to(progressBar, {
                scaleY: 1,
                duration: 1,
                ease: "none"
              });
            }
          },
          onLeave: () => {
            gsap.to(content.children, {
              y: -50,
              opacity: 0,
              stagger: 0.05,
              duration: 0.5
            });
          },
          onEnterBack: () => {
            gsap.to(content.children, {
              y: 0,
              opacity: 1,
              stagger: 0.1,
              duration: 0.8
            });
            if (progressBar) {
              gsap.to(progressBar, {
                scaleY: 1,
                duration: 0.5
              });
            }
          },
          onLeaveBack: () => {
            gsap.to(content.children, {
              y: 50,
              opacity: 0,
              stagger: 0.05,
              duration: 0.5
            });
            if (progressBar) {
              gsap.to(progressBar, {
                scaleY: 0,
                duration: 0.5
              });
            }
          }
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full bg-black">
      {sections.map((section, index) => (
        <section
          key={section.id}
          className="pin-section relative w-full h-screen flex flex-col lg:flex-row overflow-hidden"
        >
          <div className="content-col w-full lg:w-1/2 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 relative z-10 bg-black/80 backdrop-blur-sm lg:bg-transparent order-2 lg:order-1">

            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/5 hidden lg:block">
              <div className="progress-bar w-full h-full bg-amber-500 origin-top" />
            </div>

            <span className="text-amber-500 font-mono text-xs md:text-sm tracking-widest mb-2 md:mb-4 block">
              {section.number} — {section.subtitle}
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white mb-4 md:mb-8 leading-[1.1]">
              {section.title}
            </h2>

            <p className="text-gray-400 text-sm md:text-lg leading-relaxed max-w-md mb-6 md:mb-8 font-light">
              {section.description}
            </p>

            <div className="flex items-center gap-4">
              <div className="h-[1px] w-8 md:w-12 bg-amber-500/50" />
              <span className="text-amber-200/80 text-xs md:text-sm uppercase tracking-wider">
                {section.highlight}
              </span>
            </div>
          </div>

          <div className="image-col absolute inset-0 lg:static w-full lg:w-1/2 h-full overflow-hidden order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black lg:bg-gradient-to-r lg:from-black lg:via-transparent lg:to-transparent z-10" />
            <img
              src={section.image}
              alt={section.title}
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      ))}
    </div>
  );
}
