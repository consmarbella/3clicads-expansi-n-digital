import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight, X as XIcon, Check } from "lucide-react";
import { motion } from "framer-motion";
import MiniGauge from "./MiniGauge";

interface FullAuditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const whatsappAudit = `https://wa.me/56967658939?text=${encodeURIComponent(
  "Hola, quiero la auditoría SEO de mi sitio"
)}`;
const whatsappFix = `https://wa.me/56967658939?text=${encodeURIComponent(
  "Hola, quiero que implementen las correcciones SEO en mi sitio"
)}`;

// Severity badge
const Badge = ({
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
      <Badge variant={badgeVariant}>{badge}</Badge>
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
          animate={{ width: `${pct}%` }}
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
      <Badge variant={variant}>{badgeText}</Badge>
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

const fixes = [
  { n: "01", impact: "alto", title: "Activar HTTPS", desc: "Tu sitio no tiene certificado SSL. Se debe activar desde el hosting y redirigir todo el tráfico a la versión segura." },
  { n: "02", impact: "alto", title: "Agregar H1 en cada página", desc: "Google no encuentra un título principal. Se debe definir un H1 único por página con la palabra clave del negocio." },
  { n: "03", impact: "alto", title: "Corregir datos estructurados", desc: "El schema markup tiene errores. Se debe validar y corregir para que Google muestre información enriquecida." },
  { n: "04", impact: "alto", title: "Describir las imágenes", desc: "14 de 15 imágenes sin texto alternativo. Se debe completar cada una con descripción relevante." },
  { n: "05", impact: "medio", title: "Optimizar título y descripción", desc: "El título supera los 60 caracteres. Se debe ajustar incluyendo la palabra clave principal." },
  { n: "06", impact: "medio", title: "Reducir scripts externos", desc: "El sitio carga 41 scripts. Se deben combinar y optimizar para mejorar velocidad." },
  { n: "07", impact: "medio", title: "Completar redes sociales", desc: "Twitter Card incompleta. Se deben definir título, descripción e imagen." },
];

const FullAuditModal = ({ open, onOpenChange }: FullAuditModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl w-[95vw] h-[92vh] p-0 gap-0 bg-background border-border overflow-hidden flex flex-col"
      >
        {/* Banner fijo */}
        <div className="shrink-0 bg-[hsl(48_100%_8%)] border-b border-[hsl(48_80%_30%)] px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <p className="text-xs md:text-sm text-[hsl(48_90%_75%)] flex-1 leading-snug">
            Esta es una auditoría de ejemplo. Tu reporte será personalizado con los datos reales
            de tu sitio.
          </p>
          <a
            href={whatsappAudit}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-xs md:text-sm px-4 py-2.5 rounded-md hover:brightness-110 transition-all shadow-[0_0_20px_-5px_hsl(150_100%_50%/0.5)]"
          >
            Pedir mi auditoría — $35.000 CLP
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Scroll content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 md:px-10 py-8 md:py-10 space-y-12">
            {/* Header */}
            <div className="text-center space-y-2">
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

            {/* SEO TÉCNICO */}
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

            {/* RENDIMIENTO */}
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

            {/* SEGURIDAD */}
            <section>
              <SectionTitle>Seguridad</SectionTitle>
              <div className="border border-border bg-card rounded-xl px-4 md:px-6">
                <XItem title="HTTPS no activado" hint="Se debe instalar certificado SSL y forzar redirección segura" />
                <XItem title="Content Security Policy no configurada" hint="Se debe definir CSP para prevenir ataques" />
                <XItem title="Referrer Policy no configurada" hint="Se debe configurar para proteger datos de navegación" />
                <XItem title="Formularios con contraseña en HTTP" hint="Se debe migrar a HTTPS para proteger datos de usuarios" />
              </div>
            </section>

            {/* IMÁGENES Y CONTENIDO */}
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

            {/* REDES SOCIALES */}
            <section>
              <SectionTitle>Redes sociales</SectionTitle>
              <div className="grid md:grid-cols-2 gap-3">
                <BadgeRow label="Open Graph" badgeText="Incompleto" variant="amber" hint="Título e imagen presentes pero sin dimensiones. Se deben agregar width y height" />
                <BadgeRow label="Twitter Card" badgeText="Sin configurar" variant="red" hint="Sin título, descripción ni imagen propia. Se deben completar todos los campos" />
              </div>
            </section>

            {/* DATOS ESTRUCTURADOS */}
            <section>
              <SectionTitle>Datos estructurados</SectionTitle>
              <div className="border border-border bg-card rounded-xl px-4 md:px-6">
                <XItem title="JSON-LD con error de sintaxis" hint="Google encontró schema pero no puede leerlo. Se debe validar y corregir" />
                <XItem title="Sin microdata" hint="No hay marcado adicional. Se debe implementar para mejorar indexación" />
                <XItem title="Sin rich results" hint="No apareces con estrellas ni precios en Google. Se debe corregir el schema" />
              </div>
            </section>

            {/* PLAN DE CORRECCIÓN */}
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
                        <Badge variant={f.impact === "alto" ? "red" : "amber"}>
                          Impacto {f.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* RESUMEN FINAL */}
            <section className="space-y-5">
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

              <div className="border border-border bg-card rounded-2xl p-6 md:p-10 text-center space-y-4">
                <p className="text-sm md:text-base text-muted-foreground">
                  ¿No tienes equipo técnico? Implementamos todas las correcciones en{" "}
                  <span className="text-foreground font-semibold">48 horas</span>.
                </p>
                <div
                  className="text-4xl md:text-5xl font-bold text-foreground tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  $150.000{" "}
                  <span className="text-xl md:text-2xl text-muted-foreground">CLP</span>
                </div>
                <a
                  href={whatsappFix}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm md:text-base px-8 py-4 rounded-lg hover:brightness-110 transition-all shadow-[0_0_30px_-5px_hsl(150_100%_50%/0.5)]"
                >
                  Contratar corrección completa
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </section>

            <div className="h-4" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullAuditModal;
