import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowDown,
  Code2,
  FileCheck2,
  Clock,
  Zap,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import FullAuditModal from "@/components/audit/FullAuditModal";

const errors = [
  {
    severity: "critical",
    label: "Sin etiqueta H1 — Google no entiende tu página",
    hint: "Se debe definir un título principal único con la palabra clave del negocio.",
  },
  {
    severity: "critical",
    label: "14 imágenes sin descripción — invisibles para Google",
    hint: "Se debe completar la descripción de cada imagen para que Google las indexe.",
  },
  {
    severity: "critical",
    label: "Datos estructurados corruptos — schema inválido",
    hint: "Se debe validar y corregir el schema para aparecer con información enriquecida en Google.",
  },
  {
    severity: "critical",
    label: "Formularios sin HTTPS — riesgo de seguridad",
    hint: "Se debe activar certificado SSL y redirigir todo el tráfico a la versión segura.",
  },
  {
    severity: "warning",
    label: "Título cortado en resultados de Google",
    hint: "Se debe ajustar a máximo 60 caracteres incluyendo la palabra clave principal.",
  },
];

const miniScores = [
  { label: "SEO técnico", score: 23 },
  { label: "Rendimiento", score: 31 },
  { label: "Seguridad", score: 12 },
];

const includes = [
  {
    icon: Code2,
    title: "Análisis de código fuente",
    desc: "Revisamos cada línea de tu sitio buscando errores que Google penaliza.",
  },
  {
    icon: FileCheck2,
    title: "Reporte con soluciones",
    desc: "No solo te decimos qué está mal, te decimos exactamente cómo arreglarlo paso a paso.",
  },
  {
    icon: Clock,
    title: "Listo en 24 horas",
    desc: "Recibes tu auditoría personalizada en tu correo en menos de un día.",
  },
];

const ScoreGauge = ({ target = 23 }: { target?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [score, setScore] = useState(0);

  const radius = 80;
  const circumference = Math.PI * radius; // half circle
  const progress = (score / 100) * circumference;

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const duration = 1400;
    const animate = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setScore(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <svg width="220" height="130" viewBox="0 0 220 130" className="overflow-visible">
        <path
          d="M 20 110 A 80 80 0 0 1 200 110"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 20 110 A 80 80 0 0 1 200 110"
          fill="none"
          stroke="hsl(var(--destructive))"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{
            transition: "stroke-dashoffset 60ms linear",
            filter: "drop-shadow(0 0 12px hsl(var(--destructive) / 0.5))",
          }}
        />
      </svg>
      <div className="-mt-8 flex flex-col items-center">
        <div
          className="text-5xl font-bold text-destructive tabular-nums"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {score}
          <span className="text-2xl text-muted-foreground">/100</span>
        </div>
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">
          Score SEO
        </div>
      </div>
    </div>
  );
};

