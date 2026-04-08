import { CheckCircle, Zap, BookOpen, Search, UserPlus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: CheckCircle,
    title: "Espía de Competencia",
    description: "Analizamos las keywords de tus competidores y creamos anuncios que los superan. Automáticamente.",
    tag: "IA",
  },
  {
    icon: Zap,
    title: "Copywriting Instantáneo",
    description: "15 títulos y 4 descripciones por grupo de anuncios, optimizados para clics que convierten.",
    tag: "COPY",
  },
  {
    icon: BookOpen,
    title: "Guía Paso a Paso",
    description: "Checklist sencillo para copiar, pegar y lanzar. Aunque nunca hayas tocado Google Ads.",
    tag: "GUÍA",
  },
  {
    icon: Search,
    title: "Campañas PSEO",
    description: "Posicionamos cientos de páginas automáticamente para dominar los resultados de búsqueda.",
    tag: "SEO",
  },
  {
    icon: UserPlus,
    title: "Cuentas Profesionales",
    description: "Configuramos tu cuenta de Google Ads con estructura, conversiones y seguimiento listos para escalar.",
    tag: "SETUP",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const } },
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto"
      >
        <span className="text-2xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          3clic<span className="text-primary">Ads</span>
        </span>
        <a
          href="#"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full px-5 py-2 hover:bg-card"
        >
          Iniciar Sesión
        </a>
      </motion.nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-28 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-block mb-6"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full">
              Hazlo tú mismo
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-foreground mb-8"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Deja de pagar{" "}
            <em className="text-primary">agencias.</em>
            <br />
            Lanza tú mismo.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-10"
          >
            Keywords, copy de anuncios y estrategia del top 1% de agencias.
            Genera campañas profesionales en segundos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <a
              href="https://3clicads.gumroad.com/l/xmhch?wanted=true"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 bg-foreground text-background font-semibold text-base px-8 py-4 rounded-full hover:opacity-90 transition-all"
            >
              Obtener Acceso 15 Días
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 border border-border text-muted-foreground font-medium text-sm px-8 py-4 rounded-full hover:bg-card transition-colors"
            >
              🔑 Entrar con ID de Orden
            </a>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-border" />
      </div>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2
            className="text-4xl md:text-5xl text-foreground mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Todo lo que necesitas
          </h2>
          <p className="text-muted-foreground text-lg max-w-md">
            Cinco herramientas para competir contra cualquier agencia.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1"
        >
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              variants={item}
              whileHover={{ y: -4 }}
              className={`group relative p-8 md:p-10 border-b border-r border-border transition-colors hover:bg-card cursor-default ${
                i === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-8">
                <span className="text-[11px] font-bold tracking-widest text-muted-foreground/60 uppercase">
                  {s.tag}
                </span>
                <s.icon className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </div>
              <h3
                className="text-2xl text-foreground mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-foreground rounded-3xl p-12 md:p-20 text-center"
        >
          <h2
            className="text-3xl md:text-5xl text-background mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            ¿Listo para lanzar?
          </h2>
          <p className="text-background/60 text-lg mb-10 max-w-md mx-auto">
            Empieza hoy con acceso completo por 15 días.
          </p>
          <a
            href="https://3clicads.gumroad.com/l/xmhch?wanted=true"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-base px-10 py-4 rounded-full hover:opacity-90 transition-all"
          >
            Comenzar Ahora
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} 3clicAds. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Index;
