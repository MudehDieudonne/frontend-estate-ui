import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, Linkedin } from "lucide-react";
import { LightBulbIcon } from "./Icons";

export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Testimonial / Listing Preview */}
      <Card className="absolute w-[340px] -top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage
              alt="Luxury Apartment"
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
            />
            <AvatarFallback>LA</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">Modern Skyline Suite</CardTitle>
            <CardDescription>Downtown Manhattan</CardDescription>
          </div>
        </CardHeader>

        <CardContent>Exclusive 2-bedroom suite with floor-to-ceiling windows.</CardContent>
        <CardFooter className="flex justify-between items-center">
          <span className="font-bold text-primary">$1,250,000</span>
          <Badge variant="secondary">Featured</Badge>
        </CardFooter>
      </Card>

      {/* Team / Agent */}
      <Card className="absolute right-[20px] top-4 w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="mt-8 flex justify-center items-center pb-2">
          <img
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"
            alt="Agent avatar"
            className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover"
          />
          <CardTitle className="text-center">Marcus Sterling</CardTitle>
          <CardDescription className="font-normal text-primary">
            Senior Real Estate Advisor
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center pb-2">
          <p>
            Helping families find their perfect home with dedicated service
            and market expertise.
          </p>
        </CardContent>

        <CardFooter>
          <div className="flex gap-2">
            <a
              rel="noreferrer noopener"
              href="#"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <Linkedin size="20" />
            </a>
            <Button size="sm">Contact Marcus</Button>
          </div>
        </CardFooter>
      </Card>

      {/* Pricing / Listing */}
      <Card className="absolute top-[150px] left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex item-center justify-between">
            Villa
            <Badge
              variant="secondary"
              className="text-sm text-primary"
            >
              New Listing
            </Badge>
          </CardTitle>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">$4,500,000</span>
            <span className="text-muted-foreground text-sm">Oceanview Estates</span>
          </div>

          <CardDescription>
            A stunning contemporary villa with private pool and beach access.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="w-full">View Details</Button>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-2">
            {["5 Bedrooms", "6 Bathrooms", "5,400 Sq Ft"].map(
              (feature: string) => (
                <span
                  key={feature}
                  className="flex"
                >
                  <Check className="text-primary" />{" "}
                  <h3 className="ml-2 text-sm">{feature}</h3>
                </span>
              )
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Service / Insight */}
      <Card className="absolute w-[350px] -right-[10px] bottom-[35px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl text-primary">
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle>Market Intelligence</CardTitle>
            <CardDescription className="text-md mt-2">
              Property values in this area have increased by 15% in the last 12 months.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
