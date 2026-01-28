import { ToolLoopAgent } from 'ai'

export function instructionAgent() {
    const agent = new ToolLoopAgent({
        instructions: 'You are an expert software engineer.',
        model: 'openai/gpt-5-mini',
    })
}
