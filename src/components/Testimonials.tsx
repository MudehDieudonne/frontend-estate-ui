import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    comment: "Elite Estates helped me sell my villa for 20% above asking price. Their marketing is world-class!",
  },
  {
    image: "https://i.pravatar.cc/150?u=david",
    name: "David Miller",
    userName: "First-time Buyer",
    comment:
      "Finding a home was stress-free thanks to the team at Elite Estates. They found me the perfect urban loft in record time.",
  },
  {
    image: "https://i.pravatar.cc/150?u=michael",
    name: "Michael Ross",
    userName: "Real Estate Investor",
    comment:
      "The market analysis provided by Elite Estates is second to none. They are truly the gold standard in the industry.",
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
      <h2 className="text-3xl md:text-4xl font-bold">
        Discover Why
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          Our Clients{" "}
        </span>
        Trust Elite Estates
      </h2>

      <p className="text-xl text-muted-foreground pt-4 pb-8">
        Hear from the people who have found their dream homes and successful
        investments through our dedicated service.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 sm:block columns-2  lg:columns-3 lg:gap-6 mx-auto space-y-4 lg:space-y-6">
        {testimonials.map(
          ({ image, name, userName, comment }: TestimonialProps) => (
            <Card
              key={userName}
              className="max-w-md md:break-inside-avoid overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage
                    alt=""
                    src={image}
                  />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>{userName}</CardDescription>
                </div>
              </CardHeader>

              <CardContent>{comment}</CardContent>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
