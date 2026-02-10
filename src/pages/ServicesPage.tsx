import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Services } from "../components/Services";
import { ScrollToTop } from "../components/ScrollToTop";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Carousel } from "@material-tailwind/react";

interface ServiceInquiryForm {
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
}

export const ServicesPage = () => {
  const [form, setForm] = useState<ServiceInquiryForm>({
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    message: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const subject = "IRED Service Inquiry";
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Service: ${form.service}`,
      `Budget: ${form.budget}`,
      "",
      "Message:",
      form.message,
    ].join("\n");

    const mailto = `mailto:mukummudeh@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  };

  return (
    <>
      <Navbar />

      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <Carousel
            autoplay={true}
            loop={true}
            transition={{ duration: 2 }}
            className="h-full"
            prevArrow={() => null}
            nextArrow={() => null}
            navigation={() => null}
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            <img
              src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80"
              alt="Service highlight 1"
              className="h-full w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80"
              alt="Service highlight 2"
              className="h-full w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2762&q=80"
              alt="Service highlight 3"
              className="h-full w-full object-cover"
            />
          </Carousel>
          <div className="absolute inset-0 bg-[#0B1120]/85" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1F2937] to-[#0B1120] opacity-90" />
        </div>
        <div className="container relative py-20 sm:py-28">
          <div className="max-w-3xl">
            <p className="uppercase tracking-[0.2em] text-xs text-white/70">Services</p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold">
              Tailored Real Estate Services Built for Your Next Move
            </h1>
            <p className="mt-4 text-lg text-white/80">
              From luxury sales to strategic investments, our specialists guide you with
              market intelligence, concierge support, and results-driven execution.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
              <span className="rounded-full border border-white/20 px-4 py-2">Luxury Sales</span>
              <span className="rounded-full border border-white/20 px-4 py-2">Investment Strategy</span>
              <span className="rounded-full border border-white/20 px-4 py-2">Property Management</span>
            </div>
          </div>
        </div>
      </section>

      <Services />

      <section id="contact-form" className="container py-24 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Connect With Our Service Team
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Share your goals, timelines, and property preferences. We will respond with a
              tailored plan and a dedicated advisor to guide you through every step.
            </p>
            <div className="mt-8 space-y-4">
              <div className="rounded-xl border border-primary/20 bg-muted/40 p-4">
                <p className="text-sm uppercase tracking-wide text-muted-foreground">Email</p>
                <p className="font-semibold">mukummudeh@gmail.com</p>
              </div>
              <div className="rounded-xl border border-primary/20 bg-muted/40 p-4">
                <p className="text-sm uppercase tracking-wide text-muted-foreground">Response Time</p>
                <p className="font-semibold">Within 24 hours (Mon - Sat)</p>
              </div>
            </div>
          </div>

          <Card className="border-primary/10 shadow-lg">
            <CardHeader>
              <CardTitle>Request a Service Consultation</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    placeholder="Full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    name="phone"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  <Input
                    name="service"
                    placeholder="Service of interest"
                    value={form.service}
                    onChange={handleChange}
                  />
                </div>
                <Input
                  name="budget"
                  placeholder="Budget range (optional)"
                  value={form.budget}
                  onChange={handleChange}
                />
                <Textarea
                  name="message"
                  placeholder="Tell us about your property goals"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  required
                />
                <Button type="submit" className="w-full">
                  Send to Mukummudeh
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </>
  );
};
