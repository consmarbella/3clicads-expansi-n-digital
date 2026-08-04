import { CheckCircle, Zap, BookOpen, Search, UserPlus, ArrowRight, ChevronRight, Globe, Target } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
  {
    icon: Search,
    title: "Programmatic SEO a Medida",
    description: "Desarrollamos e implementamos estrategias de Programmatic SEO a medida para dominar los resultados de búsqueda en tu nicho.",
    num: "06",
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
        <div className="flex items-center gap-6">
          <Link
            to="/auditoria"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Auditoría
          </Link>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Iniciar Sesión →
          </a>
        </div>
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
          A tu medida.
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

      {/* Solutions Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="w-px h-8 bg-primary/50" />
          <span className="text-sm font-mono text-muted-foreground tracking-wider uppercase">
            Nuestros Pilares de Crecimiento
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Programmatic SEO */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative bg-card/40 backdrop-blur-md border border-border/80 hover:border-primary/50 rounded-2xl p-8 md:p-12 hover:shadow-[0_0_50px_-12px_rgba(var(--primary),0.15)] transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-primary/10 transition-colors" />
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Globe className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Programmatic SEO (PSEO)
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
              Domina Google escalando miles de páginas con intención de búsqueda específica de forma automatizada. Captura tráfico masivo y altamente calificado en tu nicho sin pagar por cada clic.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                <span>Generación masiva de páginas de aterrizaje optimizadas</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                <span>Estructuras semánticas perfectas para buscadores</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                <span>Estrategia de palabras clave de cola larga (Long-tail)</span>
              </li>
            </ul>
            <a
              href="mailto:contacto@3clicads.com?subject=Consulta sobre Programmatic SEO"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform"
            >
              Descubrir PSEO <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Card 2: Custom Google Ads Campaigns */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative bg-card/40 backdrop-blur-md border border-border/80 hover:border-primary/50 rounded-2xl p-8 md:p-12 hover:shadow-[0_0_50px_-12px_rgba(var(--primary),0.15)] transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-primary/10 transition-colors" />
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Campañas de Google Ads Personalizadas
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
              Diseño, estructura y optimización de campañas de búsqueda a la medida de tu negocio. Maximizamos el Retorno de Inversión (ROI) apuntando a audiencias de alta intención de compra.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                <span>Estructura profesional certificada por Google Ads</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                <span>Copywriting persuasivo enfocado en la conversión</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                <span>Monitoreo de conversiones y optimización continua</span>
              </li>
            </ul>
            <a
              href="mailto:contacto@3clicads.com?subject=Consulta sobre Campañas Personalizadas de Google Ads"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform"
            >
              Ver Soluciones de Ads <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
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
        <div className="space-y-2">
          <div>
            <Link to="/terminos-condiciones" className="hover:text-foreground transition-colors">
              Términos y Condiciones
            </Link>
          </div>
          <div>
            Contacto: <a href="mailto:contacto@3clicads.com" className="text-primary hover:text-foreground transition-colors font-semibold text-sm">contacto@3clicads.com</a>
          </div>
          <div className="mt-4">© {new Date().getFullYear()} 3clicAds</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
