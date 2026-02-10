import { Button } from "./ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { MagnifierIcon, WalletIcon, ChartIcon } from "./Icons";
import { ScrollReveal } from "./ScrollReveal";

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: "Property Selling",
    description:
      "Maximize your property's market value with our bespoke marketing strategies and expert negotiation skills.",
    icon: <ChartIcon />,
  },
  {
    title: "Buying Guidance",
    description:
      "Find your perfect home with our tailored search services and professional guidance through every step of the purchase.",
    icon: <WalletIcon />,
  },
  {
    title: "Property Management",
    description:
      "Ensure your investments are well-maintained and profitable with our comprehensive property management solutions.",
    icon: <MagnifierIcon />,
  },
];

export const Services = () => {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Sticky Background Image */}
      <div
        className="absolute inset-0 z-0 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1717167398817-121e3c283dbb?w=2070&auto=format&fit=crop&q=80')`,
          opacity: 0.1
        }}
      />

      <div className="container relative z-10 flex flex-col items-center gap-12 text-center">
        <div className="max-w-3xl">
          <ScrollReveal direction="up">
            <h2 className="text-3xl md:text-5xl font-bold">
              <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                Our Premium{" "}
              </span>
              Real Estate Services
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <p className="text-muted-foreground text-xl mt-4 mb-12">
              From luxury sales to comprehensive property management, we provide
              everything you need for a successful real estate journey in Cameroon.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 text-start">
            {serviceList.map(({ icon, title, description }: ServiceProps, index) => (
              <ScrollReveal key={title} direction="up" delay={0.1 * (index + 3)}>
                <Card className="h-full bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                  <CardHeader className="space-y-4">
                    <div className="bg-primary/20 w-fit p-3 rounded-2xl shadow-inner">
                      {icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{title}</CardTitle>
                      <CardDescription className="text-md mt-2 leading-relaxed">
                        {description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal direction="up" delay={0.6} className="mt-16">
            <Button size="lg" className="px-12 bg-primary text-white shadow-xl hover:scale-105 transition-transform">
              Explore All Our Services
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
