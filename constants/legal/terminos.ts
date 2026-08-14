/**
 * Términos y condiciones del servicio, con el anexo de encargo del tratamiento
 * dentro.
 *
 * ── Por qué el anexo va AQUÍ y no en un documento aparte ────────────────────
 * El encargo del tratamiento (lo que el RGPD llama contrato entre responsable y
 * encargado, y la Ley 1581 el encargo del responsable) no es un documento que
 * alguien vaya a buscar por su cuenta: es una parte del contrato que se firma al
 * contratar. Publicarlo suelto obliga a aceptarlo aparte, y una barbería que
 * acepta los términos y no el anexo se queda sin cobertura para tratar los datos
 * de sus propios clientes — que es justo lo que hace todos los días.
 *
 * ── Regla de contenido ──────────────────────────────────────────────────────
 * Nada que el sistema no haga. Los plazos, los estados y las duraciones que se
 * citan aquí están escritos en el código: siete días de prueba, cuatro
 * reintentos en los días 0, 1, 3 y 6, siete días de cortesía por defecto, treinta
 * días de retención de los avisos de la pasarela. Un término que promete lo que
 * el producto no hace se descubre en la primera reclamación.
 */
import type { ConstructorDocumento, SeccionLegal } from "@/constants/legal/tipos"
import { seccionTitular } from "@/constants/legal/tipos"
import { etiquetasTitularEs } from "@/constants/legal/titular.es"
import { SUBENCARGADOS, type IdentidadLegal } from "@/config/legal"

/** Solo existe cuando se sabe qué ley se cita. Ver `IDENTIDAD_LEGAL`. */
function seccionLeyAplicable(identidad: IdentidadLegal): SeccionLegal[] {
  if (!identidad.jurisdiccion) return []

  return [
    {
      id: "ley-aplicable",
      titulo: "Ley aplicable",
      bloques: [
        {
          tipo: "parrafo",
          texto: `Este contrato se rige por la ley de ${identidad.jurisdiccion}. Cualquier controversia se somete a los tribunales de ese territorio, sin perjuicio de las normas imperativas del país donde la barbería tenga su domicilio cuando la ley las imponga.`,
        },
      ],
    },
  ]
}

