import type { UIDataTypes, UIMessage, UIMessagePart, UITools } from 'ai'

// type: 'tool-generate-image',
// toolCallId: 'call_mHGZODpWgYKjIvt8bqt7iA2e',
// state: 'output-available',
// title: undefined,
// input: [Object],
// output: [],
// rawInput: undefined,
// errorText: undefined,
// providerExecuted: undefined,
// preliminary: undefined,
// callProviderMetadata: [Object]

export function transformResponseFiles(part: UIMessagePart<UIDataTypes, UITools>, parts: UIMessage['parts']) {
    if (part.type === 'file') parts.push(part)
}

export function transformResponseText(part: UIMessagePart<UIDataTypes, UITools>, parts: UIMessage['parts']) {
    if (part.type === 'text') parts.push(part)
}

export function transformResponseTool(part: UIMessagePart<UIDataTypes, UITools>, parts: UIMessage['parts']) {
    if (part.type === AI_TOOL.GENERATE_IMAGE && part.state === 'output-available') parts.push(part)
}
