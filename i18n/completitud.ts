import en from "@/messages/en.json"
import es from "@/messages/es.json"

/**
 * **El inglés no compila si le falta una clave del español.**
 *
 * Es una línea y sustituye a lo que daban los diccionarios en TypeScript. La
 * asignación es la comprobación: para que `en` valga como `typeof es`, tiene que
 * traer todas sus claves con la misma forma. Sobrarle alguna sí está permitido
 * —`avisoIdiomaLegal` solo existe en inglés, porque es el aviso de que el texto
 * legal está redactado en español—.
 *
 * Sin esto, traducir a medias pasa el build: la pantalla no revienta, le habla
 * en español a quien no lo entiende, y eso se descubre cuando lo dice un cliente.
 */
export const mensajesEn: typeof es = en
