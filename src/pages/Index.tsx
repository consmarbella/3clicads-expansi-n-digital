import { CheckCircle, Zap, BookOpen, Search, UserPlus, ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: CheckCircle,
    title: "Espía de Competencia con IA",
    description: "Analizamos las keywords de tus competidores y creamos anuncios que los superan. Automáticamente.",
    num: "01",
  },
  {
    icon: Zap,
    title: "Copywriting Instantáneo",
    description: "15 títulos y 4 descripciones por grupo de anuncios, optimizados para clics que convierten.",
    num: "02",
  },
  {
    icon: BookOpen,
    title: "Guía Paso a Paso",
    description: "Checklist sencillo para copiar, pegar y lanzar. Aunque nunca hayas tocado Google Ads.",
    num: "03",
  },
  {
    icon: Search,
    title: "Campañas PSEO",
    description: "Posicionamos cientos de páginas automáticamente para dominar los resultados de búsqueda.",
    num: "04",
  },
  {
    icon: UserPlus,
    title: "Cuentas Profesionales Google Ads",
    description: "Configuramos tu cuenta con estructura, conversiones y seguimiento listos para escalar.",
    num: "05",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Glow effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            3clicAds
          </span>
        </div>
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Iniciar Sesión →
        </a>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 px-6 pt-24 md:pt-32 pb-32 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-wider uppercase text-primary border border-primary/30 bg-primary/5 px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Plataforma de IA para Ads
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight text-foreground mb-8 max-w-4xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Campañas que las agencias
          <br />
          <span className="text-primary">cobran miles.</span>
          <br />
          En segundos.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed mb-12"
        >
          Keywords exactas, copy de alto rendimiento y estrategia del top 1%.
          Genera, lanza y escala sin intermediarios.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <a
            href="https://3clicads.gumroad.com/l/xmhch?wanted=true"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-8 py-4 rounded-lg hover:brightness-110 transition-all shadow-[0_0_30px_-5px_hsl(150_100%_50%/0.3)]"
          >
            Obtener Acceso 15 Días
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 border border-border text-muted-foreground font-medium text-sm px-8 py-4 rounded-lg hover:bg-secondary hover:text-foreground transition-colors"
          >
            🔑 Entrar con ID de Orden
          </a>
        </motion.div>
      </section>

      {/* Services */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-16"
        >
          <div className="w-px h-8 bg-primary/50" />
          <span className="text-sm font-mono text-muted-foreground tracking-wider uppercase">
            Servicios
          </span>
        </motion.div>

        <div className="space-y-0">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-8 border-t border-border last:border-b hover:bg-card/50 transition-colors px-4 -mx-4 rounded-lg cursor-default"
            >
              <span className="text-xs font-mono text-muted-foreground/50 w-8 shrink-0">
                {s.num}
              </span>
              <div className="flex items-center gap-4 md:w-80 shrink-0">
                <s.icon className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors shrink-0" />
                <h3 className="text-lg md:text-xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                  {s.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {s.description}
              </p>
              <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all hidden md:block shrink-0" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border border-border rounded-2xl p-12 md:p-20 text-center bg-card relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <h2
            className="relative text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            ¿Listo para escalar?
          </h2>
          <p className="relative text-muted-foreground text-base mb-10 max-w-md mx-auto">
            Acceso completo a todas las herramientas por 15 días.
          </p>
          <a
            href="https://3clicads.gumroad.com/l/xmhch?wanted=true"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-10 py-4 rounded-lg hover:brightness-110 transition-all shadow-[0_0_40px_-8px_hsl(150_100%_50%/0.4)]"
          >
            Comenzar Ahora
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center text-xs text-muted-foreground font-mono">
        © {new Date().getFullYear()} 3clicAds
      </footer>
    </div>
  );
};

export default Index;
