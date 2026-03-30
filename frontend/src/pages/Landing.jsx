import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroScene from '../components/3d/HeroScene';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Shield, Zap, BellRing, Target, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const Features = [
  {
    icon: BellRing,
    title: "Smart Alerts",
    description: "Get notified before you are charged. Never pay for an unused service again."
  },
  {
    icon: Zap,
    title: "Instant Analytics",
    description: "Visualize your spending habits with real-time charts and insights."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your financial data is encrypted and securely stored. We never sell your info."
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set budgets and track your progress towards financial freedom."
  }
];

const Landing = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative bg-background overflow-hidden min-h-screen">
      {/* Grid Overlay */}
      <div className="fixed inset-0 bg-grid pointer-events-none z-0 opacity-40"></div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* R3F Background */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 z-0 flex items-center justify-center"
        >
          <HeroScene />
          {/* Gradient overlay to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background z-10 pointer-events-none"></div>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-6 flex flex-col items-center text-center mt-20">
          <motion.div
            style={{ opacity }}
            animate={{ 
              x: mousePosition.x * -1, 
              y: mousePosition.y * -1 
            }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="flex flex-col items-center max-w-4xl"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-4 py-2 mb-8 border rounded-full border-glassBorder bg-glass text-sm text-gray-300 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
              <span>SubManager v2.0 is highly active</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight text-white mb-6 leading-tight"
            >
              Master Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary animate-gradient-x">
                Subscriptions
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl font-light"
            >
              A premium, high-performance platform to track spending, get renewal alerts, and stop wasting money on unused services.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full text-lg font-semibold rounded-full group px-8">
                  Start for free 
                  <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full text-lg font-semibold rounded-full px-8 bg-black/20 backdrop-blur-md">
                  Log In
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Mouse scroll indicator */}
          <motion.div 
            style={{ opacity }}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 hidden md:flex flex-col items-center"
          >
            <span className="text-sm font-medium mb-2 tracking-widest uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-gray-400 to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="relative z-20 py-32 bg-background/80 backdrop-blur-3xl border-t border-glassBorder">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 md:mb-32 flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-bold font-display mb-6 text-white max-w-3xl leading-tight">Control your finances in one <span className="text-primary font-display font-light italic">beautiful</span> platform.</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to identify active subcriptions and set spending limits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card hover className="h-full bg-gradient-to-b from-white/[0.05] to-transparent border-t-white/10 group">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary border border-primary/20">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / CTA Section */}
      <section className="relative z-20 py-32 bg-background overflow-hidden">
        <motion.div 
          style={{ y: y2 }}
          className="container mx-auto px-6"
        >
          <Card className="max-w-5xl mx-auto p-12 md:p-20 text-center relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/20">
            {/* Background glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-primary/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold font-display mb-6 text-white">Stop overpaying today.</h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">Join thousands of users who are saving an average of $340 per year by identifying and cancelling forgotten subscriptions.</p>
              
              <Link to="/register">
                <Button variant="white" size="lg" className="px-10 py-5 text-xl font-bold rounded-full transition-all">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="relative z-20 border-t border-glassBorder py-12 bg-background text-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 font-medium">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="w-6 h-6 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_rgba(59,130,246,0.3)]">S</span>
            <span className="text-gray-300">SubManager © 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
