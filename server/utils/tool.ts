import type { UIMessageStreamWriter } from 'ai'

import { openai } from '@ai-sdk/openai'
import { Readability } from '@mozilla/readability'
import { gateway, generateImage, generateText, tool } from 'ai'
import * as cheerio from 'cheerio'
import { JSDOM } from 'jsdom'
import z from 'zod'

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36'

export async function fetchUrlTool({ userId, writer }: { userId: string; writer: UIMessageStreamWriter }) {
    return tool({
        description: 'Descarga el contenido de una URL y lo devuelve texto para análisis.',
        execute: async ({ prompt, url }) => {
            return withHeartbeat(writer, async () => {
                try {
                    const response = await fetch(url, {
                        headers: {
                            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
                            Connection: 'keep-alive',
                            'User-Agent': USER_AGENT,
                        },
                    })
                    if (!response.ok) throw new Error('Error al descargar la URL.')

                    const html = await response.text()

                    const dom = new JSDOM(html, { url })
                    const reader = new Readability(dom.window.document)
                    const article = reader.parse()

                    let content = article?.textContent ?? ''

                    if (!content || content.length < 200) {
                        const $ = cheerio.load(html)
                        $('script, style, nav, footer, header, noscript').remove()
                        content = $('body').text()
                    }

                    content = content.replace(/\s+/g, ' ').trim().slice(0, 20_000)

                    const { text, usage } = await generateText({
                        model: gateway('deepseek/deepseek-v3.2'),
                        prompt: `Analiza la siguiente página web y proporciona un resumen detallado del contenido.\n\nUsa el siguiente prompt como guía: ${prompt}\n\nContenido:\n${content}`,
                        system: 'Eres un asistente que ayuda a resumir contenido web.',
                    })

                    await saveUsageTokens({ model: 'deepseek/deepseek-v3.2', usage, userId })

                    return text
                } catch (error) {
                    console.log(error)
                    throw new Error('Error al descargar la URL.')
                }
            })
        },
        inputSchema: z.object({
            prompt: z.string().describe('Un prompt opcional para guiar el análisis del contenido de la URL'),
            url: z.string().describe('La URL que debe descargarse y analizarse'),
        }),
        outputSchema: z.string(),
    })
}

export async function generateImageTool({ userId, writer }: { userId: string; writer: UIMessageStreamWriter }) {
    return tool({
        description: 'Genera una o varias imágenes usando el modelo de imágenes de OpenAI.',
        execute: async ({ n, prompt }) => {
            return withHeartbeat(writer, async () => {
                const errorText = `Error al generar ${n > 1 ? 'las imágenes' : 'la imagen.'}.`

                try {
                    const { images, usage } = await generateImage({
                        model: openai.image('gpt-image-1-mini'),
                        n,
                        prompt,
                        providerOptions: {
                            openai: { quality: 'medium' },
                        },
                    })

                    await saveUsageTokens({ model: 'gpt-image-1-mini', usage, userId })

                    const response = await connectUpload({
                        data: images.map((image) => ({ base64: image.base64, mediaType: image.mediaType })),
                        path: `users/${userId}/generations`,
                        type: 'generated',
                        userId,
                    })

                    if (!response) throw new Error(errorText)

                    return response.map((file) => file.url)
                } catch (error) {
                    console.log(error)
                    throw new Error(errorText)
                }
            })
        },
        inputSchema: z.object({
            n: z.number().int().min(1).max(4).default(1).describe('Número de imágenes a generar (1-4)'),
            prompt: z.string().describe('El mensaje que debe utilizarse para generar la imagen'),
        }),
        outputSchema: z.array(z.string()),
    })
}
