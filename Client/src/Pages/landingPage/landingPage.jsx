// import React, { useRef } from "react";
// import { Link } from "react-router-dom";
// import { motion, useAnimation, useInView } from "framer-motion";
// import { Typewriter } from "react-simple-typewriter";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { BrainCircuit, Rocket, Users } from "lucide-react";
// import { ModeToggle } from "@/components/ui/mode-toggle";

// import Logo from "../../../assets/Images/Logo.jpg";
// import VectorImage from "../../../assets/Images/VectorImage.svg";

// export default function Landing() {
//   const features = [
//     {
//       icon: BrainCircuit,
//       title: "AI-Powered Screening",
//       description: "Analyze resumes with advanced AI algorithms.",
//     },
//     {
//       icon: Rocket,
//       title: "Streamlined Process",
//       description: "Save time and resources in your recruitment workflow.",
//     },
//     {
//       icon: Users,
//       title: "Top Talent Acquisition",
//       description: "Identify the best candidates for your organization.",
//     },
//   ];

//   // Animation controls for the features section
//   const controls = useAnimation();
//   const featuresRef = useRef(null);
//   const featuresInView = useInView(featuresRef, {
//     once: true,
//     margin: "-100px",
//   });

//   // Animation controls for the CTA section
//   const ctaControls = useAnimation();
//   const ctaRef = useRef(null);
//   const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

//   React.useEffect(() => {
//     if (featuresInView) {
//       controls.start("visible");
//     }
//     if (ctaInView) {
//       ctaControls.start("visible");
//     }
//   }, [controls, featuresInView, ctaControls, ctaInView]);

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       {/* Header */}
//       <header className="fixed left-0 right-0 top-0 z-50 bg-background shadow-md">
//         <div className="container mx-auto flex items-center justify-between p-4">
//           <div className="flex items-center space-x-2">
//             <img src={Logo} alt="Logo" className="h-12 w-12 rounded-full" />
//             <span className="text-2xl font-extrabold">AI Recruiter</span>
//           </div>
//           <nav className="flex items-center space-x-4">
//             <Link to="/SignUp">
//               <Button
//                 variant="ghost"
//                 className="text-foreground hover:bg-muted hover:text-primary"
//               >
//                 Sign Up
//               </Button>
//             </Link>
//             <Link to="/SignIn">
//               <Button>Login</Button>
//             </Link>
//             {/* Mode Toggle */}
//             <div className="ml-4">
//               <ModeToggle />
//             </div>
//           </nav>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="relative h-screen overflow-hidden">
//         {/* Background Image */}
//         <div
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//           style={{ backgroundImage: `url(${VectorImage})` }}
//         ></div>

//         {/* Prism Glass Effect Overlay */}
//         <div className="absolute inset-0 bg-black/50"></div>
//         <div className="absolute inset-0 backdrop-blur-md"></div>

//         {/* Content */}
//         <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
//           <motion.h1
//             className="mb-6 text-5xl font-extrabold leading-tight text-white"
//             initial={{ opacity: 0, y: -50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1 }}
//           >
//             Revolutionize Recruitment with{" "}
//             <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//               AI
//             </span>
//           </motion.h1>
//           <div className="mb-8 h-24 text-lg text-white md:text-xl">
//             <Typewriter
//               words={[
//                 "Unlock the power of artificial intelligence to streamline your recruitment process.",
//                 "Let AI analyze resumes, screen candidates, and predict the best fits for your organization.",
//                 "Save time and resources while ensuring top talent acquisition.",
//               ]}
//               loop={0}
//               cursor
//               cursorStyle="_"
//               typeSpeed={40}
//               deleteSpeed={20}
//               delaySpeed={2000}
//             />
//           </div>
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="flex space-x-4"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 1, delay: 0.5 }}
//           >
//             <Link to="/SignUp">
//               <Button size="lg">Get Started</Button>
//             </Link>
//             <Link to="/LearnMore">
//               <Button size="lg" variant="outline">
//                 Learn More
//               </Button>
//             </Link>
//           </motion.div>
//         </div>
//       </main>

