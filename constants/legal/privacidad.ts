/**
 * Política de privacidad y tratamiento de datos personales.
 *
 * ── Lo que este documento tiene que dejar claro antes que nada ──────────────
 * Barion aparece en DOS papeles distintos, y confundirlos es el error que hace
 * inútil una política de privacidad de un producto multi-inquilino:
 *
 *  · frente a quien CONTRATA —el dueño de la barbería y su equipo— y frente a
 *    quien visita este sitio, Barion es el **responsable**: decide qué recoge y
 *    para qué;
 *  · frente a los CLIENTES FINALES de cada barbería, Barion es solo el
 *    **encargado**: los datos son de la barbería, que decide, y Barion los trata
 *    por su cuenta. Quien quiera ejercer un derecho sobre ellos se dirige a su
 *    barbería, y Barion la asiste.
 *
 * Por eso la primera sección de fondo es esa distinción y no la lista de datos:
 * sin ella, cada apartado siguiente admite dos lecturas contradictorias.
 *
 * ── Regla de contenido ──────────────────────────────────────────────────────
 * Solo lo que el sistema hace de verdad. Los plazos que se citan están escritos
 * en el código o en estos mismos documentos; los destinatarios son los de
 * `config/legal.ts`, que es la única lista, y por eso se importa en vez de
 * volver a escribirla.
 */
import type { ConstructorDocumento } from "@/constants/legal/tipos"
import { seccionTitular } from "@/constants/legal/tipos"
import { etiquetasTitularEs } from "@/constants/legal/titular.es"
import { SUBENCARGADOS } from "@/config/legal"

