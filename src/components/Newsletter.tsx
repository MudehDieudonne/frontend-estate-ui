import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ScrollReveal } from "./ScrollReveal";

export const Newsletter = () => {
  return (
    <section id="contact">
      <hr className="w-11/12 mx-auto" />

      <div className="container py-24 sm:py-32">
        <ScrollReveal direction="up">
          <h3 className="text-center text-4xl md:text-5xl font-bold">
            Stay Connected with{" "}
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              IRED
            </span>
          </h3>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.2}>
          <p className="text-xl text-muted-foreground text-center mt-4 mb-8">
            Subscribe for exclusive luxury listings, market insights, and real
            estate opportunities delivered directly to your inbox.
          </p>
        </ScrollReveal>

        <div className="flex justify-center">
          <Button asChild className="px-10">
            <Link to="/register">Subscribe</Link>
          </Button>
        </div>
      </div>

      <hr className="w-11/12 mx-auto" />
    </section>
  );
};