const Auditoria = () => {
  const exampleRef = useRef<HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const scrollToExample = () => {
    exampleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const whatsappUrl = `https://wa.me/56967658939?text=${encodeURIComponent(
    "Hola, quiero la auditoría SEO de mi sitio"
  )}`;

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-destructive/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto"
      >
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span
            className="text-lg font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            3clicAds
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Inicio
          </Link>
          <span className="text-sm text-primary font-medium">Auditoría</span>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 px-6 pt-20 md:pt-28 pb-24 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-wider uppercase text-destructive border border-destructive/30 bg-destructive/5 px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
            Auditoría SEO
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-foreground mb-8"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          El <span className="text-destructive">73%</span> de los sitios en página 2 de Google
          tienen errores que se arreglan en{" "}
          <span className="text-primary">horas</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12"
        >
          ¿Por qué tus competidores aparecen primero? Porque alguien ya les dijo qué estaban
          haciendo mal.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <button
            onClick={scrollToExample}
            className="group inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-8 py-4 rounded-lg hover:brightness-110 transition-all shadow-[0_0_30px_-5px_hsl(150_100%_50%/0.4)]"
          >
            Ver ejemplo de auditoría
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* Ejemplo de auditoría */}
      <section
        ref={exampleRef}
        className="relative z-10 max-w-5xl mx-auto px-6 pb-32 scroll-mt-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-px h-8 bg-destructive/50" />
          <span className="text-sm font-mono text-muted-foreground tracking-wider uppercase">
            Ejemplo · reporte real
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="border border-border rounded-2xl bg-card overflow-hidden"
        >
          {/* Header del reporte */}
          <div className="p-8 md:p-10 border-b border-border space-y-8">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <ScoreGauge target={23} />

              <div className="flex-1 space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Resumen del análisis
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    4 errores críticos
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[hsl(33_85%_55%/0.1)] border border-[hsl(33_85%_55%/0.3)] text-[hsl(33_85%_55%)] text-sm font-semibold">
                    <AlertTriangle className="w-4 h-4" />
                    3 advertencias
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sitio con problemas técnicos graves de indexación. Google no puede leer
                  correctamente el contenido principal.
                </p>
              </div>
            </div>

            {/* Mini scores */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 pt-2">
              {miniScores.map((m) => (
                <div
                  key={m.label}
                  className="border border-destructive/30 bg-destructive/5 rounded-lg p-3 md:p-4 text-center"
                >
                  <div className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    {m.label}
                  </div>
                  <div
                    className="text-xl md:text-2xl font-bold text-destructive tabular-nums"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {m.score}
                    <span className="text-xs md:text-sm text-muted-foreground">/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla de errores */}
          <div className="divide-y divide-border">
            {errors.map((e, i) => {
              const isCritical = e.severity === "critical";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className="flex items-start gap-4 px-6 md:px-10 py-4 hover:bg-secondary/30 transition-colors"
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 mt-2 ${
                      isCritical
                        ? "bg-destructive shadow-[0_0_10px_hsl(var(--destructive))]"
                        : "bg-[hsl(33_85%_55%)] shadow-[0_0_10px_hsl(33_85%_55%)]"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm md:text-base text-foreground">{e.label}</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
                      {e.hint}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] md:text-xs font-mono font-semibold uppercase tracking-wider px-2 py-1 rounded border shrink-0 mt-1 ${
                      isCritical
                        ? "bg-destructive/10 border-destructive/30 text-destructive"
                        : "bg-[hsl(33_85%_55%/0.1)] border-[hsl(33_85%_55%/0.3)] text-[hsl(33_85%_55%)]"
                    }`}
                  >
                    {isCritical ? "Crítico" : "Advertencia"}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-8 space-y-5"
        >
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Esto es solo una muestra.{" "}
            <span className="text-foreground font-semibold">
              Tu auditoría incluirá todos los errores reales de tu sitio
            </span>{" "}
            con orientación de corrección para cada uno.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="group inline-flex items-center gap-2 border border-primary/50 text-primary font-semibold text-sm px-6 py-3 rounded-lg hover:bg-primary/10 hover:border-primary transition-all"
          >
            Ver auditoría completa de ejemplo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* Qué incluye */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="w-px h-8 bg-primary/50" />
          <span className="text-sm font-mono text-muted-foreground tracking-wider uppercase">
            Qué incluye
          </span>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {includes.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-border bg-card rounded-xl p-8 hover:border-primary/30 transition-colors"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3
                className="text-xl font-semibold text-foreground mb-2 tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Precio y CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border border-border rounded-2xl p-12 md:p-16 text-center bg-card relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative">
            <div
              className="text-5xl md:text-7xl font-bold text-foreground tracking-tight mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              $35.000 <span className="text-2xl md:text-3xl text-muted-foreground">CLP</span>
            </div>
            <p className="text-base md:text-lg text-muted-foreground mb-2">
              Menos que un almuerzo. Más que lo que cobra cualquier agencia.
            </p>
            <p className="text-sm text-muted-foreground/70 mb-10">
              Sin compromiso. Sin contratos. Solo la verdad sobre tu sitio.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-base px-10 py-5 rounded-lg hover:brightness-110 transition-all shadow-[0_0_40px_-8px_hsl(150_100%_50%/0.5)]"
            >
              Quiero la auditoría de mi sitio
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center text-xs text-muted-foreground font-mono">
        3clicAds — Santiago, Chile · contacto@3clicads.com
      </footer>
    </div>
  );
};

export default Auditoria;
