import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "../components/Icons";
import { ScrollReveal } from "./ScrollReveal";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <MapIcon />,
    title: "Search Properties",
    description:
      "Explore our curated selection of luxury listings tailored to your specific preferences and lifestyle.",
  },
  {
    icon: <MedalIcon />,
    title: "Expert Consultation",
    description:
      "Meet with our specialized agents to discuss market trends and define your property goals.",
  },
  {
    icon: <PlaneIcon />,
    title: "Private Showings",
    description:
      "Experience exclusive properties first-hand through private tours or immersive virtual walkthroughs.",
  },
  {
    icon: <GiftIcon />,
    title: "Close the Deal",
    description:
      "Our legal and advisory partners ensure a seamless and rewarding transaction process.",
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="howItWorks"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Sticky Background Image */}
      <div
        className="absolute inset-0 z-0 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')`,
          opacity: 0.1
        }}
      />

      <div className="container relative z-10 text-center">
        <ScrollReveal direction="up">
          <h2 className="text-3xl md:text-4xl font-bold ">
            Our Smooth{" "}
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              Acquisition{" "}
            </span>
            Process
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
            From discovery to the final signature, we provide a structured and
            sophisticated journey to your new home.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon, title, description }: FeatureProps, index) => (
            <ScrollReveal key={title} direction="up" delay={0.1 * (index + 3)}>
              <Card className="bg-muted/50 backdrop-blur-sm border-primary/20 hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="grid gap-4 place-items-center">
                    <div className="p-2 bg-primary/10 rounded-full">
                      {icon}
                    </div>
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>{description}</CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-16 flex justify-center">
          <ScrollReveal direction="up" delay={0.8}>
            <Button asChild size="lg" className="px-10 bg-primary/90 hover:bg-primary shadow-lg border-primary/20 hover:scale-105 transition-all">
              <Link to="/register">Start Your Journey Today</Link>
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
