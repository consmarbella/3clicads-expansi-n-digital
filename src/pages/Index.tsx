import { CheckCircle, Zap, BookOpen, Search, UserPlus } from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "Espía de Competencia con IA",
    description: "Analizamos las keywords de tus competidores y creamos anuncios mejores que los de ellos automáticamente.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Zap,
    title: "Copywriting Instantáneo",
    description: "Obtén 15 títulos y 4 descripciones por grupo de anuncios, optimizados para altas tasas de clics.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: BookOpen,
    title: "Guía Paso a Paso",
    description: "¿No conoces Google Ads? Te damos un checklist sencillo para copiar y pegar tu camino hacia las ventas.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Search,
    title: "Campañas PSEO",
    description: "Creamos campañas de SEO programático para posicionar cientos de páginas automáticamente y dominar los resultados de búsqueda.",
    color: "text-emerald-600",
    bg: "bg-emerald-600/10",
  },
  {
    icon: UserPlus,
    title: "Cuentas Profesionales de Google Ads",
    description: "Configuramos tu cuenta de Google Ads de forma profesional con estructura optimizada, conversiones y seguimiento listos para escalar.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            3clicAds
          </span>
          <span className="text-[10px] font-semibold tracking-wider uppercase bg-secondary text-muted-foreground px-2 py-0.5 rounded-full ml-1">
            Plataforma DIY
          </span>
        </div>
        <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Iniciar Sesión
        </a>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-16 pb-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase px-4 py-1.5 rounded-full mb-8">
          <Zap className="w-3.5 h-3.5" />
          Herramienta #1 de Anuncios DIY
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-foreground mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          Deja de Gastar Dinero en{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-hero)' }}>
            Agencias Costosas
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          3clicAds te da las keywords exactas, el copy de anuncios y la estrategia que usan las agencias del top 1%.
          Genera campañas profesionales en segundos y lánzalas tú mismo.
        </p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-card rounded-xl border border-border p-7 transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className={`w-11 h-11 rounded-lg ${f.bg} flex items-center justify-center mb-5`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-md mx-auto px-6 pb-24 flex flex-col items-center gap-4">
        <a
          href="https://3clicads.gumroad.com/l/xmhch?wanted=true"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-semibold text-base py-4 rounded-xl hover:opacity-90 transition-opacity"
        >
          <Zap className="w-4 h-4" />
          Obtener Acceso de 15 Días
        </a>
        <a
          href="#"
          className="w-full flex items-center justify-center gap-2 border border-border text-muted-foreground font-medium text-sm py-3.5 rounded-xl hover:bg-secondary transition-colors"
        >
          🔑 Entrar con ID de Orden
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} 3clicAds. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Index;
