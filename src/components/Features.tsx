import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FeatureProps {
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    title: "Virtual Tours",
    description:
      "Experience properties from the comfort of your home with our immersive 3D virtual tours and high-definition video walkthroughs.",
  },
  {
    title: "Expert Market Analysis",
    description:
      "Gain a competitive edge with our real-time data and expert insights into local property trends, ensuring you make informed decisions.",
  },
  {
    title: "Seamless Legal Guidance",
    description:
      "Navigate complex real estate transactions with confidence. our legal partners provide comprehensive support for every step of the process.",
  },
];

const featureList: string[] = [
  "Property Valuation",
  "Mortgage Assistance",
  "Interior Design",
  "Investment Strategy",
  "Concierge Service",
  "Market Reports",
  "Property Management",
  "Virtual Staging",
  "Legal Advocacy",
];

export const Features = () => {
  return (
    <section
      id="features"
      className="container py-24 sm:py-32 space-y-8"
    >
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Many{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Great Features
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge
              variant="secondary"
              className="text-sm"
            >
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description }: { title: string, description: string }) => (
          <Card key={title} className="bg-muted/30 border-primary/10">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white px-10">
          Discover All Features
        </Button>
      </div>
    </section>
  );
};
