import { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import photo1 from "@/assets/unnamed_3.webp.asset.json";
import photo2 from "@/assets/unnamed.webp.asset.json";
import photo3 from "@/assets/unnamed_2.webp.asset.json";
import photo4 from "@/assets/unnamed_5.webp.asset.json";
import photo5 from "@/assets/unnamed_1.webp.asset.json";
import photo6 from "@/assets/unnamed_4.webp.asset.json";
import photo7 from "@/assets/unnamed_6.webp.asset.json";

const images = [
  { src: photo1.url, alt: "Library reception and entrance" },
  { src: photo2.url, alt: "Main study hall with numbered individual desks" },
  { src: photo3.url, alt: "Rows of partitioned study cubicles with personal lighting" },
  { src: photo4.url, alt: "Wide view of the air-conditioned study hall" },
  { src: photo5.url, alt: "Wall-side cubicles with push-back revolving chairs" },
  { src: photo6.url, alt: "Aisle between study desks with personal charging points" },
  { src: photo7.url, alt: "Individual seating arrangement inside the reading hall" },
];

const GallerySection = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="gallery" className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">Gallery</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            Experience the <span className="gold-text">Atmosphere</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setLightbox(i)}
              className="relative overflow-hidden rounded-xl group aspect-[4/3]"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-500 flex items-center justify-center p-3">
                <span className="text-foreground opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium text-center">
                  {img.alt}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.google.com/maps/contrib/113830314756941663098/photos/@23.1177738,72.575052,17z/data=!4m3!8m2!3m1!1e1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-primary/30 px-6 py-3 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
          >
            <ExternalLink size={15} /> View all photos on Google Maps
          </a>
        </div>
      </div>


      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-background/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-foreground/70 hover:text-foreground" onClick={() => setLightbox(null)}>
            <X size={32} />
          </button>
          <img
            src={images[lightbox].src}
            alt={images[lightbox].alt}
            className="max-w-full max-h-[85vh] rounded-xl object-contain"
          />
        </div>
      )}
    </section>
  );
};

export default GallerySection;
