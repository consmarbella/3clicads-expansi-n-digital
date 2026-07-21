import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";

const TerminosCondiciones = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto border-b border-border"
      >
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            3clicAds
          </span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Inicio
        </Link>
      </motion.nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Términos y Condiciones
          </h1>
          <p className="text-sm text-muted-foreground mb-12">
            Última actualización: {new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            {/* Empresa */}
            <section className="pb-6 border-b border-border">
              <p className="text-base text-muted-foreground leading-relaxed">
                <strong className="text-foreground">3ClicAds</strong> es el nombre comercial utilizado por{' '}
                <strong className="text-foreground">CONSULTORIAS EMPRESARIALES ALEJANDRO MATTEUCCI E.I.R.L.</strong>, RUT 76.891.976-3,
                con domicilio en Vitacura 7181, Santiago, Chile.
              </p>
              <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                <p>Correo de contacto: <a href="mailto:contacto@3clicads.com" className="text-primary hover:underline">contacto@3clicads.com</a></p>
                <p>Teléfono: +56 9 6765 8939</p>
              </div>
            </section>

            {/* 1. Aceptación */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                1. Aceptación de los términos
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                El acceso al sitio web y la contratación de servicios ofrecidos por 3ClicAds implican la aceptación íntegra
                de los presentes Términos y Condiciones.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                Si el usuario no está de acuerdo con alguna de las disposiciones aquí establecidas, deberá abstenerse de
                contratar los servicios ofrecidos.
              </p>
            </section>

            {/* 2. Servicios */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                2. Descripción de los servicios
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-3">
                3ClicAds presta servicios profesionales relacionados con marketing digital, incluyendo:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground ml-4">
                <li>SEO programático</li>
                <li>Posicionamiento orgánico en motores de búsqueda</li>
                <li>Gestión y optimización de campañas publicitarias digitales</li>
                <li>Consultoría estratégica de marketing digital</li>
                <li>Análisis y optimización de presencia digital</li>
                <li>Otros servicios relacionados con marketing digital que sean acordados con el cliente</li>
              </ul>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                Los servicios son prestados de manera personalizada de acuerdo con los requerimientos específicos de cada cliente.
              </p>
            </section>

            {/* 3. Contratación */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                3. Contratación de servicios
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                La contratación podrá realizarse mediante el sitio web, correo electrónico, formulario de contacto, propuesta
                comercial, orden de servicio o cualquier otro medio acordado entre las partes.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                La contratación se entenderá perfeccionada una vez confirmado el pago correspondiente o aceptada formalmente
                la propuesta comercial emitida por 3ClicAds.
              </p>
            </section>

            {/* 4. Obligaciones */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                4. Obligaciones del cliente
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-3">
                El cliente se compromete a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground ml-4">
                <li>Entregar información veraz y actualizada</li>
                <li>Proporcionar oportunamente los antecedentes necesarios para la ejecución de los servicios</li>
                <li>Mantener acceso a las plataformas, cuentas o herramientas cuya administración haya sido contratada</li>
                <li>No utilizar los servicios para actividades ilícitas, fraudulentas o contrarias a la legislación vigente</li>
              </ul>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                Los retrasos ocasionados por falta de información o colaboración del cliente podrán afectar los plazos de
                ejecución sin generar responsabilidad para 3ClicAds.
              </p>
            </section>

            {/* 5. Precios */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                5. Precios y pagos
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Los valores de los servicios serán informados previamente al cliente mediante cotización, propuesta comercial,
                orden de servicio o publicación en el sitio web.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                Los pagos podrán realizarse mediante los medios habilitados por la empresa.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                La falta de pago podrá implicar la suspensión temporal o definitiva de los servicios contratados.
              </p>
            </section>

            {/* 6. Cancelaciones */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                6. Política de cancelaciones y reembolsos
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Los servicios prestados por 3ClicAds corresponden a servicios profesionales digitales, personalizados y de
                naturaleza intangible.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                Debido a que los servicios son ejecutados específicamente para cada cliente y generan trabajo profesional desde
                el inicio de su contratación, los pagos efectuados no serán reembolsables una vez iniciado el servicio.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                No obstante, la empresa podrá evaluar solicitudes excepcionales de reembolso en casos de error de facturación,
                cobros duplicados o situaciones atribuibles exclusivamente a la empresa.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                La contratación de cualquier servicio implica la aceptación expresa de esta política.
              </p>
            </section>

            {/* 7. Resultados */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                7. Resultados y expectativas
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                3ClicAds se compromete a ejecutar los servicios contratados con diligencia profesional y de acuerdo con las
                mejores prácticas de la industria.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                Sin perjuicio de lo anterior, el cliente reconoce que factores externos tales como algoritmos de motores de
                búsqueda, comportamiento de usuarios, acciones de terceros, competencia de mercado y plataformas publicitarias
                pueden afectar los resultados obtenidos.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                Por lo anterior, 3ClicAds no garantiza posiciones específicas en motores de búsqueda, niveles determinados de
                tráfico, ventas, conversiones ni resultados económicos concretos.
              </p>
            </section>

            {/* 8. Propiedad intelectual */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                8. Propiedad intelectual
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Todos los contenidos, metodologías, informes, estrategias, desarrollos, diseños y materiales elaborados por
                3ClicAds conservarán la protección que les otorgue la legislación aplicable.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                Los derechos de uso específicos que correspondan al cliente serán definidos según la naturaleza del servicio
                contratado.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                El cliente no podrá reproducir, distribuir o comercializar materiales propiedad de 3ClicAds sin autorización
                previa por escrito.
              </p>
            </section>

            {/* 9. Uso adecuado */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                9. Uso adecuado de los servicios
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-3">
                Los servicios no podrán utilizarse para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground ml-4">
                <li>Actividades ilícitas</li>
                <li>Fraude o suplantación de identidad</li>
                <li>Difusión de contenido ilegal</li>
                <li>Vulneración de derechos de terceros</li>
                <li>Actividades contrarias a la legislación chilena o internacional aplicable</li>
              </ul>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                3ClicAds podrá suspender o rechazar servicios cuando existan indicios razonables de uso indebido.
              </p>
            </section>

            {/* 10. Limitación de responsabilidad */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                10. Limitación de responsabilidad
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                La responsabilidad total de 3ClicAds derivada de cualquier servicio contratado estará limitada al monto
                efectivamente pagado por el cliente por dicho servicio.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                En ningún caso la empresa será responsable por daños indirectos, lucro cesante, pérdida de oportunidades
                comerciales o perjuicios derivados de decisiones tomadas por el cliente.
              </p>
            </section>

            {/* 11. Protección de datos */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                11. Protección de datos
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Los datos proporcionados por los clientes serán utilizados exclusivamente para fines relacionados con la
                prestación de servicios, atención comercial, cumplimiento legal y gestión administrativa.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                3ClicAds adoptará medidas razonables para proteger la información recibida de sus clientes.
              </p>
            </section>

            {/* 12. Modificaciones */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                12. Modificaciones
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                3ClicAds podrá modificar los presentes Términos y Condiciones cuando resulte necesario para adecuarlos a
                cambios operativos, comerciales o legales.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                Las modificaciones serán publicadas en el sitio web correspondiente.
              </p>
            </section>

            {/* 13. Ley aplicable */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                13. Ley aplicable y jurisdicción
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Los presentes Términos y Condiciones se regirán por las leyes de la República de Chile.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                Cualquier controversia derivada de la interpretación o ejecución de estos términos será sometida a los
                tribunales competentes de Chile.
              </p>
            </section>

            {/* 14. Contacto */}
            <section className="pt-6 border-t border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                14. Contacto
              </h2>
              <div className="bg-card border border-border rounded-lg p-6 space-y-2">
                <p className="text-base font-semibold text-foreground">
                  CONSULTORIAS EMPRESARIALES ALEJANDRO MATTEUCCI E.I.R.L.
                </p>
                <p className="text-sm text-muted-foreground">Nombre comercial: 3ClicAds</p>
                <p className="text-sm text-muted-foreground">RUT: 76.891.976-3</p>
                <p className="text-sm text-muted-foreground">
                  Correo: <a href="mailto:contacto@3clicads.com" className="text-primary hover:underline">contacto@3clicads.com</a>
                </p>
                <p className="text-sm text-muted-foreground">Teléfono: +56 9 6765 8939</p>
                <p className="text-sm text-muted-foreground">Dirección: Vitacura 7181, Santiago, Chile</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center text-xs text-muted-foreground font-mono">
        © {new Date().getFullYear()} 3clicAds
      </footer>
    </div>
  );
};

export default TerminosCondiciones;
