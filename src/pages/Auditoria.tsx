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
  X as XIcon,
  Check,
} from "lucide-react";
import MiniGauge from "@/components/audit/MiniGauge";

const PAY_URL = "https://mpago.la/1nHw9UL";

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

const fixes = [
  { n: "01", impact: "alto", title: "Activar HTTPS", desc: "Tu sitio no tiene certificado SSL. Se debe activar desde el hosting y redirigir todo el tráfico a la versión segura." },
  { n: "02", impact: "alto", title: "Agregar H1 en cada página", desc: "Google no encuentra un título principal. Se debe definir un H1 único por página con la palabra clave del negocio." },
  { n: "03", impact: "alto", title: "Corregir datos estructurados", desc: "El schema markup tiene errores. Se debe validar y corregir para que Google muestre información enriquecida." },
  { n: "04", impact: "alto", title: "Describir las imágenes", desc: "14 de 15 imágenes sin texto alternativo. Se debe completar cada una con descripción relevante." },
  { n: "05", impact: "medio", title: "Optimizar título y descripción", desc: "El título supera los 60 caracteres. Se debe ajustar incluyendo la palabra clave principal." },
  { n: "06", impact: "medio", title: "Reducir scripts externos", desc: "El sitio carga 41 scripts. Se deben combinar y optimizar para mejorar velocidad." },
  { n: "07", impact: "medio", title: "Completar redes sociales", desc: "Twitter Card incompleta. Se deben definir título, descripción e imagen." },
];

