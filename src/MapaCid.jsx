import React, { useState, useMemo, useCallback } from 'react';
import {
  Shield, Lock, CheckCircle, RefreshCw, AlertTriangle, Eye, FileText, Server, Users,
  Database, Globe, ArrowRight, TrendingUp, RotateCcw, Search, Target, ChevronDown,
  ChevronRight, Bookmark, Filter, Settings, Cpu, Zap, Briefcase, Key, Home, Link2, GitBranch,
  HelpCircle, Lightbulb, TrendingDown, Layers, Code, UserCheck, CheckSquare, List, Activity,
  BookOpen
} from 'lucide-react';

// ====================================================================
// --- 1. DATOS Y ESTRUCTURA DE LA INFORMACIÓN (Base ISO 27001) ---
// ====================================================================

// --- DATOS CID ---
const PILARES_CID = [
  { id: 'confidencialidad', titulo: 'Confidencialidad', subtitulo: 'Confidentiality', icono: Lock, color: 'from-blue-500 to-indigo-600', colorBg: 'bg-blue-50', colorBorder: 'border-blue-500', colorText: 'text-blue-900', definicion: 'Garantizar que la información sea accesible solo para personas autorizadas.', amenazas: [{ icono: Eye, texto: 'Acceso no autorizado', descripcion: 'Personas sin permisos acceden a datos sensibles' }, { icono: Globe, texto: 'Fuga de información', descripcion: 'Divulgación accidental o intencional de datos' }, { icono: Users, texto: 'Ingeniería social', descripcion: 'Manipulación para obtener información confidencial' }], controles: [{ icono: Shield, texto: 'Control de acceso', codigo: 'A.9.1', descripcion: 'Políticas de acceso basadas en roles (RBAC)' }, { icono: Lock, texto: 'Cifrado de datos', codigo: 'A.10.1', descripcion: 'Encriptación en reposo y en tránsito (AES-256, TLS)' }, { icono: FileText, texto: 'Clasificación', codigo: 'A.8.2', descripcion: 'Etiquetado de información según sensibilidad' }], ejemplos: ['Contraseñas robustas y autenticación multifactor (MFA)', 'Cifrado de bases de datos con información personal', 'Acuerdos de confidencialidad (NDA) con empleados'] },
  { id: 'integridad', titulo: 'Integridad', subtitulo: 'Integrity', icono: CheckCircle, color: 'from-green-500 to-emerald-600', colorBg: 'bg-green-50', colorBorder: 'border-green-500', colorText: 'text-green-900', definicion: 'Asegurar que la información sea precisa, completa y no haya sido alterada sin autorización.', amenazas: [{ icono: AlertTriangle, texto: 'Modificación no autorizada', descripcion: 'Alteración maliciosa de datos críticos' }, { icono: Database, texto: 'Corrupción de datos', descripcion: 'Errores en almacenamiento o transmisión' }, { icono: Server, texto: 'Inyección de código', descripcion: 'SQL injection, XSS, y otros ataques' }], controles: [{ icono: CheckCircle, texto: 'Controles de cambio', codigo: 'A.12.1', descripcion: 'Registro y aprobación de modificaciones' }, { icono: Shield, texto: 'Checksums y hashes', codigo: 'A.10.1', descripcion: 'Verificación de integridad con SHA-256' }, { icono: FileText, texto: 'Auditoría y logs', codigo: 'A.12.4', descripcion: 'Trazabilidad de todas las operaciones' }], ejemplos: ['Firmas digitales en documentos oficiales', 'Control de versiones en código fuente (Git)', 'Validación de entradas en formularios web'] },
  { id: 'disponibilidad', titulo: 'Disponibilidad', subtitulo: 'Availability', icono: RefreshCw, color: 'from-purple-500 to-pink-600', colorBg: 'bg-purple-50', colorBorder: 'border-purple-500', colorText: 'text-purple-900', definicion: 'Garantizar que los sistemas y la información estén disponibles cuando los usuarios autorizados los necesiten.', amenazas: [{ icono: AlertTriangle, texto: 'Ataques DDoS', descripcion: 'Saturación de servicios para dejarlos inaccesibles' }, { icono: Server, texto: 'Fallas de hardware', descripcion: 'Caída de servidores o infraestructura' }, { icono: Database, texto: 'Desastres naturales', descripcion: 'Incendios, inundaciones, terremotos' }], controles: [{ icono: RefreshCw, texto: 'Respaldos (Backups)', codigo: 'A.12.3', descripcion: 'Copias de seguridad automáticas y regulares' }, { icono: Server, texto: 'Redundancia', codigo: 'A.17.2', descripcion: 'Servidores espejo y balanceo de carga' }, { icono: Shield, texto: 'Plan de continuidad', codigo: 'A.17.1', descripcion: 'BCP y DRP para recuperación ante desastres' }], ejemplos: ['Replicación de datos en múltiples ubicaciones geográficas', 'Sistemas de energía ininterrumpida (UPS)', 'Monitoreo 24/7 y alertas automáticas'] }
];

// --- DATOS PDCA (simplificado) ---
const PDCA_FASES = [
  { id: 'planear', titulo: 'Planear (P)', color: 'bg-blue-600', icon: Target, descripcion: 'Establecer la política, objetivos, procesos y procedimientos del SGSI.', clausulas: ['4. Contexto', '5. Liderazgo', '6. Planificación'] },
  { id: 'hacer', titulo: 'Hacer (D)', color: 'bg-green-600', icon: ArrowRight, descripcion: 'Implementar y operar la política, los controles y los procesos del SGSI.', clausulas: ['7. Soporte', '8. Operación'] },
  { id: 'verificar', titulo: 'Verificar (C)', color: 'bg-yellow-600', icon: Eye, descripcion: 'Monitorear y revisar el rendimiento y la efectividad del SGSI.', clausulas: ['9. Evaluación del Desempeño'] },
  { id: 'actuar', titulo: 'Actuar (A)', color: 'bg-purple-600', icon: RotateCcw, descripcion: 'Tomar acciones para mejorar continuamente el SGSI.', clausulas: ['10. Mejora'] },
];