//       {/* Features Section */}
//       <section className="mt-24 bg-background py-16" ref={featuresRef}>
//         <div className="container mx-auto">
//           <motion.h2
//             className="mb-12 text-center text-4xl font-bold"
//             initial="hidden"
//             animate={controls}
//             variants={{
//               hidden: { opacity: 0, y: 50 },
//               visible: { opacity: 1, y: 0 },
//             }}
//             transition={{ duration: 0.8 }}
//           >
//             Why Choose AI Recruiter?
//           </motion.h2>
//           <div className="grid gap-8 px-4 md:grid-cols-3">
//             {features.map((feature, index) => (
//               <motion.div
//                 key={index}
//                 className="group transform bg-card p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
//                 initial="hidden"
//                 animate={controls}
//                 variants={{
//                   hidden: { opacity: 0, y: 50 },
//                   visible: { opacity: 1, y: 0 },
//                 }}
//                 transition={{ duration: 0.6, delay: index * 0.2 }}
//               >
//                 <CardContent className="flex flex-col items-center text-center">
//                   <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition duration-300 group-hover:scale-110">
//                     <feature.icon className="h-8 w-8" />
//                   </div>
//                   <h3 className="mb-2 text-2xl font-semibold">
//                     {feature.title}
//                   </h3>
//                   <p className="text-muted-foreground">{feature.description}</p>
//                 </CardContent>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section className="bg-primary py-16" ref={ctaRef}>
//         <motion.div
//           className="container mx-auto text-center"
//           initial="hidden"
//           animate={ctaControls}
//           variants={{
//             hidden: { opacity: 0, scale: 0.8 },
//             visible: { opacity: 1, scale: 1 },
//           }}
//           transition={{ duration: 0.8 }}
//         >
//           <h2 className="mb-6 text-4xl font-bold text-primary-foreground">
//             Ready to Transform Your Hiring Process?
//           </h2>
//           <p className="mb-8 text-xl text-primary-foreground/80">
//             Sign up today and experience the future of recruitment.
//           </p>
//           <Link to="/SignUp">
//             <Button size="lg">Get Started Now</Button>
//           </Link>
//         </motion.div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-muted py-8 text-muted-foreground">
//         <div className="container mx-auto px-4 text-center">
//           <p>&copy; 2024 AI Recruiter. All rights reserved.</p>
//           <div className="mt-4 space-x-4">
//             <a href="#" className="hover:text-foreground">
//               Privacy Policy
//             </a>
//             <a href="#" className="hover:text-foreground">
//               Terms of Service
//             </a>
//             <a href="#" className="hover:text-foreground">
//               Contact Us
//             </a>
//           </div>
//           <div className="mt-8 flex justify-center space-x-6">
//             <a href="#" className="hover:text-foreground">
//               <i className="fab fa-facebook-f"></i>
//             </a>
//             <a href="#" className="hover:text-foreground">
//               <i className="fab fa-twitter"></i>
//             </a>
//             <a href="#" className="hover:text-foreground">
//               <i className="fab fa-linkedin-in"></i>
//             </a>
//             <a href="#" className="hover:text-foreground">
//               <i className="fab fa-instagram"></i>
//             </a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, Rocket, Users } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Logo from "../../assets/Images/Logo.jpg";
import VectorImage from "../../assets/Images/VectorImage.svg";

export default function Landing() {
  const features = [
    {
      icon: BrainCircuit,
      title: "AI-Powered Screening",
      description: "Analyze resumes with advanced AI algorithms.",
    },
    {
      icon: Rocket,
      title: "Streamlined Process",
      description: "Save time and resources in your recruitment workflow.",
    },
    {
      icon: Users,
      title: "Top Talent Acquisition",
      description: "Identify the best candidates for your organization.",
    },
  ];

  // Refs and animation controls
  const controls = useAnimation();
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  const featuresInView = useInView(featuresRef, {
    once: true,
    margin: "-100px",
  });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  React.useEffect(() => {
    if (featuresInView) controls.start("visible");
    if (ctaInView) controls.start("visible");
  }, [featuresInView, ctaInView]);

  return (
    <div className="min-h-screen bg-gradient-to-t from-background to-muted text-foreground">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 bg-opacity-80 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <img src={Logo} alt="Logo" className="h-12 w-12 rounded-full" />
            <span className="text-xl font-extrabold">AI Recruiter</span>
          </div>
          <nav className="hidden items-center space-x-4 md:flex">
            <Link to="/SignUp">
              <Button
                variant="ghost"
                className="hover:bg-muted hover:text-primary"
              >
                Sign Up
              </Button>
            </Link>
            <Link to="/SignIn">
              <Button>Login</Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${VectorImage})` }}
        ></div>

        {/* Prism Glass Effect Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 backdrop-blur-md"></div>

        {/* Content */}
        <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.h1
            className="mb-6 text-5xl font-extrabold leading-tight text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Revolutionize Recruitment with{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI
            </span>
          </motion.h1>
          <div className="mb-8 h-24 text-lg text-white md:text-xl">
            <Typewriter
              words={[
                "Unlock the power of artificial intelligence to streamline your recruitment process.",
                "Let AI analyze resumes, screen candidates, and predict the best fits for your organization.",
                "Save time and resources while ensuring top talent acquisition.",
              ]}
              loop={0}
              cursor
              cursorStyle="_"
              typeSpeed={40}
              deleteSpeed={20}
              delaySpeed={2000}
            />
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex space-x-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Link to="/SignUp">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/LearnMore">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="bg-gradient-to-r from-muted to-background py-16"
      >
        <motion.h2
          className="mb-12 text-center text-4xl font-bold"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8 }}
        >
          Why Choose AI Recruiter?
        </motion.h2>
        <div className="grid gap-8 px-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group transform rounded-md bg-card p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="flex flex-col items-center p-4 text-center">
                <CardContent className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition duration-300 group-hover:scale-110">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 text-2xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 AI Recruiter</p>
          <div className="flex justify-center space-x-4">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