export const terminos: ConstructorDocumento = (identidad) => ({
  titulo: "Términos y condiciones",
  entradilla:
    "Las condiciones bajo las que una barbería contrata Barion: qué se contrata, cómo se cobra, cómo se cancela y qué pasa con los datos después. Incluye, como anexo, el encargo del tratamiento de los datos de los clientes de la barbería.",
  secciones: [
    seccionTitular(identidad, etiquetasTitularEs),

    {
      id: "objeto",
      titulo: "Qué se contrata",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Barion es un servicio de software que se usa por internet, sin instalar nada. Lo que se contrata es el acceso al servicio para una barbería, con las funciones que traiga el plan elegido.",
        },
        {
          tipo: "lista",
          items: [
            "La agenda de citas y las reservas del día a día.",
            "Un escaparate público en una dirección propia, donde los clientes de la barbería reservan solos.",
            "La ficha de cada cliente y su historial.",
            "El equipo, los servicios, las comisiones y la liquidación de la nómina.",
            "El correo transaccional que el servicio envía en nombre de la barbería: verificación, invitaciones al equipo, códigos de acceso y recordatorios de cita.",
          ],
        },
        {
          tipo: "parrafo",
          texto:
            "El correo es hoy el único canal de mensajería del servicio. Barion no envía mensajes por WhatsApp ni por SMS, y no asume el coste de ningún canal de mensajería de pago: si en el futuro se ofrece esa integración, será contra una cuenta de la propia barbería con el proveedor.",
        },
        {
          tipo: "parrafo",
          texto:
            "Qué funciones y qué topes trae cada plan se publica en la página de precios y se consulta dentro de la aplicación. Barion puede añadir funciones, mejorar las existentes y retirar las que dejen de tener uso; si una retirada afecta a lo que el plan contratado prometía, se avisa con antelación por correo.",
        },
      ],
    },

    {
      id: "quien-contrata",
      titulo: "Quién puede contratar",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Barion se contrata para una actividad profesional: quien lo contrata es la persona o empresa titular de la barbería, o alguien con poder para obligarla. No es un servicio dirigido a consumidores, y por eso no aplican las condiciones pensadas para ellos, como el desistimiento de una compra a distancia.",
        },
        {
          tipo: "parrafo",
          texto:
            "Quien crea la cuenta declara ser mayor de edad y tener capacidad para contratar, y responde de que los datos de la barbería que registra son ciertos.",
        },
      ],
    },

    {
      id: "cuenta",
      titulo: "La cuenta y quién entra en ella",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "El alta crea una barbería y una primera cuenta que la administra. Esa cuenta da de alta al resto del equipo: cada persona recibe una invitación por correo con un enlace de un solo uso, válido 48 horas, y elige su propia contraseña. Barion no reparte contraseñas.",
        },
        {
          tipo: "parrafo",
          texto:
            "El escaparate público de una barbería no se sirve hasta que se verifica el correo de quien la registró. Es lo que impide que un alta abierta llene internet de escaparates falsos.",
        },
        {
          tipo: "lista",
          items: [
            "Las credenciales son personales: quien las comparte responde de lo que se haga con ellas.",
            "Quien administra decide qué permisos tiene cada persona de su equipo, y responde de esa decisión.",
            "Un acceso que se sospeche comprometido se comunica de inmediato al correo de contacto.",
            "La sesión del panel se renueva mientras se trabaja y caduca por inactividad, con un tope por jornada. La sesión del cliente final en el escaparate dura más porque entra pocas veces.",
          ],
        },
      ],
    },

    {
      id: "prueba",
      titulo: "La prueba",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Toda barbería que se registra empieza con 7 días de prueba del plan Profesional, sin tarjeta y sin compromiso. Durante la prueba el servicio está completo.",
        },
        {
          tipo: "parrafo",
          texto:
            "Al terminar la prueba sin haber contratado un plan, la barbería pasa a solo lectura: se consulta la agenda, la ficha de los clientes y el historial, pero no se escribe. No se borra nada y no se desactiva a nadie. Contratar un plan la reactiva entera.",
        },
        {
          tipo: "parrafo",
          texto:
            "La prueba es una por barbería. Registrar la misma barbería otra vez para volver a probar no da derecho a una prueba nueva.",
        },
      ],
    },

    {
      id: "precios",
      titulo: "Planes, precios e impuestos",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Cada plan se contrata con una de tres duraciones: mensual, semestral o anual. Lo que se paga es el precio publicado para el país de la barbería y en la moneda de ese país, que se fija al crearla y no cambia porque se mire la página desde otro sitio.",
        },
        {
          tipo: "parrafo",
          texto:
            "Los precios publicados se entienden con los impuestos que correspondan según el país. La factura que emite Barion detalla el impuesto aplicado.",
        },
        {
          tipo: "parrafo",
          texto:
            "Barion puede cambiar sus precios. Un cambio nunca afecta a un período ya pagado: se aplica a la renovación siguiente y se avisa por correo con al menos 30 días de antelación, tiempo suficiente para cancelar antes de que se cobre el precio nuevo.",
        },
        {
          tipo: "parrafo",
          texto:
            "Cambiar de plan hacia arriba o hacia abajo no abre un período nuevo ni cobra nada en el acto: el cambio surte efecto y el precio nuevo se aplica en la renovación siguiente. Si al bajar de plan la barbería excede los topes del plan nuevo, no se desactiva a nadie por su cuenta —eso destruiría agendas y liquidaciones—: se bloquean las altas nuevas y quien administra decide qué ajustar.",
        },
      ],
    },

    {
      id: "cobro",
      titulo: "Cómo se cobra y cómo se renueva",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "La suscripción se renueva automáticamente al final de cada período por la misma duración contratada, mientras no se cancele. Es la forma normal del servicio: sin renovación automática, la agenda de una barbería se apagaría un lunes por la mañana por no haber mirado un correo.",
        },
        {
          tipo: "parrafo",
          texto:
            "Al renovar, Barion emite la factura del período y cobra el importe con la tarjeta guardada. La tarjeta se registra en el navegador contra el dominio de la pasarela de pago, que devuelve un identificador: Barion guarda la marca, los cuatro últimos dígitos y la fecha de caducidad, nunca el número completo.",
        },
        {
          tipo: "parrafo",
          texto:
            "Si no hay tarjeta guardada, o si el cobro es rechazado, se avisa por correo y se puede pagar con un enlace de pago que abre el checkout de la pasarela. Un cobro rechazado se reintenta hasta cuatro veces, repartidas en los días 0, 1, 3 y 6 desde el primer intento; un rechazo definitivo —una tarjeta cancelada, por ejemplo— detiene los reintentos, porque insistir no lo arregla.",
        },
        {
          tipo: "parrafo",
          texto:
            "Cada pago aprobado deja su factura y su comprobante, que se consultan en la aplicación y se envían por correo. Si la barbería registra sus datos fiscales, la factura los congela tal y como estaban el día que se emitió: una factura no cambia porque después cambie una dirección.",
        },
      ],
    },

    {
      id: "impago",
      titulo: "Qué pasa si un cobro no entra",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Cuando un cobro no se puede aplicar, la cuenta entra en mora y se abre un período de cortesía. Por defecto son 7 días, y puede acordarse otro plazo para una cuenta concreta. Durante la cortesía el servicio sigue completo y se avisa por correo.",
        },
        {
          tipo: "parrafo",
          texto:
            "Agotada la cortesía sin haber pagado, la barbería pasa a solo lectura: se consulta todo, no se escribe nada. No se borra información, no se desactiva a nadie y no se cancela la cuenta — una cuenta cortada sigue estando y puede pagar al día siguiente. En cuanto el pago entra, el acceso vuelve solo.",
        },
      ],
    },

    {
      id: "cancelacion",
      titulo: "Cómo se cancela",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "La cancelación se pide desde la propia aplicación, en cualquier momento y sin dar explicaciones. No hay permanencia mínima ni penalización.",
        },
        {
          tipo: "parrafo",
          texto:
            "Cancelar no corta el servicio en el acto: la suscripción sigue activa hasta el final del período ya pagado y no se renueva al llegar esa fecha. El importe del período en curso no se prorratea ni se devuelve, porque el servicio se presta durante todo ese tiempo. Mientras no llegue esa fecha, la cancelación se puede revertir.",
        },
        {
          tipo: "parrafo",
          texto:
            "Barion puede terminar el contrato avisando por correo con 30 días de antelación, y de inmediato si se incumple el apartado de uso aceptable o si una cuenta lleva impagada más allá de la cortesía.",
        },
      ],
    },

    {
      id: "datos-al-terminar",
      titulo: "Qué pasa con los datos después",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Los datos que la barbería carga en Barion —sus clientes, sus citas, su equipo, sus servicios y su historial— son suyos. Barion los trata para prestar el servicio y no los usa para otra cosa, no los vende y no los cede a nadie fuera de lo que declara la política de privacidad.",
        },
        {
          tipo: "lista",
          items: [
            "Mientras la cuenta esté activa, los datos se exportan desde la aplicación cuando se quiera.",
            "En solo lectura —prueba vencida o corte por impago— siguen consultables y exportables: cortar la lectura le haría perder el día a la barbería, no le cobraría antes.",
            "Tras la baja definitiva, los datos se conservan 90 días para poder reactivar la cuenta sin pérdida. Pasado ese plazo se suprimen o se anonimizan.",
            "Lo que Barion debe conservar por obligación legal —facturas y los registros contables asociados— se conserva el tiempo que exija la normativa fiscal aplicable, aunque la cuenta ya no exista.",
          ],
        },
        {
          tipo: "parrafo",
          texto:
            "Una petición de supresión anticipada se atiende en el correo de contacto y no espera a los 90 días.",
        },
      ],
    },

    {
      id: "pagos-del-cliente-final",
      titulo: "Barion no cobra a los clientes de la barbería",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Barion cobra a la barbería su suscripción, y nada más. No procesa los pagos que los clientes finales le hacen a la barbería: puede registrar cómo se pagó un corte, pero el dinero de ese corte nunca pasa por Barion.",
        },
        {
          tipo: "parrafo",
          texto:
            "Al cliente final no se le cobra nada por reservar: ni recargo, ni cargo por reserva, ni comisión sobre la cita, ni una línea en su comprobante. El coste de Barion es de la barbería y se queda en la barbería.",
        },
        {
          tipo: "parrafo",
          texto:
            "El impuesto que la barbería configura y que aparece en sus comprobantes es el que ella le cobra a su cliente por el servicio prestado. Es su obligación como vendedora y existiría igual sin Barion.",
        },
      ],
    },

    {
      id: "uso-aceptable",
      titulo: "Uso aceptable",
      bloques: [
        {
          tipo: "parrafo",
          texto: "Contratar Barion es contratar una herramienta de gestión. No se puede usar para:",
        },
        {
          tipo: "lista",
          items: [
            "Cargar datos personales de terceros sin una base legal para tratarlos, o usarlos para algo distinto de aquello para lo que se recogieron.",
            "Mandar comunicaciones no solicitadas a quien no las pidió o pidió dejar de recibirlas.",
            "Suplantar a otra barbería, ocupar identificadores públicos que no le corresponden o hacerse pasar por Barion.",
            "Intentar acceder a datos de otra barbería, sondear el servicio en busca de fallos sin autorización previa, o cargarlo de forma que degrade el servicio de los demás.",
            "Revender el acceso a Barion, o dar acceso a un tercero que no sea parte del equipo de la barbería.",
            "Cualquier actividad ilícita bajo la ley que le aplique a la barbería.",
          ],
        },
        {
          tipo: "parrafo",
          texto:
            "Barion puede suspender de inmediato una cuenta que esté causando un daño en curso —a otras barberías, a los datos de alguien o al propio servicio— y avisar después.",
        },
      ],
    },

    {
      id: "disponibilidad",
      titulo: "Disponibilidad y soporte",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Barion trabaja para que el servicio esté disponible siempre, pero no promete un porcentaje de disponibilidad ni un tiempo de respuesta contractual: no hay acuerdo de nivel de servicio, y decir lo contrario sin poder sostenerlo sería peor que no decirlo.",
        },
        {
          tipo: "parrafo",
          texto:
            "Habrá ventanas de mantenimiento. Las programadas se avisan por correo y se buscan en horario de poca actividad; las urgentes —un fallo de seguridad, una avería del proveedor— pueden no poder avisarse antes.",
        },
        {
          tipo: "parrafo",
          texto: "El soporte se presta por el correo de contacto, en español, en horario laboral.",
        },
      ],
    },

    {
      id: "propiedad",
      titulo: "De quién es cada cosa",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "El software, el diseño, la marca y la documentación de Barion son de Barion. Contratar el servicio da derecho a usarlo mientras dure la suscripción; no transfiere ninguna propiedad ni permite copiarlo, descompilarlo ni derivar de él un producto competidor.",
        },
        {
          tipo: "parrafo",
          texto:
            "Los datos, el logotipo, los colores y los textos que la barbería carga son de la barbería. Barion los usa exclusivamente para prestarle el servicio, incluido pintarlos en su escaparate público y en los correos que se envían en su nombre, que es para lo que se cargan.",
        },
      ],
    },

    {
      id: "responsabilidad",
      titulo: "Responsabilidad",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Barion responde de prestar el servicio con la diligencia debida y de cumplir lo que dice el anexo de tratamiento de datos. No responde del uso que la barbería haga de la herramienta: de la exactitud de lo que carga, de las citas que confirma, del trato con sus clientes, de sus obligaciones fiscales ni de sus obligaciones laborales con su equipo.",
        },
        {
          tipo: "parrafo",
          texto:
            "Salvo por dolo o culpa grave, y salvo lo que la ley no permita limitar, la responsabilidad total de Barion frente a la barbería se limita al importe que esa barbería le haya pagado en los 12 meses anteriores al hecho que la origine. Barion no responde del lucro cesante ni de daños indirectos.",
        },
        {
          tipo: "parrafo",
          texto:
            "La barbería mantiene indemne a Barion frente a las reclamaciones de terceros que nazcan de un uso suyo contrario a estos términos, incluida la carga de datos personales sin base legal para tratarlos.",
        },
      ],
    },

    {
      id: "cambios",
      titulo: "Cambios en estos términos",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Estos términos se pueden actualizar. Cada versión lleva su fecha, que es la que se ve en la cabecera de esta página y la misma que queda guardada como la versión aceptada al darse de alta.",
        },
        {
          tipo: "parrafo",
          texto:
            "Un cambio relevante —el precio, cómo se cobra, cómo se cancela o cómo se tratan los datos— se avisa por correo con al menos 30 días de antelación. Seguir usando el servicio después de esa fecha vale como aceptación; quien no esté de acuerdo puede cancelar antes de que el cambio entre en vigor, sin penalización.",
        },
        {
          tipo: "parrafo",
          texto:
            "Los cambios que solo corrigen una errata o aclaran una frase sin cambiar lo que dice entran en vigor al publicarse.",
        },
      ],
    },

    ...seccionLeyAplicable(identidad),

    {
      id: "anexo-encargo",
      titulo: "Anexo · Tratamiento de datos por cuenta de la barbería",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Este anexo forma parte de los términos y regula el tratamiento que Barion hace de los datos personales de los clientes finales y del equipo de la barbería. Se acepta con ellos, en el mismo acto.",
        },
        {
          tipo: "parrafo",
          texto:
            "La barbería es la responsable del tratamiento de esos datos: es ella quien decide para qué los recoge y quién los usa. Barion es el encargado: los trata por su cuenta, siguiendo sus instrucciones, y no toma decisiones propias sobre ellos.",
        },
        {
          tipo: "lista",
          items: [
            "Objeto: prestar el servicio descrito en estos términos.",
            "Duración: mientras esté vigente la suscripción, más el plazo de conservación que declara el apartado «Qué pasa con los datos después».",
            "Naturaleza y finalidad: registrar, consultar, modificar, conservar, comunicar a los subencargados listados abajo y suprimir, todo ello para que la barbería gestione su agenda, su clientela y su equipo.",
            "Tipo de datos: identificación y contacto (nombre, teléfono, correo, fecha de nacimiento cuando se registra), historial de citas y de consumo, notas y preferencias que escriba la barbería, puntos de fidelidad, y los datos del equipo necesarios para calcular su liquidación.",
            "Categorías de interesados: los clientes finales de la barbería y las personas de su equipo.",
          ],
        },
        {
          tipo: "parrafo",
          texto: "Barion se obliga a:",
        },
        {
          tipo: "lista",
          items: [
            "Tratar los datos únicamente conforme a las instrucciones de la barbería, que son las que se dan usando el servicio, y no usarlos para fines propios ni cederlos a terceros distintos de los subencargados declarados.",
            "Guardar confidencialidad, y exigírsela por escrito a quien tenga acceso.",
            "Aplicar medidas de seguridad adecuadas: aislamiento de los datos de cada barbería en la propia base de datos, de modo que una barbería no pueda leer los de otra; cifrado del tráfico; contraseñas guardadas como resumen criptográfico, nunca en claro; y tokenización de los datos de tarjeta contra la pasarela de pago, de forma que el número completo no llega a los sistemas de Barion.",
            "Asistir a la barbería, en la medida en que el servicio lo permita, para atender las peticiones de acceso, rectificación, supresión, oposición, limitación y portabilidad que le lleguen de sus clientes.",
            "Comunicarle sin dilación indebida cualquier violación de seguridad que afecte a sus datos, con lo que se sepa de su alcance y de las medidas tomadas.",
            "Poner a su disposición la información necesaria para demostrar el cumplimiento de este anexo y permitir auditorías razonables, previo aviso y sin interferir en la operación.",
            "A la terminación del contrato, suprimir o devolver los datos según elija la barbería, salvo lo que deba conservarse por obligación legal.",
          ],
        },
        {
          tipo: "parrafo",
          texto:
            "La barbería, por su parte, garantiza que tiene base legal para tratar los datos que carga y que ha informado a sus clientes de que usa un proveedor de software para gestionarlos.",
        },
        {
          tipo: "parrafo",
          texto:
            "Barion trabaja con los subencargados que siguen. Alta o cambio de subencargado se comunica por correo con antelación, y la barbería puede oponerse por un motivo razonable; si la oposición impide prestar el servicio, cualquiera de las dos partes puede terminar el contrato sin penalización.",
        },
        {
          tipo: "tabla",
          cabecera: ["Subencargado", "Para qué", "Qué datos ve", "Dónde trata"],
          filas: SUBENCARGADOS.map((s) => [s.nombre, s.papel, s.datos, s.donde]),
        },
        {
          tipo: "parrafo",
          texto:
            "Parte de esos subencargados trata datos fuera del país de la barbería. Las transferencias se amparan en las garantías que exige la normativa aplicable —cláusulas contractuales tipo en el caso europeo, y la autorización del titular o las garantías equivalentes en el colombiano—, y se detallan en la política de privacidad.",
        },
      ],
    },
  ],
})
