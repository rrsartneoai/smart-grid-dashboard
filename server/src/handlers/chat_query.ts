
import { type ChatQueryInput, type ChatMessage } from '../schema';

export declare function chatQuery(input: ChatQueryInput): Promise<ChatMessage>;
