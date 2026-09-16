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
            Política de Privacidad y Tratamiento de Datos Personales
          </h1>
          <p className="text-sm text-muted-foreground mb-12">
            Última actualización: 15 de septiembre de 2026
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            {/* 1. Identificación del responsable */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                1. Identificación del Responsable del Tratamiento
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Alejandro Andrés Matteucci Pizarro</strong>, operando bajo el nombre comercial{' '}
                <strong className="text-foreground">3ClicAds</strong>, con NIT 700228703-9, domicilio en CR 26 71 B 30, Bogotá
                D.C., Colombia, correo electrónico{' '}
                <a href="mailto:contacto@3clicads.com" className="text-primary hover:underline">contacto@3clicads.com</a>,{' '}
                <a href="mailto:cupodolar24@gmail.com" className="text-primary hover:underline">cupodolar24@gmail.com</a> y
                teléfono +57 3001234567, es el responsable del tratamiento de los datos personales recopilados a través del
                sitio web 3clicads.com y durante la prestación de sus servicios.
              </p>
            </section>

            {/* 2. Marco legal */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                2. Marco Legal
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                La presente Política de Privacidad se rige por la legislación de la República de Colombia, especialmente por
                la Ley Estatutaria 1581 de 2012, el Decreto Reglamentario 1377 de 2013 y demás normas concordantes sobre
                protección de datos personales (Habeas Data).
              </p>
            </section>

            {/* 3. Datos personales recopilados */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                3. Datos Personales Recopilados
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-3">
                3ClicAds podrá recolectar, almacenar y tratar los siguientes datos personales de clientes, usuarios y prospectos:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground ml-4">
                <li><strong className="text-foreground">Datos de identificación:</strong> Nombre completo, número de documento de identidad (C.C., C.E., Pasaporte o NIT).</li>
                <li><strong className="text-foreground">Datos de contacto:</strong> Correo electrónico, número telefónico, dirección física y domicilio comercial.</li>
                <li><strong className="text-foreground">Datos de facturación y pago:</strong> Información necesaria para la emisión de facturas y procesamiento de transacciones.</li>
                <li><strong className="text-foreground">Datos de navegación y uso:</strong> Dirección IP, datos analíticos de interacción con el sitio web y registros de acceso.</li>
              </ul>
            </section>

            {/* 4. Finalidad del tratamiento */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                4. Finalidad del Tratamiento de los Datos
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-3">
                Los datos personales recolectados serán utilizados exclusivamente para las siguientes finalidades:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground ml-4">
                <li>Prestación, ejecución y administración de los servicios contratados de marketing digital, SEO programático y analítica.</li>
                <li>Procesamiento de pagos, facturación y gestión de cobro.</li>
                <li>Verificación de identidad, prevención de fraude y cumplimiento de procesos de auditoría KYC/KYB requeridos por procesadores de pago y autoridades.</li>
                <li>Envío de comunicaciones comerciales, cotizaciones, soporte técnico y actualizaciones de los servicios.</li>
                <li>Cumplimiento de obligaciones legales, contables y tributarias según la legislación colombiana.</li>
              </ul>
            </section>

            {/* 5. Derechos de los titulares */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                5. Derechos de los Titulares de los Datos (Habeas Data)
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-3">
                De conformidad con el artículo 8 de la Ley 1581 de 2012, los titulares de los datos tienen derecho a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground ml-4">
                <li>Conocer, actualizar y rectificar sus datos personales frente a 3ClicAds.</li>
                <li>Solicitar prueba de la autorización otorgada para el tratamiento de sus datos.</li>
                <li>Ser informados sobre el uso que se le ha dado a sus datos personales.</li>
                <li>Presentar ante la Superintendencia de Industria y Comercio (SIC) quejas por infracciones a la normativa de protección de datos.</li>
                <li>Revocar la autorización y/o solicitar la supresión de sus datos cuando no se respeten los principios, derechos y garantías constitucionales y legales.</li>
              </ul>
            </section>

            {/* 6. Procedimiento para ejercicio de derechos */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                6. Procedimiento para el Ejercicio de Derechos
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Para ejercer cualquiera de los derechos de acceso, rectificación, actualización o supresión de datos, el
                titular podrá enviar una solicitud por escrito al correo electrónico{' '}
                <a href="mailto:contacto@3clicads.com" className="text-primary hover:underline">contacto@3clicads.com</a>,{' '}
                <a href="mailto:cupodolar24@gmail.com" className="text-primary hover:underline">cupodolar24@gmail.com</a> o
                a la dirección física CR 26 71 B 30, Bogotá D.C., Colombia.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-3">
                La solicitud deberá contener: nombre del titular, descripción clara de la petición, datos de contacto para
                notificación y copia del documento de identidad.
              </p>
            </section>

            {/* 7. Seguridad de la información */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                7. Seguridad de la Información
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                3ClicAds adopta medidas de seguridad técnicas, administrativas y humanas razonables para proteger la información
                personal contra acceso no autorizado, pérdida, alteración o divulgación.
              </p>
            </section>

            {/* 8. Transferencia y transmisión a terceros */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                8. Transferencia y Transmisión de Datos a Terceros
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                3ClicAds no venderá, alquilará ni cederá datos personales a terceros. Los datos podrán ser transmitidos a
                proveedores de servicios tecnológicos, plataformas de analítica y pasarelas de pago (como procesadores KYB/KYC)
                únicamente en la medida en que sea necesario para la ejecución del servicio contratado y el cumplimiento legal.
              </p>
            </section>

            {/* 9. Modificaciones */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                9. Modificaciones a la Política de Privacidad
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                3ClicAds se reserva el derecho de modificar esta Política de Privacidad en cualquier momento. Cualquier cambio
                será publicado de manera oportuna en el sitio web 3clicads.com.
              </p>
            </section>

            {/* 10. Contacto */}
            <section className="pt-6 border-t border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                10. Contacto
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Para cualquier duda o requerimiento referente al tratamiento de datos personales:
              </p>
              <div className="bg-card border border-border rounded-lg p-6 space-y-2">
                <p className="text-base font-semibold text-foreground">
                  Alejandro Andrés Matteucci Pizarro (3ClicAds)
                </p>
                <p className="text-sm text-muted-foreground">NIT: 700228703-9</p>
                <p className="text-sm text-muted-foreground">
                  Correo: <a href="mailto:contacto@3clicads.com" className="text-primary hover:underline">contacto@3clicads.com</a> / <a href="mailto:cupodolar24@gmail.com" className="text-primary hover:underline">cupodolar24@gmail.com</a>
                </p>
                <p className="text-sm text-muted-foreground">Teléfono: +57 3001234567</p>
                <p className="text-sm text-muted-foreground">Dirección: CR 26 71 B 30, Bogotá D.C., Colombia</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center text-xs text-muted-foreground font-mono">
        <div className="space-y-2">
          <div>
            Contacto: <a href="mailto:contacto@3clicads.com" className="text-primary hover:text-foreground transition-colors font-semibold text-sm">contacto@3clicads.com</a> | <a href="mailto:cupodolar24@gmail.com" className="text-primary hover:text-foreground transition-colors font-semibold text-sm">cupodolar24@gmail.com</a>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link to="/terminos-condiciones" className="hover:text-foreground transition-colors">Términos y Condiciones</Link>
            <span className="text-border">|</span>
            <Link to="/politica-privacidad" className="hover:text-foreground transition-colors">Política de Privacidad</Link>
          </div>
          <div className="mt-2">© {new Date().getFullYear()} 3clicAds</div>
        </div>
      </footer>
    </div>
  );
};

export default PoliticaPrivacidad;
