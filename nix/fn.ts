// Primon Proto
// Headless WebSocket, type-safe Whatsapp Bot
//
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can usable with mjs)
//
// Phaticusthiccy - 2022


export type PrimonDataTypes = {
    str: string
    obj: object
    und: undefined
    null: null
    inf: typeof Infinity
  }
  
  export function afkMsg(lang: string) {
    if (lang == "tr") {
      return "Merhaba {name} 🙋‍♂️ \n\nEndişelenme, bu bir bot. Sahibim şu anda müsait değil. Sizin yazdığınızı ona bildirdim. En kısa sürede dönüş yapacaktır. 😉 \n\n{%c}: *{%d} {%t} Önce* \n{%n}: {%s}"
    } else {
      return "Hello {name} \n\nDont Worry, this is just a bot. My owner is busy now. But you can sure ı noticed this to him. As soon as possible, he will return. 😉 \n\n {%c}: *{%d} {%t} Ago* \n{%n}: {%s}"
    }
  }
  
  //
  // {%c}: Son Görülme
  // {%d}: 29
  // {%t}: Dakika | Saat | Saniye
  // {%n}: Sebep
  // {%s}: Uyuyorum ...string[]
  //
  