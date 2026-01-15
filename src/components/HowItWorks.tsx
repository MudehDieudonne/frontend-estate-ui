import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "../components/Icons";

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
      className="container text-center py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        Our Smooth{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Acquisition{" "}
        </span>
        Process
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        From discovery to the final signature, we provide a structured and
        sophisticated journey to your new home.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