// --- DATOS DOMINIOS Y CONTROLES (COMPLETO) ---
const DOMINIOS_CONTROLES = [
  { id: 'A5', titulo: 'A.5 Políticas de seguridad de la información', icono: FileText, descripcion: 'Directrices para la dirección en relación con la seguridad.', controles: [{ codigo: 'A.5.1', nombre: 'Políticas de seguridad', detalle: 'Revisión y aprobación de la política.' }, { codigo: 'A.5.2', nombre: 'Revisión de las políticas', detalle: 'Se debe llevar a cabo una revisión periódica.' }] },
  { id: 'A6', titulo: 'A.6 Organización de la seguridad de la información', icono: Users, descripcion: 'Asignación de responsabilidades y organización interna.', controles: [{ codigo: 'A.6.1.1', nombre: 'Roles y responsabilidades', detalle: 'Definir y asignar responsabilidades.' }, { codigo: 'A.6.2.2', nombre: 'Seguridad en el trabajo a distancia', detalle: 'Políticas y controles para el teletrabajo.' }] },
  { id: 'A7', titulo: 'A.7 Seguridad de los recursos humanos', icono: Briefcase, descripcion: 'Asegurar que los empleados entiendan sus responsabilidades de seguridad.', controles: [{ codigo: 'A.7.1.1', nombre: 'Selección de personal', detalle: 'Verificación de antecedentes de candidatos.' }, { codigo: 'A.7.2.2', nombre: 'Formación en seguridad', detalle: 'Capacitación periódica al personal.' }] },
  { id: 'A8', titulo: 'A.8 Gestión de activos', icono: Database, descripcion: 'Protección de los activos de información y activos asociados.', controles: [{ codigo: 'A.8.1.1', nombre: 'Inventario de activos', detalle: 'Mantener un inventario claro y actualizado.' }, { codigo: 'A.8.2.1', nombre: 'Clasificación de la información', detalle: 'Clasificar la información según su valor.' }] },
  { id: 'A9', titulo: 'A.9 Control de acceso', icono: Key, descripcion: 'Restricción del acceso a la información y a las instalaciones de procesamiento.', controles: [{ codigo: 'A.9.2.1', nombre: 'Registro de usuario', detalle: 'Procedimiento formal para la asignación de accesos.' }, { codigo: 'A.9.4.1', nombre: 'Política de contraseñas', detalle: 'Exigir el uso de contraseñas robustas y únicas.' }] },
  { id: 'A10', titulo: 'A.10 Cifrado', icono: Lock, descripcion: 'Asegurar el uso correcto y efectivo de todas las formas de cifrado.', controles: [{ codigo: 'A.10.1.1', nombre: 'Política sobre el uso de controles criptográficos', detalle: 'Desarrollar e implementar una política para el uso de cifrado.' }] },
  { id: 'A11', titulo: 'A.11 Seguridad física y del entorno', icono: Home, descripcion: 'Prevención de accesos no autorizados, daños e interferencias a las instalaciones.', controles: [{ codigo: 'A.11.1.2', nombre: 'Seguridad de los equipos', detalle: 'Protección contra amenazas físicas y ambientales.' }, { codigo: 'A.11.2.1', nombre: 'Controles de entrada física', detalle: 'Uso de tarjetas, biometría o personal de seguridad.' }] },
  { id: 'A12', titulo: 'A.12 Operaciones de seguridad', icono: Settings, descripcion: 'Asegurar la operación correcta y segura de los sistemas.', controles: [{ codigo: 'A.12.1.2', nombre: 'Gestión del cambio', detalle: 'Controlar los cambios a los sistemas y procesos.' }, { codigo: 'A.12.3.1', nombre: 'Copia de respaldo', detalle: 'Políticas de copias de seguridad de la información.' }] },
  { id: 'A13', titulo: 'A.13 Seguridad de las comunicaciones', icono: Link2, descripcion: 'Protección de la información en redes y sistemas de comunicación.', controles: [{ codigo: 'A.13.1.1', nombre: 'Controles de red', detalle: 'Segmentación de red y uso de firewalls.' }, { codigo: 'A.13.2.1', nombre: 'Transferencia de información', detalle: 'Acuerdos formales para la transferencia segura.' }] },
  { id: 'A14', titulo: 'A.14 Adquisición, desarrollo y mantenimiento de sistemas', icono: Cpu, descripcion: 'Integrar la seguridad en el ciclo de vida del desarrollo de sistemas (SDLC).', controles: [{ codigo: 'A.14.2.5', nombre: 'Principios de ingeniería de sistemas seguros', detalle: 'Establecer reglas para el desarrollo seguro.' }, { codigo: 'A.14.2.8', nombre: 'Pruebas de penetración', detalle: 'Realizar pruebas antes de la puesta en marcha.' }] },
  { id: 'A15', titulo: 'A.15 Relaciones con los proveedores', icono: GitBranch, descripcion: 'Mantener un nivel acordado de seguridad de la información con proveedores.', controles: [{ codigo: 'A.15.1.2', nombre: 'Acuerdos de seguridad', detalle: 'Incluir requisitos de seguridad en los contratos (SLA/NDA).' }, { codigo: 'A.15.2.1', nombre: 'Monitoreo de servicios', detalle: 'Auditoría y revisión de los servicios de proveedores.' }] },
  { id: 'A16', titulo: 'A.16 Gestión de incidentes de seguridad de la información', icono: AlertTriangle, descripcion: 'Gestionar las vulnerabilidades y los incidentes de forma coherente y eficaz.', controles: [{ codigo: 'A.16.1.7', nombre: 'Recolección de evidencia', detalle: 'Procedimientos forenses para recolectar evidencia de incidentes.' }, { codigo: 'A.16.1.2', nombre: 'Notificación de incidentes', detalle: 'Establecer puntos de contacto para reportar fallas.' }] },
  { id: 'A17', titulo: 'A.17 Aspectos de la seguridad de la información para la continuidad del negocio', icono: Zap, descripcion: 'Mantener la continuidad del negocio y la recuperación ante desastres.', controles: [{ codigo: 'A.17.1.1', nombre: 'Planificación de la continuidad', detalle: 'Documentar procesos para mantener la operación.' }, { codigo: 'A.17.2.1', nombre: 'Disponibilidad de recursos', detalle: 'Asegurar que los recursos críticos estén disponibles.' }] },
  { id: 'A18', titulo: 'A.18 Cumplimiento', icono: CheckCircle, descripcion: 'Evitar el incumplimiento de cualquier ley, requisito estatutario o contractual.', controles: [{ codigo: 'A.18.1.1', nombre: 'Identificación de la legislación aplicable', detalle: 'Documentar leyes, reglamentos y cláusulas contractuales.' }, { codigo: 'A.18.2.3', nombre: 'Cumplimiento con las políticas', detalle: 'Auditorías internas y externas.' }] },
];