export const privacidad: ConstructorDocumento = (identidad) => ({
  titulo: "Política de privacidad",
  entradilla:
    "Qué datos personales trata Barion, para qué, con quién los comparte, cuánto los guarda y cómo se ejercen los derechos sobre ellos. Cubre la Ley 1581 de 2012 de Colombia y el Reglamento General de Protección de Datos europeo.",
  secciones: [
    seccionTitular(identidad, etiquetasTitularEs),

    {
      id: "dos-papeles",
      titulo: "Barion está en dos papeles, y no significan lo mismo",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Barion trata datos de dos grupos de personas muy distintos, y su papel cambia en cada uno. Distinguirlos es lo que decide a quién hay que pedirle qué.",
        },
        {
          tipo: "lista",
          items: [
            "Quien contrata Barion, su equipo y quien visita este sitio: aquí Barion es el responsable. Decide qué datos recoge y para qué, y responde directamente ante esas personas.",
            "Los clientes finales de cada barbería —los que reservan un corte—: aquí Barion es solo el encargado. La responsable es la barbería, que decide qué recoge de sus clientes y para qué; Barion se limita a tratarlos por su cuenta para prestarle el servicio, según el anexo de los términos y condiciones.",
          ],
        },
        {
          tipo: "parrafo",
          texto:
            "En la práctica: si eres cliente de una barbería y quieres saber qué se guarda de ti, borrar tus datos o dejar de recibir recordatorios, el interlocutor es tu barbería. Si nos escribes a nosotros, trasladamos la petición a la barbería que corresponda y la ayudamos a atenderla, pero no podemos decidir por ella sobre unos datos que no son nuestros.",
        },
      ],
    },

    {
      id: "que-datos",
      titulo: "Qué datos se recogen",
      bloques: [
        {
          tipo: "parrafo",
          texto: "Como responsable, Barion recoge lo siguiente:",
        },
        {
          tipo: "tabla",
          cabecera: ["De quién", "Qué", "De dónde sale"],
          filas: [
            [
              "Quien crea una barbería",
              "Nombre, correo, teléfono, contraseña guardada como resumen criptográfico, y el nombre, la dirección pública y el país de la barbería",
              "Lo escribe en el formulario de alta",
            ],
            [
              "Quien entra con Google",
              "Correo, nombre e identificador de la cuenta de Google",
              "Lo devuelve Google al autorizar el acceso, y solo si se elige esa vía",
            ],
            [
              "El equipo de la barbería",
              "Nombre, correo y, si se indica, teléfono; el rol y los permisos que le asigna quien administra",
              "Lo da de alta quien administra la barbería",
            ],
            [
              "La barbería que paga",
              "Datos fiscales, si decide registrarlos; marca de la tarjeta, cuatro últimos dígitos y caducidad; historial de facturas y cobros",
              "Los escribe en la aplicación; los de tarjeta llegan de la pasarela ya tokenizados",
            ],
            [
              "Quien usa la aplicación",
              "Página visitada, procedencia, tipo de dispositivo y país aproximado",
              "Analítica de uso, sin cookies y sin identificar a la persona",
            ],
            [
              "Quien visita este sitio",
              "El país cuya moneda se está mirando, guardado en una cookie propia",
              "Se deduce del idioma del navegador o se elige a mano en el selector",
            ],
            [
              "Cualquiera que use el servicio",
              "Registros técnicos: fecha y hora, dirección IP, ruta pedida y resultado, y la auditoría de las acciones relevantes dentro del panel",
              "Los genera el propio servicio al funcionar",
            ],
          ],
        },
        {
          tipo: "parrafo",
          texto:
            "Barion no recoge datos de categorías especiales —salud, ideología, origen étnico, biometría— y no hay ningún campo del producto pensado para ellos. Tampoco toma decisiones automatizadas con efectos jurídicos ni elabora perfiles con esa finalidad.",
        },
        {
          tipo: "parrafo",
          texto:
            "De los clientes finales de cada barbería, Barion trata como encargado lo que la barbería registra: nombre, teléfono, correo, fecha de nacimiento si se anota, historial de citas y de consumo, notas y preferencias, y puntos de fidelidad. Qué se recoge de ellos y para qué lo decide la barbería.",
        },
      ],
    },

    {
      id: "para-que",
      titulo: "Para qué se tratan y con qué legitimación",
      bloques: [
        {
          tipo: "tabla",
          cabecera: ["Para qué", "Base en el RGPD", "Base en la Ley 1581"],
          filas: [
            [
              "Crear la cuenta, dar acceso y prestar el servicio contratado",
              "Ejecución del contrato",
              "Autorización del titular al registrarse y ejecución del contrato",
            ],
            [
              "Verificar que detrás de un alta hay alguien real, antes de publicar su escaparate",
              "Ejecución del contrato e interés legítimo en evitar altas fraudulentas",
              "Autorización del titular",
            ],
            [
              "Cobrar la suscripción, emitir la factura y llevar la contabilidad",
              "Ejecución del contrato y obligación legal",
              "Ejecución del contrato y obligación legal",
            ],
            [
              "Enviar avisos del servicio: verificación, invitaciones, cambios de contraseña, avisos de cobro y de impago",
              "Ejecución del contrato",
              "Autorización del titular",
            ],
            [
              "Enviar avisos de cambios en estos documentos o en el precio",
              "Obligación legal e interés legítimo en informar",
              "Autorización del titular",
            ],
            [
              "Dar soporte y resolver incidencias",
              "Ejecución del contrato",
              "Autorización del titular",
            ],
            [
              "Medir el uso de la aplicación de forma agregada para mejorarla",
              "Interés legítimo, con datos que no identifican a la persona",
              "Interés legítimo del responsable",
            ],
            [
              "Mantener la seguridad, prevenir abusos y conservar la auditoría de acciones",
              "Interés legítimo",
              "Interés legítimo del responsable",
            ],
          ],
        },
        {
          tipo: "parrafo",
          texto:
            "Barion no manda correo comercial a quien no lo ha pedido y no vende ni cede datos personales a nadie con fines publicitarios.",
        },
      ],
    },

    {
      id: "destinatarios",
      titulo: "Con quién se comparten",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Barion se apoya en proveedores que tratan datos por su cuenta y bajo contrato. Es la lista completa: no hay más.",
        },
        {
          tipo: "tabla",
          cabecera: ["Proveedor", "Para qué", "Qué datos ve", "Dónde trata"],
          filas: SUBENCARGADOS.map((s) => [s.nombre, s.papel, s.datos, s.donde]),
        },
        {
          tipo: "parrafo",
          texto:
            "Fuera de esa lista, los datos solo se comunican a una autoridad cuando una norma o una resolución lo exija, y a los asesores legales o contables de Barion cuando sea necesario para defender un derecho.",
        },
      ],
    },

    {
      id: "transferencias",
      titulo: "Transferencias fuera del país",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Parte de esos proveedores trata datos en Estados Unidos, así que hay transferencias internacionales. Se amparan en las garantías que exige cada normativa: cláusulas contractuales tipo aprobadas por la Comisión Europea para los datos sujetos al RGPD, y la autorización del titular junto con las garantías contractuales equivalentes para los datos sujetos a la Ley 1581.",
        },
        {
          tipo: "parrafo",
          texto: "Se puede pedir copia de esas garantías escribiendo al correo de contacto.",
        },
      ],
    },

    {
      id: "conservacion",
      titulo: "Cuánto se guardan",
      bloques: [
        {
          tipo: "tabla",
          cabecera: ["Qué", "Cuánto"],
          filas: [
            [
              "Datos de la cuenta y de la barbería",
              "Mientras la suscripción esté vigente, y 90 días después de la baja para poder reactivarla sin pérdida",
            ],
            [
              "Datos de los clientes finales de una barbería",
              "Lo decide la barbería, que es la responsable. Al terminar el contrato se suprimen o se le devuelven, según elija",
            ],
            [
              "Facturas, cobros y registros contables",
              "El plazo que exija la normativa fiscal aplicable, aunque la cuenta ya no exista",
            ],
            [
              "Avisos recibidos de la pasarela de pago",
              "30 días desde que quedan resueltos. Los que quedaron pendientes o fallidos se conservan mientras sigan sin resolver: son la prueba de que un pago no se aplicó",
            ],
            [
              "Registros técnicos y auditoría de acciones",
              "El tiempo necesario para investigar incidencias de seguridad y atender reclamaciones",
            ],
            [
              "Tokens de invitación, restablecimiento y códigos de acceso",
              "Lo que dura su vigencia: 48 horas la invitación al equipo, minutos los pases de acceso",
            ],
          ],
        },
        {
          tipo: "parrafo",
          texto:
            "Terminados los plazos, los datos se suprimen o se anonimizan. Un dato se anonimiza en vez de borrarse cuando la fila sostiene un hecho contable que no se puede perder —una cita ya liquidada sostiene una comisión y una factura—: en esos casos se retiran el nombre, el teléfono y el correo, y queda el hecho sin la persona.",
        },
      ],
    },

    {
      id: "derechos",
      titulo: "Qué derechos hay y cómo se ejercen",
      bloques: [
        {
          tipo: "parrafo",
          texto: `Toda persona puede pedir acceso a sus datos, su rectificación, su supresión, la limitación u oposición a su tratamiento, la portabilidad, y retirar la autorización que dio. Se ejercen escribiendo a ${identidad.correo}, desde la dirección de correo asociada a la cuenta o acreditando la identidad de otra forma razonable.`,
        },
        {
          tipo: "lista",
          items: [
            "Bajo el RGPD, la respuesta llega en el plazo de un mes, prorrogable dos meses más cuando la petición sea compleja, avisando de la prórroga.",
            "Bajo la Ley 1581, una consulta se atiende en 10 días hábiles y un reclamo en 15 días hábiles, prorrogables en los términos que fija la propia norma.",
            "Ejercer un derecho es gratuito. Solo una petición manifiestamente infundada o repetitiva puede tener coste, y se avisaría antes.",
            "Retirar la autorización o pedir la supresión no afecta a la licitud de lo tratado antes, ni a lo que deba conservarse por obligación legal.",
          ],
        },
        {
          tipo: "parrafo",
          texto:
            "Si la respuesta no satisface, se puede reclamar ante la autoridad de control: la Superintendencia de Industria y Comercio en Colombia, y la Agencia Española de Protección de Datos —o la autoridad del país de residencia— en el Espacio Económico Europeo. Reclamar ante la autoridad no exige haber escrito antes a Barion, aunque suele resolverse antes así.",
        },
        {
          tipo: "parrafo",
          texto:
            "Si eres cliente de una barbería, escribe a tu barbería: es la responsable de tus datos. Barion, como encargado, no puede borrar por su cuenta la ficha que otra empresa lleva de ti, pero traslada la petición y la asiste para atenderla.",
        },
      ],
    },

    {
      id: "seguridad",
      titulo: "Cómo se protegen",
      bloques: [
        {
          tipo: "lista",
          items: [
            "Los datos de cada barbería están aislados en la propia base de datos: una barbería no puede leer los de otra, y el aislamiento lo impone el motor, no solo el código de la aplicación.",
            "El tráfico entre el navegador y Barion viaja cifrado.",
            "Las contraseñas se guardan como resumen criptográfico. Nadie en Barion puede leerlas, ni siquiera para dar soporte.",
            "La sesión viaja en una cookie que el código de la página no puede leer, lo que la protege frente al robo por scripts inyectados.",
            "El número completo de una tarjeta nunca llega a los sistemas de Barion: se tokeniza en el navegador contra el dominio de la pasarela, que devuelve una referencia. Barion guarda la marca, los cuatro últimos dígitos y la caducidad.",
            "Las acciones relevantes dentro del panel quedan registradas con quién las hizo y cuándo.",
          ],
        },
        {
          tipo: "parrafo",
          texto:
            "Ninguna medida elimina el riesgo por completo. Si se produjera una violación de seguridad que afecte a datos personales, Barion la notifica a quien corresponda —la barbería afectada, y la autoridad de control cuando la norma lo exija— sin dilación indebida.",
        },
      ],
    },

    {
      id: "menores",
      titulo: "Menores de edad",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Barion no está dirigido a menores: quien contrata es una persona o empresa que ejerce una actividad profesional.",
        },
        {
          tipo: "parrafo",
          texto:
            "Una barbería puede tener clientes menores de edad, y sus datos los registra ella bajo su responsabilidad: es la barbería quien debe contar con la autorización de quien ejerza la patria potestad y limitar los datos a los necesarios para atenderlos.",
        },
      ],
    },

    {
      id: "cambios-privacidad",
      titulo: "Cambios en esta política",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Esta política se puede actualizar. Cada versión lleva su fecha, que es la que aparece en la cabecera de esta página. Un cambio relevante en las finalidades, en los destinatarios o en los plazos se avisa por correo con al menos 30 días de antelación.",
        },
      ],
    },
  ],
})
