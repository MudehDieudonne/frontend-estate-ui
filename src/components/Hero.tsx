import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import { HeroCards } from "./HeroCards";
import { Carousel } from "@material-tailwind/react";
import { ScrollReveal } from "./ScrollReveal";

const images = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1602075432748-82d264e2b463?w=2070&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1717167398817-121e3c283dbb?w=2070&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2048&auto=format&fit=crop"
];

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Carousel Background */}
      <div className="absolute inset-0 z-0">
        <Carousel
          autoplay={true}
          loop={true}
          transition={{ duration: 1.5 }}
          className="h-full w-full"
          prevArrow={() => null}
          nextArrow={() => null}
          navigation={() => null}
          placeholder=""
          onPointerEnterCapture={() => { }}
          onPointerLeaveCapture={() => { }}
        >
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Luxury property ${index + 1}`}
              className="h-full w-full object-cover"
            />
          ))}
        </Carousel>
        <div className="absolute inset-0 bg-black/50 z-[1]" />
      </div>

      <div className="container relative z-10 grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
        <div className="text-center lg:text-start space-y-6">
          <ScrollReveal direction="right">
            <main className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl">
              <h1 className="inline">
                <span className="inline bg-gradient-to-r from-[#F5C147] to-[#B8860B] text-transparent bg-clip-text">
                  Discover
                </span>{" "}
                Your Dream
              </h1>{" "}
              <h2 className="inline">
                <span className="inline bg-gradient-to-r from-[#B8860B] to-[#F5C147] text-transparent bg-clip-text">
                  Home
                </span>{" "}
                with IRED
              </h2>
            </main>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <p className="text-xl text-white/90 md:w-10/12 mx-auto lg:mx-0 drop-shadow-md font-medium">
              Explore the most exclusive properties in Cameroon's most desirable locations.
              Our team of experts is here to help you find the perfect place to call home.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="w-full sm:w-auto px-8 bg-[#B8860B] hover:bg-[#F5C147] text-white border-none shadow-xl"
                onClick={() => navigate("/feed")}
              >
                Browse Listings
              </Button>

              <Link
                to="/services#contact-form"
                className={`w-full sm:w-auto px-8 text-white border-white hover:bg-white/10 backdrop-blur-md shadow-xl ${buttonVariants({
                  variant: "outline",
                })} transition-all duration-300 hover:text-[#B8860B] hover:border-[#F5C147]`}
              >
                Contact an Agent
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Hero cards sections */}
        <ScrollReveal direction="left" delay={0.3} className="z-10">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <HeroCards />
          </div>
          <div className="mt-8 flex justify-center lg:justify-end">
            <Button variant="link" className="text-white hover:text-primary transition-colors gap-2" onClick={() => navigate("/feed")}>
              View All Featured Properties <span className="text-lg">→</span>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