// ====================================================================
// --- 2. DATOS DEL CUESTIONARIO (Aumentado a 15 preguntas) ---
// ====================================================================

const QUIZ_QUESTIONS = [
  {
    id: 1,
    pregunta: "¿Qué pilar de la Tríada C.I.D. se enfoca en asegurar que los datos no hayan sido modificados sin autorización?",
    opciones: ["Confidencialidad", "Disponibilidad", "Integridad", "Autenticidad"],
    respuesta: "Integridad",
    explicacion: "La Integridad garantiza la precisión y completitud de la información, asegurando que no ha sido alterada sin permiso."
  },
  {
    id: 2,
    pregunta: "¿Cuál es el propósito del ciclo PDCA en el contexto de la ISO 27001?",
    opciones: ["Definir los activos y los riesgos", "Asegurar el cumplimiento legal", "Implementar el Control de Acceso", "Establecer un proceso de mejora continua del SGSI"],
    respuesta: "Establecer un proceso de mejora continua del SGSI",
    explicacion: "El ciclo PDCA (Planificar, Hacer, Verificar, Actuar) es el marco que utiliza la ISO 27001 para la gestión continua y la mejora del Sistema de Gestión de Seguridad de la Información (SGSI)."
  },
  {
    id: 3,
    pregunta: "¿A qué Dominio (A.X) de la ISO 27001 pertenece el control 'Política de contraseñas' (A.9.4.1)?",
    opciones: ["A.7 Recursos Humanos", "A.10 Cifrado", "A.9 Control de acceso", "A.12 Operaciones de seguridad"],
    respuesta: "A.9 Control de acceso",
    explicacion: "El control de contraseñas (A.9.4.1) es parte del Dominio A.9, que se centra en las políticas y procedimientos para restringir el acceso a los sistemas y la información."
  },
  {
    id: 4,
    pregunta: "Si una empresa sufre un ataque de Denegación de Servicio (DDoS), ¿qué pilar de la C.I.D. se ve directamente comprometido?",
    opciones: ["Confidencialidad", "Integridad", "Disponibilidad", "Autenticidad"],
    respuesta: "Disponibilidad",
    explicacion: "Un ataque DDoS busca saturar los recursos, haciendo que los sistemas y la información sean inaccesibles para los usuarios autorizados, comprometiendo directamente la Disponibilidad."
  },
  {
    id: 5,
    pregunta: "¿Qué fase del PDCA se relaciona con las cláusulas de 'Evaluación del Desempeño' (Cláusula 9) de la ISO 27001?",
    opciones: ["Planear (P)", "Hacer (D)", "Verificar (C)", "Actuar (A)"],
    respuesta: "Verificar (C)",
    explicacion: "La fase de Verificar (C) implica monitorear, medir, analizar y evaluar el desempeño del SGSI."
  },
  {
    id: 6,
    pregunta: "El control A.6.1.2 'Apreciación de riesgos de la información' es fundamental. ¿Qué debe producir esta apreciación de forma obligatoria?",
    opciones: ["La Declaración de Aplicabilidad (SoA)", "La lista de activos del negocio", "Un Plan de Tratamiento de Riesgos (PTR)", "Una copia de seguridad de todos los datos"],
    respuesta: "Un Plan de Tratamiento de Riesgos (PTR)",
    explicacion: "La apreciación de riesgos debe identificar los riesgos y, a continuación, se debe generar un Plan de Tratamiento de Riesgos que especifique cómo se abordará cada riesgo aceptable o inaceptable."
  },
  {
    id: 7,
    pregunta: "¿Qué dominio (A.X) se encarga principalmente de los controles relacionados con cámaras de seguridad y barreras de entrada a un centro de datos?",
    opciones: ["A.8 Gestión de Activos", "A.11 Seguridad física y del entorno", "A.9 Control de Acceso", "A.17 Continuidad del Negocio"],
    respuesta: "A.11 Seguridad física y del entorno",
    explicacion: "El Dominio A.11 se centra en prevenir el acceso no autorizado a las áreas físicas, los daños y las interferencias a las instalaciones de procesamiento de información."
  },
  {
    id: 8,
    pregunta: "Según el Dominio A.16, ¿cuál es el primer paso en la Gestión de Incidentes de Seguridad de la Información?",
    opciones: ["Recolección de evidencia forense", "Comunicación a la alta dirección", "Plan de recuperación ante desastres", "Notificación y reporte de los eventos de seguridad"],
    respuesta: "Notificación y reporte de los eventos de seguridad",
    explicacion: "La gestión de incidentes comienza con la detección y el reporte rápido de un evento de seguridad, lo cual permite la acción correctiva oportuna."
  },
  {
    id: 9,
    pregunta: "Si una función hash (ej. SHA-256) falla, ¿qué pilar de la C.I.D. se vería directamente comprometido en el proceso de verificación de un archivo?",
    opciones: ["Confidencialidad", "Integridad", "Disponibilidad", "Trazabilidad"],
    respuesta: "Integridad",
    explicacion: "Las funciones hash se utilizan para verificar que un archivo no ha sido alterado desde su creación, por lo que su fallo impacta directamente la Integridad del dato."
  },
  {
    id: 10,
    pregunta: "El control A.15.1.2 requiere incluir requisitos de seguridad en acuerdos con proveedores. ¿Cuál es el objetivo principal de este control?",
    opciones: ["Garantizar la confidencialidad de los datos del proveedor", "Asegurar que los servicios de terceros cumplan con el SGSI de la organización", "Transferir la responsabilidad del riesgo al proveedor", "Reducir el coste de los servicios contratados"],
    respuesta: "Asegurar que los servicios de terceros cumplan con el SGSI de la organización",
    explicacion: "El Dominio A.15 busca mantener el nivel de seguridad acordado, exigiendo al proveedor contractual que siga las políticas y controles necesarios de la empresa contratante."
  },
  {
    id: 11,
    pregunta: "¿Cuál es el propósito de la 'Declaración de Aplicabilidad' (SoA) en ISO 27001?",
    opciones: ["Detallar la política de seguridad de la información", "Documentar todos los incidentes de seguridad ocurridos", "Definir el alcance exacto del SGSI", "Enumerar y justificar los controles del Anexo A que se han implementado o excluido"],
    respuesta: "Enumerar y justificar los controles del Anexo A que se han implementado o excluido",
    explicacion: "La SoA es un documento crucial que lista los controles del Anexo A que se aplican al SGSI y justifica su inclusión o exclusión basándose en la evaluación de riesgos."
  },
  {
    id: 12,
    pregunta: "Una política de 'escritorio limpio' (clear desk policy) está directamente relacionada con la protección de información de ¿qué pilar de la C.I.D.?",
    opciones: ["Disponibilidad", "Integridad", "Confidencialidad", "Cumplimiento"],
    respuesta: "Confidencialidad",
    explicacion: "La política de escritorio limpio previene que documentos sensibles, contraseñas escritas o dispositivos se dejen a la vista, evitando el acceso no autorizado y manteniendo la Confidencialidad."
  },
  {
    id: 13,
    pregunta: "La gestión del cambio (A.12.1.2) requiere que se evalúe el impacto de seguridad antes de implementar modificaciones. Esto se alinea principalmente con:",
    opciones: ["La fase 'Verificar' del PDCA", "La fase 'Actuar' del PDCA", "La fase 'Planear' del PDCA", "La fase 'Hacer' del PDCA"],
    respuesta: "La fase 'Hacer' del PDCA",
    explicacion: "La gestión del cambio forma parte de la Operación (Cláusula 8), que se ejecuta en la fase 'Hacer' (D) del ciclo PDCA."
  },
  {
    id: 14,
    pregunta: "Si tu aplicación usa un servicio en la nube para almacenamiento de datos sensibles, el control A.18.1.1 (Identificación de legislación aplicable) te obliga a:",
    opciones: ["Cifrar todos los datos sin excepción", "Asegurar un SLA de 99.99%", "Revisar y documentar las leyes de protección de datos que aplican a esa jurisdicción", "Realizar una prueba de penetración trimestral"],
    respuesta: "Revisar y documentar las leyes de protección de datos que aplican a esa jurisdicción",
    explicacion: "El Dominio A.18 (Cumplimiento) obliga a la organización a identificar y documentar todas las leyes y regulaciones relevantes, como GDPR o CCPA, dependiendo de dónde se almacenen los datos."
  },
  {
    id: 15,
    pregunta: "¿Qué Dominio se enfoca en integrar la seguridad en el ciclo de vida del software, incluyendo la realización de pruebas de penetración antes del lanzamiento?",
    opciones: ["A.12 Operaciones de seguridad", "A.10 Cifrado", "A.14 Adquisición, desarrollo y mantenimiento de sistemas", "A.13 Seguridad de las comunicaciones"],
    respuesta: "A.14 Adquisición, desarrollo y mantenimiento de sistemas",
    explicacion: "El Dominio A.14 (Adquisición, desarrollo y mantenimiento de sistemas) asegura que los requisitos de seguridad sean considerados e implementados desde el diseño y durante todo el ciclo de vida del desarrollo."
  }
];


