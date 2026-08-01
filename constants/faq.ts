/**
 * Las preguntas que se hacen ANTES de decidir, respondidas con lo que Barion
 * hace hoy. Cumplen tres trabajos con un solo texto:
 *
 *  1. quitan la objeción a quien está mirando la página;
 *  2. se publican como `FAQPage` en JSON-LD, que es como un buscador entiende
 *     que aquí hay una respuesta y no un eslogan;
 *  3. se sirven en `/llms.txt`, que es de donde un modelo saca el contexto
 *     cuando alguien le pregunta qué es Barion.
 *
 * Por eso la respuesta es TEXTO PLANO, sin JSX ni marcado: los tres destinos
 * consumen la misma cadena. Un enlace dentro de una respuesta la partiría en
 * dos y obligaría a mantener dos versiones.
 *
 * Regla de contenido: nada que Barion no haga. Ni permanencia inventada, ni
 * integraciones que no existen, ni cifras de clientes — no hay clientes
 * todavía. Una respuesta falsa aquí se paga en la primera factura.
 */

export interface Pregunta {
  pregunta: string
  respuesta: string
}

export interface GrupoPreguntas {
  /** Identificador del acordeón: `<details name>` hace que solo uno se abra. */
  id: string
  titulo: string
  preguntas: Pregunta[]
}

export const gruposPreguntas: GrupoPreguntas[] = [
  {
    id: "empezar",
    titulo: "Empezar",
    preguntas: [
      {
        pregunta: "¿Qué es Barion exactamente?",
        respuesta:
          "Un software de gestión para barberías: la agenda con reserva en línea, la ficha de cada cliente, las comisiones y la liquidación de tu equipo, y un escaparate público donde tus clientes reservan solos. Funciona en el navegador y está hecho para el dueño de la barbería, no para el cliente final.",
      },
      {
        pregunta: "¿Qué necesito para empezar?",
        respuesta:
          "Un navegador. Creas tu barbería con nombre, correo, teléfono y la dirección pública que elijas, cargas tus servicios y tus barberos, y compartes tu enlace. No se instala nada, ni en tu equipo ni en el móvil de tus clientes.",
      },
      {
        pregunta: "¿Cuánto tardo en tenerlo funcionando?",
        respuesta:
          "Una tarde. Son tres pasos: crear la barbería, cargar servicios y barberos, y compartir tu enlace por WhatsApp, en tu perfil o con el QR del local. A partir de ahí el primer cliente ya puede reservar.",
      },
      {
        pregunta: "¿La prueba pide tarjeta?",
        respuesta:
          "No. Son 15 días completos sin tarjeta y eliges plan al final. Si decides no seguir, exportas tus datos y ya está.",
      },
      {
        pregunta: "¿Sirve si trabajo solo, sin equipo?",
        respuesta:
          "Sí. El plan de entrada está pensado para un local, y la agenda, el escaparate y la ficha de clientes funcionan igual con un barbero que con cinco. Las comisiones simplemente se quedan esperando a que contrates.",
      },
    ],
  },
  {
    id: "funcionamiento",
    titulo: "Cómo funciona",
    preguntas: [
      {
        pregunta: "¿Cómo reservan mis clientes?",
        respuesta:
          "Desde tu escaparate: tu barbería tiene su propia dirección pública. El cliente entra, elige servicio, barbero y una hora que esté libre de verdad, confirma su teléfono y la cita queda hecha. Sin llamar, sin esperar respuesta y sin instalar nada.",
      },
      {
        pregunta: "¿Qué pasa si dos clientes piden la misma hora?",
        respuesta:
          "No pasa: el solape lo rechaza el sistema, no tu memoria. La agenda conoce la jornada de cada barbero, sus descansos y sus ausencias, así que solo ofrece horas que esa silla puede atender.",
      },
      {
        pregunta: "¿Se le avisa al cliente antes de la cita?",
        respuesta:
          "Sí, sale un recordatorio automático antes de cada cita. Es lo que baja las ausencias sin que nadie tenga que escribir mensajes uno a uno.",
      },
      {
        pregunta: "¿Los mensajes de WhatsApp o SMS los pagan ustedes?",
        respuesta:
          "No, y por eso la suscripción cuesta lo que ves. WhatsApp y SMS son canales que conecta cada barbería con su propia cuenta de proveedor: tú contratas el canal y Barion envía por él. Lo que Barion no hace es meter ese coste variable dentro del precio ni cobrarte por mensaje enviado.",
      },
      {
        pregunta: "¿Barion le cobra a mis clientes?",
        respuesta:
          "No. Barion no procesa pagos de clientes finales: registra cómo se pagó cada cita para que la caja y las comisiones cuadren. El cobro sigue siendo tuyo, en tu local y con los medios que ya usas.",
      },
      {
        pregunta: "¿Cada barbero ve toda la información de la barbería?",
        respuesta:
          "No. Hay roles y permisos: el barbero entra a su panel, ve su agenda y lo que ha producido, y nada más. Las cuentas de la barbería, el resto del equipo y la configuración son del dueño y de quien él autorice.",
      },
      {
        pregunta: "¿Puedo tener varias sedes?",
        respuesta:
          "Sí, con el plan que las incluya. Cada sede lleva su agenda, su equipo y sus horarios, y las cuentas se leen por sede o todas juntas, bajo la misma barbería y con el mismo inicio de sesión.",
      },
    ],
  },
  {
    id: "precio-datos",
    titulo: "Precio, datos y permanencia",
    preguntas: [
      {
        pregunta: "¿En qué moneda pago?",
        respuesta:
          "En la de tu país. Barion opera en Colombia (COP), Estados Unidos (USD) y España (EUR), y el precio de cada país es un precio propio, no la conversión del cambio del día. El país de facturación se fija cuando creas la barbería; el selector de esta página solo cambia los precios que estás mirando.",
      },
      {
        pregunta: "¿Hay permanencia?",
        respuesta:
          "No. No hay contrato de permanencia ni penalización: te vas cuando quieras y dejas de pagar el mes siguiente.",
      },
      {
        pregunta: "¿Me puedo llevar mis datos si me voy?",
        respuesta:
          "Sí. Tus clientes, tus citas y tus cuentas se exportan cuando quieras, no solo el día que te vas. Los datos de tu barbería son tuyos.",
      },
      {
        pregunta: "¿Mis datos están mezclados con los de otras barberías?",
        respuesta:
          "No. Cada barbería está aislada y esa separación la impone la base de datos, no una condición que alguien pueda olvidar escribir en el código. Nadie de otra barbería puede leer tu agenda ni tus clientes.",
      },
      {
        pregunta: "¿Qué pasa con mis citas si cambio de plan?",
        respuesta:
          "Nada. Cambias de plan cuando el negocio lo pida y lo que ya está agendado se queda tal cual, con su barbero, su hora y su precio.",
      },
      {
        pregunta: "¿Mi barbería aparecerá en un directorio de Barion?",
        respuesta:
          "No. Barion no es un marketplace: no hay buscador ni directorio de barberías donde tus clientes se encuentren con la competencia. Tu escaparate es tuyo y a él llega quien tú invitas, con tu enlace o con el QR del local.",
      },
    ],
  },
]

/**
 * Todas las preguntas en plano. Es lo que consumen el JSON-LD y `/llms.txt`:
 * a ellos los grupos no les dicen nada, y derivarlo evita la lista paralela que
 * se olvida de actualizar.
 */
export const preguntasFrecuentes: Pregunta[] = gruposPreguntas.flatMap((grupo) => grupo.preguntas)
