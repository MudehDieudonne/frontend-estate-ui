import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "How do I list my property with Elite Estates?",
    answer: "You can easily list your property by clicking the 'List Your Property' button or by contacting one of our expert agents directly for a consultation.",
    value: "item-1",
  },
  {
    question: "What geographical areas do you cover?",
    answer:
      "Elite Estates specializes in luxury markets across major metropolitan areas, exclusive coastal regions, and premium suburban neighborhoods.",
    value: "item-2",
  },
  {
    question:
      "Are virtual property tours available?",
    answer:
      "Yes, we provide immersive 3D virtual tours and high-definition video walkthroughs for the majority of our premium listings to facilitate remote viewing.",
    value: "item-3",
  },
  {
    question: "How long does it typically take to sell a property?",
    answer: "While market conditions vary, properties listed with Elite Estates typically sell 15% faster than the market average due to our extensive network and marketing.",
    value: "item-4",
  },
  {
    question:
      "Do you provide professional property valuations?",
    answer:
      "Absolutely. We offer comprehensive, data-driven market evaluations for potential sellers to help determine the optimal listing price for their property.",
    value: "item-5",
  },
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full AccordionRoot"
      >
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem
            key={value}
            value={value}
          >
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="#"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