// ====================================================================
// --- 3. COMPONENTES: VISTA DE ISO 27001 (Reuso de MapaCID.jsx) ---
// ====================================================================

// Componente recursivo para renderizar Dominios y Controles
const ControlDomain = ({ dominio, searchTerm }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = dominio.icono;

  const filteredControls = dominio.controles.filter(control =>
    control.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    control.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dominio.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const shouldDisplayDomain = filteredControls.length > 0 || dominio.titulo.toLowerCase().includes(searchTerm.toLowerCase());

  if (!shouldDisplayDomain && searchTerm.length > 0) {
    return null;
  }

  const isHighlighted = dominio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm.length > 0;
  const shouldExpand = isExpanded || searchTerm.length > 0;

  return (
    <div className="border-l-4 border-gray-200 ml-4 mb-4">
      <div
        className={`flex items-center p-3 rounded-r-lg cursor-pointer transition-all duration-200 ${shouldExpand || isHighlighted ? 'bg-indigo-100' : 'hover:bg-gray-50'
          }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {shouldExpand ?
          <ChevronDown className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" /> :
          <ChevronRight className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" />
        }
        <Icon className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
        <span className={`font-bold text-gray-800 flex-grow ${isHighlighted ? 'text-indigo-700' : ''}`}>
          {dominio.titulo}
        </span>
      </div>

      {shouldExpand && (
        <p className="ml-10 text-sm text-gray-600 mt-1 mb-3 pr-4">
          {dominio.descripcion}
        </p>
      )}

      {shouldExpand && (
        <div className="ml-10 space-y-2 pt-2 transition-all duration-300">
          {filteredControls.map(control => (
            <div
              key={control.codigo}
              className={`p-3 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 ${searchTerm.length > 0 ? 'bg-white' : 'hover:bg-blue-50'
                }`}
            >
              <div className="flex items-center space-x-3">
                <Bookmark className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="font-mono text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full flex-shrink-0">
                  {control.codigo}
                </span>
                <p className="text-sm font-semibold text-gray-800 flex-grow">{control.nombre}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-7">{control.detalle}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL PARA EL MAPA COMPLETO ---
const ISO27001MapView = () => {
  const [activeSubView, setActiveSubView] = useState('cid'); // cid, pdca, controles
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de filtrado para Controles
  const filteredDomains = useMemo(() => {
    if (activeSubView !== 'controles' || !searchTerm) return DOMINIOS_CONTROLES;

    return DOMINIOS_CONTROLES.filter(dominio => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const titleMatch = dominio.titulo.toLowerCase().includes(lowerSearchTerm);
      const controlsMatch = dominio.controles.some(control =>
        control.codigo.toLowerCase().includes(lowerSearchTerm) ||
        control.nombre.toLowerCase().includes(lowerSearchTerm) ||
        dominio.descripcion.toLowerCase().includes(lowerSearchTerm)
      );
      return titleMatch || controlsMatch;
    });
  }, [searchTerm, activeSubView]);

  // --- Renderización de Vistas Internas ---

  // Componente: Vista CID
  const VistaCID = () => {
    const [pilarActivo, setPilarActivo] = useState(null);
    const pilarSeleccionado = PILARES_CID.find(p => p.id === pilarActivo);

    // Tarjeta Pilar
    const PilarCard = ({ pilar, isActive }) => {
      const Icon = pilar.icono;
      return (
        <div onClick={() => setPilarActivo(isActive ? null : pilar.id)} className={`relative cursor-pointer transform transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] ${isActive ? 'scale-[1.05] z-10' : ''}`}>
          <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${pilar.color} p-1 shadow-xl ${isActive ? 'shadow-2xl ring-4 ring-offset-2 ring-opacity-50 ring-indigo-400' : 'shadow-lg'}`}>
            <div className="w-full h-full bg-white rounded-2xl p-6 flex flex-col items-center justify-center">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${pilar.color} flex items-center justify-center mb-4`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-1">{pilar.titulo}</h3>
              <p className="text-xs text-gray-500 text-center">{pilar.definicion.substring(0, 50)}...</p>
            </div>
          </div>
        </div>
      );
    };

    // Detalles del pilar activo
    const DetallesCID = ({ pilarSeleccionado }) => (
      <div className={`${pilarSeleccionado.colorBg} border-2 ${pilarSeleccionado.colorBorder} rounded-2xl p-8 shadow-xl mt-8 animate-fade-in`}>
        <div className="grid md:grid-cols-3 gap-6">
          {['amenazas', 'controles', 'ejemplos'].map((section) => {
            const data = pilarSeleccionado[section];
            const isThreat = section === 'amenazas';
            const icon = isThreat ? AlertTriangle : (section === 'controles' ? Shield : FileText);
            const bgColor = isThreat ? 'bg-red-50' : (section === 'controles' ? 'bg-green-50' : 'bg-blue-50');
            const iconColor = isThreat ? 'text-red-600' : (section === 'controles' ? 'text-green-600' : 'text-blue-600');
            const title = isThreat ? 'Amenazas' : (section === 'controles' ? 'Controles' : 'Ejemplos');

            return (
              <div key={section} className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center space-x-2 mb-4">
                  {React.createElement(icon, { className: `w-5 h-5 ${iconColor}` })}
                  <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                </div>
                <div className="space-y-3">
                  {data.map((item, idx) => (
                    <div key={idx} className={`flex items-start space-x-3 p-3 rounded-lg ${bgColor}`}>
                      {isThreat ?
                        React.createElement(item.icono, { className: `w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5` }) :
                        <ArrowRight className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
                      }
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.texto || item.nombre || item}</p>
                        {item.descripcion && <p className="text-xs text-gray-600 mt-1">{item.descripcion}</p>}
                        {item.codigo && <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">{item.codigo}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

    return (
      <div className="p-4 sm:p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">La Tríada C.I.D. (Confidencialidad, Integridad, Disponibilidad)</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {PILARES_CID.map(pilar => (
            <PilarCard
              key={pilar.id}
              pilar={pilar}
              isActive={pilarActivo === pilar.id}
            />
          ))}
        </div>
        {pilarSeleccionado && <DetallesCID pilarSeleccionado={pilarSeleccionado} />}
      </div>
    );
  };

  // Componente: Vista PDCA
  const VistaPDCA = () => {
    const [faseActiva, setFaseActiva] = useState('planear');
    const faseSeleccionada = PDCA_FASES.find(f => f.id === faseActiva);

    const FaseButton = ({ fase }) => {
      const isActive = faseActiva === fase.id;
      const Icon = fase.icon;

      let positionClasses = 'col-span-1 row-span-1 flex justify-center items-center';
      if (fase.id === 'planear') positionClasses += ' md:justify-end md:items-end';
      if (fase.id === 'hacer') positionClasses += ' md:justify-start md:items-end';
      if (fase.id === 'verificar') positionClasses += ' md:justify-end md:items-start';
      if (fase.id === 'actuar') positionClasses += ' md:justify-start md:items-start';

      return (
        <div className={positionClasses}>
          <button
            onClick={() => setFaseActiva(fase.id)}
            className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center p-3 m-1 text-white shadow-xl 
              transition-all duration-300 transform border-4 border-white
              ${fase.color} ${isActive ? 'scale-105 ring-4 ring-offset-2 ring-white ring-opacity-70' : 'hover:scale-105 hover:shadow-2xl'}`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <p className="text-md font-bold text-center">{fase.titulo}</p>
          </button>
        </div>
      );
    };

    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Ciclo PDCA (Mejora Continua del SGSI)</h2>

        {/* Diagrama Circular (Grid 2x2) */}
        <div className="relative grid grid-cols-2 grid-rows-2 w-full max-w-lg h-[300px] mx-auto mb-8">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-4 h-4 bg-gray-400 rounded-full z-10 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-gray-300 animate-[spin_40s_linear_infinite]"></div>
          </div>

          {PDCA_FASES.map(fase => (
            <FaseButton key={fase.id} fase={fase} />
          ))}
        </div>

        {/* Detalles de la fase activa */}
        {faseSeleccionada && (
          <div className={`bg-gray-50 rounded-xl shadow-inner p-6 border-t-4 border-opacity-70 ${faseSeleccionada.color.replace('bg-', 'border-')} animate-fade-in`}>
            <div className="flex items-center space-x-3 mb-3">
              {React.createElement(faseSeleccionada.icon, { className: `w-6 h-6 ${faseSeleccionada.color.replace('bg-', 'text-')}` })}
              <h3 className={`text-2xl font-bold ${faseSeleccionada.color.replace('bg-', 'text-')}`}>
                {faseSeleccionada.titulo}
              </h3>
            </div>
            <p className="text-gray-700 mb-4">{faseSeleccionada.descripcion}</p>

            <h4 className="font-semibold text-gray-800 mb-2">Cláusulas ISO 27001 Asociadas:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              {faseSeleccionada.clausulas.map((clausula, idx) => (
                <li key={idx}>{clausula}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Componente: Vista Controles
  const VistaControles = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Dominios y Controles (ISO 27001: A.5 - A.18)
      </h2>

      <div className="relative mb-8 max-w-xl mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar control por código (ej: A.9.4.1) o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-150"
        />
      </div>

      <div className="space-y-4">
        {filteredDomains.map(dominio => (
          <ControlDomain
            key={dominio.id}
            dominio={dominio}
            searchTerm={searchTerm}
          />
        ))}
        {filteredDomains.length === 0 && searchTerm.length > 0 && (
          <div className="text-center p-10 bg-gray-50 rounded-lg text-gray-600">
            <Filter className="w-8 h-8 mx-auto mb-3 text-gray-400" />
            No se encontraron controles o dominios que coincidan con "{searchTerm}".
          </div>
        )}
      </div>
    </div>
  );

  // Renderización de la vista activa
  let CurrentView;
  switch (activeSubView) {
    case 'cid':
      CurrentView = VistaCID;
      break;
    case 'pdca':
      CurrentView = VistaPDCA;
      break;
    case 'controles':
      CurrentView = VistaControles;
      break;
    default:
      CurrentView = VistaCID;
  }

  // Pestañas de navegación interna
  const getSubTabClasses = (tab) =>
    `px-4 py-2 font-semibold text-sm rounded-t-lg transition-all duration-200 ${activeSubView === tab
      ? 'bg-white shadow-md text-indigo-600 border-b-2 border-indigo-600'
      : 'bg-gray-100 text-gray-600 hover:bg-white hover:text-indigo-500'
    }`;

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Mapa de Seguridad ISO 27001</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">La Estructura Completa del SGSI</p>

      <div className="flex justify-center border-b border-gray-200 mb-10 overflow-x-auto">
        <button className={getSubTabClasses('cid')} onClick={() => { setActiveSubView('cid'); setSearchTerm(''); }}>
          <Lock className="inline w-4 h-4 mr-2 -mt-1" />
          Tríada C.I.D.
        </button>
        <button className={getSubTabClasses('pdca')} onClick={() => { setActiveSubView('pdca'); setSearchTerm(''); }}>
          <RotateCcw className="inline w-4 h-4 mr-2 -mt-1" />
          Ciclo PDCA
        </button>
        <button className={getSubTabClasses('controles')} onClick={() => setActiveSubView('controles')}>
          <Search className="inline w-4 h-4 mr-2 -mt-1" />
          Dominios (A.5-A.18)
        </button>
      </div>

      <CurrentView />
    </div>
  );
};


// ====================================================================
// --- 4. COMPONENTES: CUESTIONARIO DE SEGURIDAD (Quiz Interactivo) ---
// ====================================================================

const SecurityQuizView = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleAnswerClick = (answer) => {
    if (showResult) return; // Prevent clicking while showing result

    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentQuestion.respuesta) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    const percentage = (score / QUIZ_QUESTIONS.length) * 100;
    const resultMessage = percentage === 100 ? "¡Resultado Perfecto! Eres un experto en SGSI." :
      percentage >= 70 ? "¡Excelente! Tienes un gran dominio de los conceptos clave." :
        "Buen intento, pero aún hay áreas para mejorar. ¡Repasa y vuelve a intentarlo!";
    const resultColor = percentage === 100 ? 'bg-green-600' : (percentage >= 70 ? 'bg-indigo-600' : 'bg-red-600');
    const resultIcon = percentage === 100 ? CheckSquare : (percentage >= 70 ? UserCheck : RefreshCw);

    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Cuestionario Terminado</h2>
        <div className={`p-6 rounded-xl text-white ${resultColor} mb-6`}>
          {React.createElement(resultIcon, { className: "w-10 h-10 mx-auto mb-3" })}
          <p className="text-5xl font-bold mb-2">{score} / {QUIZ_QUESTIONS.length}</p>
          <p className="text-2xl font-semibold">{percentage.toFixed(0)}% de acierto</p>
        </div>
        <p className="text-xl text-gray-700 mb-6">{resultMessage}</p>
        <button
          onClick={handleRestartQuiz}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-transform transform hover:scale-[1.02] shadow-lg"
        >
          <RefreshCw className="inline w-5 h-5 mr-2 -mt-1" />
          Reiniciar Cuestionario
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <p className="text-lg font-semibold text-indigo-600">
          Pregunta {currentQuestionIndex + 1} de {QUIZ_QUESTIONS.length}
        </p>
        <p className="text-lg font-semibold text-gray-700">
          Puntuación: {score}
        </p>
      </div>

      {/* Pregunta */}
      <div className="mb-8">
        <p className="text-2xl font-bold text-gray-800 leading-relaxed">
          <HelpCircle className="inline w-6 h-6 mr-3 text-indigo-500" />
          {currentQuestion.pregunta}
        </p>
      </div>

      {/* Opciones */}
      <div className="space-y-4 mb-8">
        {currentQuestion.opciones.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentQuestion.respuesta;

          let classes = 'p-4 rounded-xl shadow-md transition-all duration-200 cursor-pointer text-gray-800';

          if (showResult) {
            if (isCorrect) {
              classes += ' bg-green-200 border-2 border-green-600 font-bold';
            } else if (isSelected && !isCorrect) {
              classes += ' bg-red-200 border-2 border-red-600 line-through';
            } else {
              classes += ' bg-gray-100 hover:bg-gray-200';
            }
          } else {
            classes += ' bg-gray-50 hover:bg-indigo-50 hover:shadow-lg active:scale-[0.99]';
          }

          return (
            <div
              key={index}
              className={classes}
              onClick={() => handleAnswerClick(option)}
            >
              <span className="font-mono text-sm mr-3 text-indigo-500">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </div>
          );
        })}
      </div>

      {/* Resultado y Explicación */}
      {showResult && (
        <div className={`p-4 rounded-xl border-l-4 ${selectedAnswer === currentQuestion.respuesta ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'} mb-6 animate-fade-in`}>
          <p className="font-bold text-lg mb-2 flex items-center">
            <Lightbulb className={`w-5 h-5 mr-2 ${selectedAnswer === currentQuestion.respuesta ? 'text-green-600' : 'text-red-600'}`} />
            Explicación:
          </p>
          <p className="text-gray-700">{currentQuestion.explicacion}</p>
        </div>
      )}

      {/* Botón Siguiente */}
      <div className="text-right">
        <button
          onClick={handleNextQuestion}
          disabled={!showResult}
          className={`font-bold py-3 px-6 rounded-xl transition-all duration-300 transform shadow-md ${showResult
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02]'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
        >
          {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Cuestionario'}
        </button>
      </div>
    </div>
  );
};

// ====================================================================
// --- 5. COMPONENTES: CASO DE ESTUDIO (Híbrido DB) ---
// ====================================================================

const CaseStudyView = () => {

  const dataClassification = [
    { type: 'Confidencialidad Alta (Cifrado Mandatorio)', data: 'Contraseñas hasheadas de usuarios, Tokens de API, Información de tarjetas de crédito (PCI DSS).', pilar: 'Confidencialidad', db: 'MongoDB Atlas' },
    { type: 'Integridad Alta (Transaccional)', data: 'Historial de pagos, Balances de cuentas, Registros de auditoría (logs) de seguridad.', pilar: 'Integridad', db: 'MySQL' },
    { type: 'Disponibilidad Media (Estructurada)', data: 'Nombres de usuario, Catálogo de productos, Precios estables.', pilar: 'Disponibilidad', db: 'MySQL' },
    { type: 'Disponibilidad Alta (Escalable, No Estructurada)', data: 'Comentarios de usuarios, Datos de clics (analytics), Registros de sesión (logs de aplicación).', pilar: 'Disponibilidad', db: 'MongoDB Atlas' },
  ];

  const PilarIcon = ({ pilar }) => {
    let Icon;
    let color;
    switch (pilar) {
      case 'Confidencialidad': Icon = Lock; color = 'text-blue-500 bg-blue-100'; break;
      case 'Integridad': Icon = CheckCircle; color = 'text-green-500 bg-green-100'; break;
      case 'Disponibilidad': Icon = RefreshCw; color = 'text-purple-500 bg-purple-100'; break;
      default: Icon = Layers; color = 'text-gray-500 bg-gray-100';
    }
    return <div className={`p-2 rounded-full ${color}`}>{React.createElement(Icon, { className: "w-5 h-5" })}</div>;
  };

  const DbIcon = ({ db }) => {
    let iconText;
    let color;
    if (db.includes('MongoDB')) {
      iconText = 'MDB';
      color = 'text-green-700 bg-green-200';
    } else {
      iconText = 'SQL';
      color = 'text-blue-700 bg-blue-200';
    }
    return <span className={`font-mono text-xs font-bold px-3 py-1 rounded-full ${color}`}>{iconText}</span>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Caso de Estudio: Estrategia de BD Híbrida (MongoDB Atlas vs. MySQL)
      </h2>
      <p className="text-lg text-gray-600 mb-8 text-center">
        **Escenario:** Una aplicación móvil híbrida (e-commerce y servicios financieros) necesita cumplir con la ISO 27001. Debemos decidir qué datos van a la base de datos relacional (MySQL) y cuáles a la base de datos NoSQL (MongoDB Atlas), priorizando los pilares CID.
      </p>

      {/* Reglas de Decisión */}
      <div className="mb-10 p-6 bg-indigo-50 border-l-4 border-indigo-500 rounded-lg">
        <h3 className="text-xl font-bold text-indigo-800 mb-3 flex items-center">
          <Code className="w-5 h-5 mr-2" />
          Reglas de Decisión de Arquitectura
        </h3>
        <ul className="space-y-2 text-gray-700 list-disc pl-5 text-sm">
          <li>**MySQL (Relacional):** Preferido para datos que requieren **Integridad** transaccional estricta y relaciones complejas (ej. pagos, inventario). El control de acceso es riguroso.</li>
          <li>**MongoDB Atlas (NoSQL):** Preferido para datos que requieren alta **Disponibilidad** y escalabilidad horizontal rápida (ej. logs, datos de sesión, comentarios) o modelos de datos flexibles.</li>
          <li>**Confidencialidad:** Se aplica a *ambas*, pero los datos de mayor sensibilidad que no requieren transaccionalidad estricta pueden beneficiarse de las características de cifrado y aislamiento específicas de MongoDB Atlas.</li>
        </ul>
      </div>

      {/* Tabla de Clasificación de Datos */}
      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Tipo de Dato y Sensibilidad</th>
              <th className="py-3 px-6 text-left">Datos Específicos</th>
              <th className="py-3 px-6 text-center">Pilar C.I.D. Prioritario</th>
              <th className="py-3 px-6 text-center">Base de Datos Sugerida</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {dataClassification.map((item, index) => (
              <tr
                key={index}
                className={`border-b border-gray-200 hover:bg-gray-50 ${item.db.includes('MySQL') ? 'bg-blue-50/50' : 'bg-green-50/50'}`}
              >
                <td className="py-3 px-6 text-left whitespace-nowrap font-medium text-gray-800">
                  {item.type}
                </td>
                <td className="py-3 px-6 text-left">
                  {item.data}
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <PilarIcon pilar={item.pilar} />
                    <span className="font-semibold">{item.pilar}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-center">
                  <DbIcon db={item.db} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Conclusión */}
      <div className="mt-8 p-6 bg-gray-100 rounded-xl border-t-4 border-gray-400">
        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-gray-600" />
          Conclusión SGSI (A.14 - Seguridad en Desarrollo)
        </h3>
        <p className="text-gray-700 text-sm">
          Esta arquitectura híbrida cumple con la ISO 27001 (Dominio A.14, 'Seguridad en Desarrollo') al aplicar el principio de **"Separación de Deberes"** y **"Mínimo Privilegio"**. Los datos altamente transaccionales (Integridad) residen en MySQL con su estricto esquema, mientras que los datos que requieren escalabilidad extrema y alta disponibilidad (Disponibilidad) se asignan a MongoDB Atlas. Las políticas de cifrado (A.10.1) deben ser aplicadas rigurosamente en *ambos* ambientes, especialmente en los datos de Confidencialidad Alta.
        </p>
      </div>
    </div>
  );
};


// ====================================================================
// --- 6. COMPONENTE PRINCIPAL: APP ---
// ====================================================================

const App = () => {
  // Estado para controlar la vista activa: 'mapa', 'quiz' o 'caso'
  const [activeView, setActiveView] = useState('mapa');

  // Clases para las pestañas de navegación principal
  const getTabClasses = useCallback((tab) =>
    `px-5 sm:px-8 py-3 font-bold text-base sm:text-lg rounded-t-xl transition-all duration-300 whitespace-nowrap border-t border-r border-l ${activeView === tab
      ? 'bg-white shadow-lg text-indigo-600 border-indigo-500 border-b-0 -mb-px z-10'
      : 'bg-gray-200 text-gray-600 hover:bg-white hover:text-indigo-500 border-gray-300 border-b-2'
    }`, [activeView]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-8 font-sans">
      <style>{`
        /* Definición de la animación para el ciclo PDCA */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-\\[spin\\_40s\\_linear\\_infinite\\] {
          animation: spin-slow 40s linear infinite;
        }
        /* Animación de entrada general */
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">

        {/* Título Principal */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-1">
            SGSI Interactivo
          </h1>
          <p className="text-xl text-gray-600">Herramienta de Estudio ISO 27001</p>
        </div>

        {/* Control de Vistas (Pestañas) */}
        <div className="flex justify-center border-b-2 border-gray-300 mb-10 overflow-x-auto relative">
          <button
            className={getTabClasses('mapa')}
            onClick={() => setActiveView('mapa')}
          >
            <Layers className="inline w-5 h-5 mr-2 -mt-1" />
            Mapa Conceptual ISO 27001
          </button>
          <button
            className={getTabClasses('quiz')}
            onClick={() => setActiveView('quiz')}
          >
            <HelpCircle className="inline w-5 h-5 mr-2 -mt-1" />
            Cuestionario de Seguridad
          </button>
          <button
            className={getTabClasses('caso')}
            onClick={() => setActiveView('caso')}
          >
            <Lightbulb className="inline w-5 h-5 mr-2 -mt-1" />
            Caso de Estudio (Híbrido DB)
          </button>
        </div>

        {/* Contenido de la Vista Activa */}
        <div className="pb-10 transition-opacity duration-500 animate-fade-in">
          {(() => {
            switch (activeView) {
              case 'mapa':
                return <ISO27001MapView />;
              case 'quiz':
                return <SecurityQuizView />;
              case 'caso':
                return <CaseStudyView />;
              default:
                return <ISO27001MapView />;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default App;