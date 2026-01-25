import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import { HeroCards } from "./HeroCards";

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
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

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Explore the most exclusive properties in the most desirable locations.
          Our team of experts is here to help you find the perfect place to call home.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-1/3" onClick={() => navigate("/register")}>
            Browse Listings
          </Button>

          <a
            rel="noreferrer noopener"
            href="#contact"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Contact an Agent
          </a>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