// ===== Inline audit helpers =====
const SeverityBadge = ({
  variant,
  children,
}: {
  variant: "red" | "amber" | "green";
  children: React.ReactNode;
}) => {
  const styles = {
    red: "bg-destructive/10 border-destructive/30 text-destructive",
    amber: "bg-[hsl(33_85%_55%/0.1)] border-[hsl(33_85%_55%/0.3)] text-[hsl(33_85%_55%)]",
    green: "bg-primary/10 border-primary/30 text-primary",
  } as const;
  return (
    <span
      className={`inline-flex items-center text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-1 h-6 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]" />
    <h3
      className="text-xl md:text-2xl font-semibold tracking-tight text-foreground"
      style={{ fontFamily: "var(--font-heading)" }}
    >
      {children}
    </h3>
  </div>
);

const MetricCard = ({
  label,
  value,
  badge,
  badgeVariant,
}: {
  label: string;
  value: string;
  badge: string;
  badgeVariant: "red" | "amber";
}) => (
  <div className="border border-border bg-card rounded-lg p-4 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <SeverityBadge variant={badgeVariant}>{badge}</SeverityBadge>
    </div>
    <span className="text-sm text-foreground">{value}</span>
  </div>
);

const ProgressRow = ({
  label,
  pct,
  color,
  hint,
}: {
  label: string;
  pct: number;
  color: "red" | "amber";
  hint: string;
}) => {
  const c = color === "red" ? "hsl(var(--destructive))" : "hsl(33 85% 55%)";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm text-foreground">{label}</span>
        <span className="text-xs font-mono text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-2 w-full bg-secondary/40 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: c, boxShadow: `0 0 10px ${c}` }}
        />
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>
    </div>
  );
};

const BadgeRow = ({
  label,
  badgeText,
  variant,
  hint,
}: {
  label: string;
  badgeText: string;
  variant: "red" | "amber";
  hint: string;
}) => (
  <div className="flex flex-col gap-1.5 border border-border bg-card rounded-lg p-3">
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-foreground">{label}</span>
      <SeverityBadge variant={variant}>{badgeText}</SeverityBadge>
    </div>
    <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>
  </div>
);

const XItem = ({ title, hint }: { title: string; hint: string }) => (
  <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
    <div className="w-6 h-6 rounded-md bg-destructive/10 border border-destructive/30 flex items-center justify-center shrink-0 mt-0.5">
      <XIcon className="w-3.5 h-3.5 text-destructive" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-foreground font-medium">{title}</p>
      <p className="text-xs text-muted-foreground leading-relaxed mt-1">{hint}</p>
    </div>
  </div>
);

const ScoreGauge = ({ target = 23 }: { target?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [score, setScore] = useState(0);

  const radius = 80;
  const circumference = Math.PI * radius;
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

  const scrollToExample = () => {
    exampleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden pb-24">
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

      {/* Ejemplo de auditoría — header rápido */}
      <section
        ref={exampleRef}
        className="relative z-10 max-w-5xl mx-auto px-6 pb-20 scroll-mt-12"
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
      </section>

      {/* AUDITORÍA COMPLETA INLINE */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-32">
        <div className="text-center space-y-2 mb-12">
          <h2
            className="text-2xl md:text-3xl font-bold text-foreground tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Auditoría SEO completa · sitio-ejemplo.cl
          </h2>
          <p className="text-sm text-muted-foreground font-mono">
            Generada el 19 de abril 2026
          </p>
        </div>

        <div className="space-y-12">
          {/* 4 Gauges */}
          <div className="border border-border bg-card rounded-2xl p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <MiniGauge label="SEO técnico" target={23} color="red" />
              <MiniGauge label="Rendimiento" target={31} color="red" />
              <MiniGauge label="Seguridad" target={12} color="red" />
              <MiniGauge label="Contenido" target={40} color="amber" />
            </div>
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm md:text-base text-muted-foreground">
                Este sitio está por debajo del{" "}
                <span className="text-destructive font-semibold">92%</span> de los sitios de su
                industria
              </p>
            </div>
          </div>

          <section>
            <SectionTitle>SEO técnico</SectionTitle>
            <div className="grid md:grid-cols-2 gap-3">
              <MetricCard label="Title" value="68 caracteres (máx. 60)" badge="Largo" badgeVariant="amber" />
              <MetricCard label="Meta Description" value="163 caracteres (máx. 160)" badge="Larga" badgeVariant="amber" />
              <MetricCard label="Canonical" value="No definido" badge="Falta" badgeVariant="red" />
              <MetricCard label="H1" value="No encontrado" badge="Crítico" badgeVariant="red" />
              <MetricCard label="Keywords" value="No definidas" badge="Falta" badgeVariant="red" />
              <MetricCard label="Idioma HTML" value="en (debería ser es)" badge="Incorrecto" badgeVariant="amber" />
            </div>
          </section>

          <section>
            <SectionTitle>Rendimiento</SectionTitle>
            <div className="space-y-5">
              <ProgressRow label="Scripts externos: 41" pct={85} color="red" hint="Se deben combinar y diferir para reducir tiempo de carga" />
              <ProgressRow label="CSS inline: 28KB" pct={60} color="amber" hint="Se debe externalizar y minificar" />
              <ProgressRow label="Scripts inline: 23KB" pct={55} color="amber" hint="Se deben mover a archivos externos" />
              <BadgeRow label="Preload: 0 recursos" badgeText="Falta" variant="red" hint="Se deben precargar fuentes y CSS críticos" />
              <BadgeRow label="Prefetch: 0 recursos" badgeText="Falta" variant="red" hint="Se deben anticipar recursos de navegación" />
              <BadgeRow label="Preconnect: 0 dominios" badgeText="Falta" variant="red" hint="Se debe conectar anticipadamente a dominios externos" />
            </div>
          </section>

          <section>
            <SectionTitle>Seguridad</SectionTitle>
            <div className="border border-border bg-card rounded-xl px-4 md:px-6">
              <XItem title="HTTPS no activado" hint="Se debe instalar certificado SSL y forzar redirección segura" />
              <XItem title="Content Security Policy no configurada" hint="Se debe definir CSP para prevenir ataques" />
              <XItem title="Referrer Policy no configurada" hint="Se debe configurar para proteger datos de navegación" />
              <XItem title="Formularios con contraseña en HTTP" hint="Se debe migrar a HTTPS para proteger datos de usuarios" />
            </div>
          </section>

          <section>
            <SectionTitle>Imágenes y contenido</SectionTitle>
            <div className="space-y-4">
              <div className="border border-border bg-card rounded-lg p-4">
                <ProgressRow
                  label="14 de 15 imágenes sin texto alternativo"
                  pct={93}
                  color="red"
                  hint="Se debe agregar descripción alt con palabras clave a cada imagen"
                />
              </div>
              <BadgeRow label="12 imágenes alojadas en servidores externos" badgeText="Atención" variant="amber" hint="Se deben migrar al servidor local para mejorar velocidad" />
              <BadgeRow label="0 enlaces internos entre páginas" badgeText="Crítico" variant="red" hint="Se deben crear enlaces entre páginas de servicios relacionados" />
              <BadgeRow label="Estructura de headings con saltos (H2 a H5)" badgeText="Atención" variant="amber" hint="Se debe corregir la jerarquía sin saltar niveles" />
            </div>
          </section>

          <section>
            <SectionTitle>Redes sociales</SectionTitle>
            <div className="grid md:grid-cols-2 gap-3">
              <BadgeRow label="Open Graph" badgeText="Incompleto" variant="amber" hint="Título e imagen presentes pero sin dimensiones. Se deben agregar width y height" />
              <BadgeRow label="Twitter Card" badgeText="Sin configurar" variant="red" hint="Sin título, descripción ni imagen propia. Se deben completar todos los campos" />
            </div>
          </section>

          <section>
            <SectionTitle>Datos estructurados</SectionTitle>
            <div className="border border-border bg-card rounded-xl px-4 md:px-6">
              <XItem title="JSON-LD con error de sintaxis" hint="Google encontró schema pero no puede leerlo. Se debe validar y corregir" />
              <XItem title="Sin microdata" hint="No hay marcado adicional. Se debe implementar para mejorar indexación" />
              <XItem title="Sin rich results" hint="No apareces con estrellas ni precios en Google. Se debe corregir el schema" />
            </div>
          </section>

          <section>
            <SectionTitle>Correcciones recomendadas</SectionTitle>
            <div className="space-y-3">
              {fixes.map((f) => (
                <div
                  key={f.n}
                  className="border border-border bg-card rounded-xl p-4 md:p-5 flex gap-4 hover:border-primary/30 transition-colors"
                >
                  <div
                    className="text-2xl md:text-3xl font-bold text-muted-foreground/40 tabular-nums shrink-0"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {f.n}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-semibold text-foreground">{f.title}</h4>
                      <SeverityBadge variant={f.impact === "alto" ? "red" : "amber"}>
                        Impacto {f.impact}
                      </SeverityBadge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="border border-primary/40 bg-primary/5 rounded-2xl p-6 md:p-8 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Check className="w-5 h-5" />
              <span className="text-xs font-mono uppercase tracking-wider">Resumen</span>
            </div>
            <p className="text-base md:text-lg text-foreground font-semibold">
              7 errores críticos · 4 advertencias · 3 oportunidades de mejora
            </p>
            <p className="text-sm md:text-base text-muted-foreground">
              Impacto esperado:{" "}
              <span className="text-primary font-semibold">
                De 23 a 70+ puntos en 2-4 semanas
              </span>
            </p>
          </div>
        </div>
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
              href={PAY_URL}
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

      {/* Sticky bottom banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t-2 border-primary shadow-[0_-4px_20px_-5px_hsl(150_100%_50%/0.3)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs md:text-sm text-muted-foreground text-center sm:text-left">
            Esta es una auditoría de ejemplo.
          </p>
          <a
            href={PAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-xs md:text-sm px-5 py-2.5 rounded-md hover:brightness-110 transition-all shadow-[0_0_20px_-5px_hsl(150_100%_50%/0.5)]"
          >
            Pedir mi auditoría — $35.000 CLP
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auditoria;
