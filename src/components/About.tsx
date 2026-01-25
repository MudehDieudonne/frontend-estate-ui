import { Statistics } from "./Statistics";

export const About = () => {
  return (
    <section
      id="about"
      className="container py-24 sm:py-32"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
            alt="IRED Office"
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                IRED (Iforty Real Estate Development)
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                IRED (Iforty Real Estate Development) is a premier real estate agency dedicated to
                connecting discerning clients with extraordinary properties.
                With over two decades of experience, we pride ourselves on
                our unparalleled market knowledge, integrity, and commitment
                to excellence. Whether you're seeking a modern penthouse or
                a coastal villa, we are here to guide you home.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
