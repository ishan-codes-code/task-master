import React, { useState, useEffect } from "react";

const Carousel = () => {
  const totalSlides = 4;

  const [currentSlide, setCurrentSlide] = useState(0);

  const next = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div>
      <div className="relative w-full mx-auto overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out w-full"
          style={{
            transform: `translateX(-${100 * currentSlide}%)`,
          }}
        >
          <div className="w-full h-60 flex-shrink-0 flex items-center justify-center text-white text-2xl bg-red-500">
            item 1
          </div>
          <div className="w-full h-60 flex-shrink-0 flex items-center justify-center text-white text-2xl bg-blue-500">
            item 2
          </div>
          <div className="w-full h-60 flex-shrink-0 flex items-center justify-center text-white text-2xl bg-green-500">
            item 3
          </div>
          <div className="w-full h-60 flex-shrink-0 flex items-center justify-center text-white text-2xl bg-purple-500">
            item 5
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
      <button
        onClick={prev}
        className="bg-black/50 text-white px-3 py-1 rounded hover:bg-black/70"
      >
        Prev
      </button>
      <button
        onClick={next}
        className="bg-black/50 text-white px-3 py-1 rounded hover:bg-black/70"
      >
        Next
      </button>
    </div>
  );
};

export default Carousel;
