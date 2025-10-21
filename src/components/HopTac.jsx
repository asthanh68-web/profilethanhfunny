import React from "react";

const logos = [
  { src: "./img/imglogo/1 (1).svg", alt: "lahome" },
  { src: "./img/imglogo/1 (2).svg", alt: "Booking.com" },
  { src: "./img/imglogo/1 (3).svg", alt: "Atlassian" },
  { src: "./img/imglogo/1 (4).svg", alt: "ThoughtWorks" },
  { src: "./img/imglogo/1 (5).svg", alt: "Samsung" },
  { src: "./img/imglogo/1 (6).svg", alt: "Expedia" },
  { src: "./img/imglogo/1 (7).svg", alt: "Angular" },
  { src: "./img/imglogo/1 (8).svg", alt: "Reuters" },
  { src: "./img/imglogo/1 (9).svg", alt: "Visa" }
];





const HopTac = () => {
  const marqueeItems = [...logos, ...logos];

  return (
    <section aria-label="Đối tác hợp tác" className="py-6 mt-14" >
      <div className="mx-auto max-w-5xl">
        <div className="danh-sach-logo rounded-2xl border border-white/10 bg-white/5 px-6 py-1.5 shadow-lg shadow-emerald-500/10">
          <div className="duong-chay-logo gap-10">
            {marqueeItems.map((logo, index) => (
              <div
                key={`${logo.alt}-${index}`}
                className="logo-hop-tac flex min-w-[140px] items-center justify-center opacity-80 transition-opacity duration-200 hover:opacity-100"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  className="h-18 w-18 object-contain"
                  draggable="false"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HopTac;