/**
 * Política de cookies.
 *
 * ── Por qué declara DOS dominios ────────────────────────────────────────────
 * Este sitio y la aplicación son despliegues distintos con dominios distintos,
 * y sus cookies no se ven entre sí. Pero quien lee esta página no viene a
 * aprender arquitectura: viene a saber qué se le guarda en el navegador cuando
 * usa Barion. Publicar solo lo del sitio de venta —tres líneas y una cookie de
 * moneda— daría por declarado justo lo que no está: la sesión, el paso por
 * Google y la analítica, que son las que de verdad guardan algo.
 *
 * ── Por qué no hay banner, y por qué se dice ────────────────────────────────
 * Ninguna cookie de las que se listan es de publicidad ni de seguimiento entre
 * sitios: son la sesión, un pase de minutos y dos preferencias que la propia
 * persona eligió. La analítica de la aplicación no escribe nada en el
 * dispositivo. Un banner que pide permiso para lo estrictamente necesario
 * enseña a la gente a pulsar «aceptar» sin leer, que es lo contrario de lo que
 * la norma persigue. Lo que sí hay que hacer es declararlas, y eso es esta
 * página.
 */
import type { ConstructorDocumento } from "@/constants/legal/tipos"
import { seccionTitular } from "@/constants/legal/tipos"
import { etiquetasTitularEs } from "@/constants/legal/titular.es"

