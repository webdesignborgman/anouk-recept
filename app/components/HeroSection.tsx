"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-accent">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Linker Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold">
                  <motion.span
                    initial={{ x: 180, opacity: 0 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                    }}
                    transition={{
                      x: { duration: 1.2, type: "spring", stiffness: 90, damping: 12 },
                      opacity: { duration: 0.7 }
                    }}
                    className="inline-block bg-primary bg-clip-text text-transparent"
                  >
                    Organiseer
                  </motion.span>{" "}
                  <span className="text-foreground">al je recepten</span>
                  <br />
                  <span className="text-foreground">& papieren vondsten</span>
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed">
                  Nooit meer verdwalen in recepten-chaos—alles veilig bij elkaar!<br />
                  Je hebt nu altijd een smakelijk alibi om te koken.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-row gap-4">
                <Button
                  onClick={() => router.push("/login")}
                  className="bg-gradient-accent hover:opacity-90 transition-opacity text-lg px-8 py-6 h-auto"
                >
                  Gratis aan de slag
                </Button>
                <Button
                  
                  onClick={() => router.push("/login")}
                  className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-card/80 text-lg px-8 py-6 h-auto"
                >
                  Ik heb al een account
                </Button>
              </div>
            </div>

            {/* Rechterafbeelding */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-medium">
                <img
                  src="/hero-documents.jpg"
                  alt="Georganiseerde recepten en documenten in een keuken"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Zwevende elementen */}
              <div className="absolute -top-4 -right-4 bg-card/95 backdrop-blur-sm p-4 rounded-xl shadow-soft animate-fade-in">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-sm font-medium">Receptenverzameling</span>
                </div>
              </div>
              <div
                className="absolute -bottom-4 -left-4 bg-card/95 backdrop-blur-sm p-4 rounded-xl shadow-soft animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <span className="text-sm font-medium">Handige categorieën</span>
                </div>
              </div>
            </div>
            {/* Einde Afbeelding */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
