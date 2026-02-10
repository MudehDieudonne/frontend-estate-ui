import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ScrollReveal } from "./ScrollReveal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface TestimonialProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
}

const testimonials: TestimonialProps[] = [
  {
    image: "https://i.pravatar.cc/150?u=sarah",
    name: "Sarah Jenkins",
    userName: "Homeowner",
    comment: "IRED helped me sell my villa for 20% above asking price. Their marketing is world-class!",
  },
  {
    image: "https://i.pravatar.cc/150?u=david",
    name: "David Miller",
    userName: "First-time Buyer",
    comment:
      "Finding a home was stress-free thanks to the team at IRED. They found me the perfect urban loft in record time.",
  },
  {
    image: "https://i.pravatar.cc/150?u=michael",
    name: "Michael Ross",
    userName: "Real Estate Investor",
    comment:
      "The market analysis provided by IRED is second to none. They are truly the gold standard in the industry.",
  },
  {
    image: "https://i.pravatar.cc/150?u=elena",
    name: "Elena Kostas",
    userName: "Luxury Tenant",
    comment:
      "Luxury service at every level. The property management team is always responsive and professional. Highly recommended!",
  },
  {
    image: "https://i.pravatar.cc/150?u=thomas",
    name: "Thomas Wright",
    userName: "Commercial Client",
    comment:
      "They understood exactly what my business needed and found us the perfect office space in a prime location.",
  },
  {
    image: "https://i.pravatar.cc/150?u=sophie",
    name: "Sophie Laurent",
    userName: "Coastal Buyer",
    comment:
      "The virtual tours allowed me to view properties from across the country with complete confidence. Amazing experience!",
  },
];

export const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="container py-24 sm:py-32"
    >
      <ScrollReveal direction="up">
        <h2 className="text-3xl md:text-5xl font-bold text-center lg:text-start">
          Discover Why
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            {" "}
            Our Clients{" "}
          </span>
          Trust IRED
        </h2>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.2}>
        <p className="text-xl text-muted-foreground text-center lg:text-start pt-4 pb-12">
          Hear from the people who have found their dream homes and successful
          investments through our dedicated service in Cameroon.
        </p>
      </ScrollReveal>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(
          ({ image, name, userName, comment }: TestimonialProps, index) => (
            <ScrollReveal key={userName} direction="up" delay={0.1 * index}>
              <Card className="h-full border-primary/10 hover:border-primary/30 transition-all">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar>
                    <AvatarImage alt={name} src={image} />
                    <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <CardDescription>{userName}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="italic">"{comment}"</CardContent>
              </Card>
            </ScrollReveal>
          )
        )}
      </div>

      {/* Mobile Slider */}
      <div className="md:hidden flex overflow-x-auto gap-4 pb-8 snap-x no-scrollbar">
        {testimonials.map(({ image, name, userName, comment }: TestimonialProps) => (
          <div key={userName} className="min-w-[85vw] snap-center">
            <Card className="h-full border-primary/20">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage alt={name} src={image} />
                  <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>{userName}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="italic">"{comment}"</CardContent>
            </Card>
          </div>
        ))}
      </div>

      <ScrollReveal direction="up" delay={0.4}>
        <div className="mt-16 flex justify-center">
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-10 rounded-full">
            <Link to="/faq">Read More Success Stories</Link>
          </Button>
        </div>
      </ScrollReveal>
    </section>
  );
};
