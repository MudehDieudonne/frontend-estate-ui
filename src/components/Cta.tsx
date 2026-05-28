import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const Cta = () => {
  return (
    <section
      id="cta"
      className="bg-muted/50 py-16 my-24 sm:my-32"
    >
      <div className="container lg:grid lg:grid-cols-2 place-items-center">
        <div className="lg:col-start-1">
          <h2 className="text-3xl md:text-4xl font-bold ">
            Ready to Find Your
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              {" "}
              Elite Estate?{" "}
            </span>
          </h2>
          <p className="text-muted-foreground text-xl mt-4 mb-8 lg:mb-0">
            Join hundreds of satisfied clients who have found their dream homes
            or sold their properties at premium prices with our expert guidance.
          </p>
        </div>

        <div className="space-y-4 lg:col-start-2">
          <Button asChild className="w-full md:mr-4 md:w-auto">
            <Link to="/feed">Explore Listings</Link>
          </Button>
          <Button asChild variant="outline" className="w-full md:w-auto">
            <Link to="/create-listing">List Your Property</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
