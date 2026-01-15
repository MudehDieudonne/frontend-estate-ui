import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string;
  popular: PopularPlanType;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const pricingList: PricingProps[] = [
  {
    title: "Standard",
    popular: 0,
    price: 49,
    description:
      "Ideal for homeowners looking for a basic digital presence for their property.",
    buttonText: "List Property",
    benefitList: [
      "Digital listing on Elite Estates",
      "Professional photo shoot (10 photos)",
      "Standard market analysis",
      "Social media promotion",
      "Email support",
    ],
  },
  {
    title: "Premium",
    popular: 1,
    price: 199,
    description:
      "Comprehensive marketing package for high-end properties and faster sales.",
    buttonText: "Get Started",
    benefitList: [
      "Featured listing status",
      "Professional 3D virtual tour",
      "Drone photography & video",
      "Priority expert consultation",
      "Dedicated account manager",
    ],
  },
  {
    title: "Investor",
    popular: 0,
    price: 499,
    description:
      "Specialized tools and data for real estate investors and multiple listings.",
    buttonText: "Join circle",
    benefitList: [
      "Access to off-market deals",
      "Advanced investment analytics",
      "Bulk property management",
      "Direct agent hotline",
      "Custom market reports",
    ],
  },
];

export const Pricing = () => {
  return (
    <section
      id="pricing"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Our Professional{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Agency{" "}
        </span>
        Plans
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
        Choose the perfect plan to showcase your property or grow your
        real estate portfolio with Elite Estates.
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map((pricing: PricingProps) => (
          <Card
            key={pricing.title}
            className={
              pricing.popular === PopularPlanType.YES
                ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10"
                : ""
            }
          >
            <CardHeader>
              <CardTitle className="flex item-center justify-between">
                {pricing.title}
                {pricing.popular === PopularPlanType.YES ? (
                  <Badge
                    variant="secondary"
                    className="text-sm text-primary"
                  >
                    Most popular
                  </Badge>
                ) : null}
              </CardTitle>
              <div>
                <span className="text-3xl font-bold">${pricing.price}</span>
                <span className="text-muted-foreground"> /month</span>
              </div>

              <CardDescription>{pricing.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <Button className="w-full">{pricing.buttonText}</Button>
            </CardContent>

            <hr className="w-4/5 m-auto mb-4" />

            <CardFooter className="flex">
              <div className="space-y-4">
                {pricing.benefitList.map((benefit: string) => (
                  <span
                    key={benefit}
                    className="flex"
                  >
                    <Check className="text-primary" />{" "}
                    <h3 className="ml-2">{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
