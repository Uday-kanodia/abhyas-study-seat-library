import { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

const images = [
  { src: gallery1, alt: "Individual study cubicles" },
  { src: gallery2, alt: "Reading lounge area" },
  { src: gallery3, alt: "Reception and entrance" },
  { src: gallery4, alt: "Main study hall" },
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
                width={800}
                height={600}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-500 flex items-center justify-center">
                <span className="text-foreground opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
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
