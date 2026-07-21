import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, ArrowLeft, ShieldCheck } from "lucide-react";

const PoliticaPrivacidad = () => {
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
          <div className="flex items-center gap-3 mb-4 text-primary">
            <ShieldCheck className="w-8 h-8" />
            <span className="text-sm font-semibold tracking-wider uppercase">Privacidad y Protección de Datos</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Política de Privacidad
          </h1>
          <p className="text-sm text-muted-foreground mb-12">
            Última actualización: {new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-slate-300">
            {/* Empresa */}
            <section className="pb-6 border-b border-border">
              <p className="text-base text-muted-foreground leading-relaxed">
                En <strong className="text-foreground">3ClicAds</strong> (operado por <strong className="text-foreground">CONSULTORIAS EMPRESARIALES ALEJANDRO MATTEUCCI E.I.R.L.</strong>, RUT 76.891.976-3), nos tomamos muy en serio la privacidad de nuestros usuarios y la seguridad de sus datos. Esta política describe cómo recopilamos, usamos y protegemos la información personal y los datos de las API conectadas.
              </p>
              <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                <p>Contacto de privacidad: <a href="mailto:contacto@3clicads.com" className="text-primary hover:underline">contacto@3clicads.com</a></p>
                <p>Dirección: Vitacura 7181, Santiago, Chile.</p>
              </div>
            </section>

            {/* 1. Información Recopilada */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">1. Información que Recopilamos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos recopilar la siguiente información cuando utilizas nuestro servicio:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Datos de Cuenta:</strong> Nombre, correo electrónico y datos de facturación al registrarte.</li>
                <li><strong className="text-foreground">Datos de Campaña:</strong> URLs de sitios web ingresados para análisis, palabras clave y textos generados.</li>
                <li><strong className="text-foreground">Datos de Integración de Google:</strong> Si conectas tu cuenta mediante OAuth de Google, recopilamos la información mínima autorizada para la gestión y creación de campañas de Google Ads.</li>
              </ul>
            </section>

            {/* 2. Uso de Datos de Google API */}
            <section className="space-y-3 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                2. Cumplimiento de la Política de Datos de Usuario de las API de Google
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                El uso y la transferencia a cualquier otra aplicación de la información recibida a través de las API de Google por parte de 3ClicAds se adherirán a la <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Política de Datos de Usuario de los Servicios de API de Google</a>, incluidos los requisitos de Uso Limitado.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                No vendemos, alquilamos ni compartimos tus datos de Google Ads con terceros ni los utilizamos para entrenar modelos de Inteligencia Artificial públicos no autorizados.
              </p>
            </section>

            {/* 3. Uso de la Información */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">3. Uso de la Información</h2>
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos la información recopilada únicamente para:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Generar y optimizar estructuras de campañas publicitarias con IA.</li>
                <li>Permitir la exportación e integración directa de anuncios a tu cuenta de Google Ads.</li>
                <li>Proporcionar soporte técnico y notificaciones sobre el estado de tu cuenta.</li>
              </ul>
            </section>

            {/* 4. Seguridad de los Datos */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">4. Seguridad y Almacenamiento</h2>
              <p className="text-muted-foreground leading-relaxed">
                Implementamos medidas de seguridad estándar de la industria, como cifrado SSL/TLS en tránsito y almacenamiento cifrado de credenciales de acceso. Tus tokens de API se almacenan de forma segura y se pueden revocar en cualquier momento desde la configuración de tu cuenta de Google.
              </p>
            </section>

            {/* 5. Derechos del Usuario */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">5. Tus Derechos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Tienes derecho a acceder, corregir o solicitar la eliminación total de tus datos personales almacenados en 3ClicAds en cualquier momento enviando un correo a <a href="mailto:contacto@3clicads.com" className="text-primary hover:underline">contacto@3clicads.com</a>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PoliticaPrivacidad;
