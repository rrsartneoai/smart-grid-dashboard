
import { type ChatMessage } from '../schema';

export declare function getChatMessages(conversationId: number): Promise<ChatMessage[]>;
