import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const ingredients = [
  { id: 1, name: "Premium Cocoa", image: "/ing1.jpg", color: "#3E2723" },
  { id: 2, name: "Vanilla Bean", image: "/ing2.jpg", color: "#F5DEB3" },
  { id: 3, name: "Hazelnuts", image: "/ing3.jpg", color: "#8B4513" },
  { id: 4, name: "Almonds", image: "/ing4.jpg", color: "#DEB887" },
  { id: 5, name: "Dark Chocolate", image: "/ing7.jpg", color: "#B0C4DE" },
  { id: 6, name: "Cocoa", image: "/ing6.jpg", color: "#D2691E" },
];

export default function CardStack() {
  const [cards, setCards] = useState(ingredients);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const isAnimating = useRef(false);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  useGSAP(() => {
    gsap.from(cardRefs.current, {
      y: 100,
      scale: 0.9,
      opacity: 0.5,
      stagger: 0.1,
      duration: 1.0,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  useEffect(() => {
    if (!isAnimating.current) {
      cardRefs.current.forEach((ref, index) => {
        if (ref) {
          const yOffset = index * 5;
          const scale = 1 - index * 0.05;
          const rotation = index === 0 ? 0 : (index % 2 === 0 ? 5 + index * 2 : -5 - index * 2);
          const xOffset = index === 0 ? 0 : (index % 2 === 0 ? 10 : -10);

          gsap.to(ref, {
            y: yOffset,
            x: xOffset,
            scale: scale,
            opacity: 1,
            zIndex: cards.length - index,
            rotation: rotation,
            filter: "none",
            duration: 0.5,
            ease: "power2.out",
          });
        }
      });
    }
  }, [cards]);

  const cycleCard = (direction = 1) => {
    isAnimating.current = true;
    const topCard = cardRefs.current[0];

    if (!topCard) {
      isAnimating.current = false;
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setCards((prev) => {
          const newCards = [...prev];
          const movedCard = newCards.shift();
          newCards.push(movedCard);
          return newCards;
        });
        isAnimating.current = false;
      },
    });

    tl.to(topCard, {
      x: direction * 500,
      y: 100,
      rotation: direction * 45,
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: "power2.in",
    });
  };

  const handlePointerDown = (e) => {
    if (isAnimating.current) return;
    isDragging.current = true;
    dragStartX.current = e.clientX || e.touches?.[0].clientX;
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current || isAnimating.current) return;

    const clientX = e.clientX || e.touches?.[0].clientX;
    const deltaX = clientX - dragStartX.current;
    const topCard = cardRefs.current[0];

    if (topCard) {
      gsap.set(topCard, {
        x: deltaX,
        rotation: deltaX * 0.05,
      });
    }
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current || isAnimating.current) return;
    isDragging.current = false;

    const clientX = e.clientX || e.changedTouches?.[0].clientX;
    const deltaX = clientX - dragStartX.current;
    const threshold = 100;

    if (Math.abs(deltaX) > threshold) {
      cycleCard(Math.sign(deltaX));
    } else {
      const topCard = cardRefs.current[0];
      if (topCard) {
        gsap.to(topCard, {
          x: 0,
          rotation: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
        });
      }
    }
  };

  useEffect(() => {
    const handleGlobalMove = (e) => handlePointerMove(e);
    const handleGlobalUp = (e) => handlePointerUp(e);

    window.addEventListener("mousemove", handleGlobalMove);
    window.addEventListener("mouseup", handleGlobalUp);
    window.addEventListener("touchmove", handleGlobalMove);
    window.addEventListener("touchend", handleGlobalUp);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMove);
      window.removeEventListener("mouseup", handleGlobalUp);
      window.removeEventListener("touchmove", handleGlobalMove);
      window.removeEventListener("touchend", handleGlobalUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#111] to-black" />

      <div className="relative z-10 text-center mb-12 md:mb-16 px-4">
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white mb-2 tracking-tight">
          <span className="italic text-amber-500">Ingredients</span>
        </h2>
        <p className="text-white/40 text-xs md:text-sm uppercase tracking-[0.3em] ">
          Swipe to cycle
        </p>
      </div>

      <div className="relative w-[85vw] h-[55vh] max-w-[320px] max-h-[480px] md:w-[380px] md:h-[560px]">
        {cards.map((card, index) => (
          <div
            key={card.id}
            ref={(el) => (cardRefs.current[index] = el)}
            onMouseDown={index === 0 ? handlePointerDown : undefined}
            onTouchStart={index === 0 ? handlePointerDown : undefined}
            className={`absolute inset-0 rounded-xl overflow-hidden shadow-2xl transition-shadow duration-300 ${index === 0 ? "cursor-grab active:cursor-grabbing hover:shadow-amber-500/20" : "pointer-events-none"
              }`}
            style={{
              transformOrigin: "top center",
              touchAction: "none",
            }}
          >
            <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0deg,#d97706_90deg,transparent_180deg,#d97706_270deg,transparent_360deg)] animate-spin-slow opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ opacity: index === 0 ? 1 : 0 }}
            />

            <div className="absolute inset-[2px] bg-[#1a1a1a] rounded-[10px] overflow-hidden">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-[75%] object-cover pointer-events-none"
              />

              <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-[#111] p-4 md:p-6 flex flex-col justify-center border-t border-white/5 pointer-events-none">
                <h3 className="text-xl md:text-2xl font-serif text-white mb-1">{card.name}</h3>
                <div className="w-8 h-[1px] bg-amber-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 md:mt-12 text-white/20 text-xs md:text-sm font-mono">
        {cards.length} items
      </div>
    </div>
  );
}