export const cookies: ConstructorDocumento = (identidad) => ({
  titulo: "Política de cookies",
  entradilla:
    "Qué se guarda en tu navegador cuando usas Barion, para qué sirve cada cosa, cuánto dura y cómo se borra. Cubre este sitio y la aplicación, que son dos dominios distintos.",
  secciones: [
    seccionTitular(identidad, etiquetasTitularEs),

    {
      id: "que-es",
      titulo: "Qué se guarda y por qué se declara",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Una cookie es un archivo pequeño que un sitio guarda en el navegador para reconocerlo en la petición siguiente. Barion usa las imprescindibles para que el servicio funcione y dos que recuerdan una preferencia que la propia persona eligió. No hay cookies de publicidad, ni de redes sociales, ni de seguimiento entre sitios ajenos.",
        },
        {
          tipo: "parrafo",
          texto:
            "Este sitio —la página que explica el producto— y la aplicación —el panel, el escaparate de cada barbería y la pantalla de pago— son dos despliegues con dominios distintos, y sus cookies no se comparten. Se declaran las dos aquí porque quien usa Barion pasa por ambos.",
        },
      ],
    },

    {
      id: "este-sitio",
      titulo: "En este sitio",
      bloques: [
        {
          tipo: "tabla",
          cabecera: ["Nombre", "Para qué", "Cuánto dura", "Tipo"],
          filas: [
            [
              "barion_region",
              "Recordar el país cuyos precios y moneda se están mirando, cuando se elige a mano en el selector. Sin ella se deduce del idioma del navegador en cada visita",
              "1 año",
              "Preferencia, propia",
            ],
          ],
        },
        {
          tipo: "parrafo",
          texto:
            "Es la única cookie de este sitio. La elección de tema claro u oscuro no es una cookie: se guarda en el almacenamiento local del navegador, no viaja en ninguna petición y no sale del dispositivo.",
        },
        {
          tipo: "parrafo",
          texto:
            "Este sitio no carga analítica, ni píxeles, ni scripts de terceros. Qué precios se enseñan se decide con el idioma que el navegador ya envía en cada petición: no se consulta ningún servicio de geolocalización y no se manda ningún dato a ninguna parte para averiguarlo.",
        },
      ],
    },

    {
      id: "aplicacion",
      titulo: "En la aplicación",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "La aplicación es lo que hay detrás de «entrar» y «crear mi barbería», más el escaparate público de cada barbería y la pantalla de pago. Estas son sus cookies:",
        },
        {
          tipo: "tabla",
          cabecera: ["Nombre", "Para qué", "Cuánto dura", "Tipo"],
          filas: [
            [
              "barion_sesion",
              "Mantener la sesión abierta. Es la que identifica a quien ya entró; sin ella habría que escribir la contraseña en cada pantalla",
              "En el panel se renueva mientras se trabaja, caduca por inactividad y tiene un tope por jornada. La sesión del cliente final en el escaparate dura 30 días, porque entra pocas veces",
              "Estrictamente necesaria, propia",
            ],
            [
              "barion_oauth_state",
              "Un valor de un solo uso que acompaña el viaje a Google y vuelve con él, para comprobar que la vuelta corresponde a la ida y no la fabricó otro sitio",
              "10 minutos",
              "Estrictamente necesaria, propia",
            ],
            [
              "barion_preregistro",
              "Transportar la identidad ya comprobada por Google entre la vuelta del proveedor y el envío del formulario de alta, que es donde se escriben los datos de la barbería",
              "20 minutos",
              "Estrictamente necesaria, propia",
            ],
            [
              "barion_preregistro_cliente",
              "Lo mismo, para el cliente final que entra al escaparate de una barbería con Google",
              "20 minutos",
              "Estrictamente necesaria, propia",
            ],
          ],
        },
        {
          tipo: "parrafo",
          texto:
            "Las cuatro son propias, se marcan para que el código de la página no pueda leerlas y viajan solo hacia Barion. Ninguna se comparte con terceros y ninguna sirve para perfilar a nadie.",
        },
        {
          tipo: "parrafo",
          texto:
            "Además, la aplicación guarda en el almacenamiento local del navegador tres preferencias de quien la usa: el tema claro u oscuro, el idioma elegido y la sede con la que se está trabajando. No son cookies, no viajan en ninguna petición y se van al borrar los datos del sitio.",
        },
      ],
    },

    {
      id: "analitica",
      titulo: "La analítica de la aplicación",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "En producción, la aplicación carga la analítica de Vercel en el panel y en el escaparate público de cada barbería. Sirve para saber qué se usa y qué no, de forma agregada.",
        },
        {
          tipo: "parrafo",
          texto:
            "Se declara aquí aunque no ponga cookies: no escribe nada en el dispositivo y no identifica a la persona. Lo que registra es la página visitada, de dónde se llegó, el tipo de dispositivo y el país aproximado. No hay identificador que permita seguir a alguien entre sitios.",
        },
        {
          tipo: "parrafo",
          texto:
            "En las pantallas donde se escribe una tarjeta no se carga, ni ella ni ningún otro script de terceros. El número de la tarjeta no llega a Barion —se cifra en el navegador contra el dominio de la pasarela—, y eso solo vale mientras la página que lo captura no ejecute código de nadie más.",
        },
        {
          tipo: "parrafo",
          texto: "Este sitio de venta no la carga en ninguna página.",
        },
      ],
    },

    {
      id: "gestion",
      titulo: "Cómo se borran o se bloquean",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Todas se gestionan desde el propio navegador: cada uno permite ver las cookies de un sitio, borrarlas y bloquearlas, y borrar también el almacenamiento local. Están en los ajustes de privacidad del navegador, bajo «cookies y datos de sitios».",
        },
        {
          tipo: "parrafo",
          texto:
            "Borrar o bloquear las cookies de este sitio solo hace que la moneda vuelva a deducirse del idioma del navegador. Bloquear las de la aplicación tiene otra consecuencia: sin la cookie de sesión no se puede mantener la sesión abierta, así que no se puede entrar al panel ni terminar una reserva. No es una elección de Barion, es lo que significa una sesión.",
        },
      ],
    },

    {
      id: "cambios-cookies",
      titulo: "Cambios en esta política",
      bloques: [
        {
          tipo: "parrafo",
          texto: `Si se añade, se retira o cambia el propósito de alguna de estas cookies, esta página se actualiza y sube su versión. Para cualquier duda sobre lo que se guarda en tu navegador, el canal es ${identidad.correo}.`,
        },
      ],
    },
  ],
})
