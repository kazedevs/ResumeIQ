declare global {
  interface FSItem {
    id: string;
    uid: string;
    name: string;
    path: string;
    is_dir: boolean;
    parent_id: string;
    parent_uid: string;
    created: number;
    modified: number;
    accessed: number;
    size: number | null;
    writable: boolean;
  }

  interface PuterUser {
    uuid: string;
    username: string;
  }

  interface KVItem {
    key: string;
    value: string;
  }

  interface ChatMessageContent {
    type: "file" | "text";
    puter_path?: string;
    text?: string;
  }

  interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string | ChatMessageContent[];
  }

  interface PuterChatOptions {
    model?: string;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    tools?: {
      type: "function";
      function: {
        name: string;
        description: string;
        parameters: { type: string; properties: {} };
      }[];
    };
  }

  interface AIResponse {
    index: number;
    message: {
      role: string;
      content: string | any[];
      refusal: null | string;
      annotations: any[];
    };
    logprobs: null | any;
    finish_reason: string;
    usage: {
      type: string;
      model: string;
      amount: number;
      cost: number;
    }[];
    via_ai_chat_service: boolean;
  }

  interface Window {
    puter: {
      auth: {
        getUser: () => Promise<PuterUser>;
        isSignedIn: () => Promise<boolean>;
        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
      };
      fs: {
        write: (
          path: string,
          data: string | File | Blob
        ) => Promise<FSItem | undefined>;
        read: (path: string) => Promise<Blob>;
        upload: (file: File[] | Blob[]) => Promise<FSItem>;
        delete: (path: string) => Promise<void>;
        readdir: (path: string) => Promise<FSItem[] | undefined>;
      };
      ai: {
        chat: (
          prompt: string | ChatMessage[],
          imageURL?: string | PuterChatOptions,
          testMode?: boolean,
          options?: PuterChatOptions
        ) => Promise<AIResponse>;
        img2txt: (
          image: string | File | Blob,
          testMode?: boolean
        ) => Promise<string>;
      };
      kv: {
        get: (key: string) => Promise<string | null>;
        set: (key: string, value: string) => Promise<boolean>;
        delete: (key: string) => Promise<boolean>;
        list: (pattern: string, returnValues?: boolean) => Promise<string[]>;
        flush: () => Promise<boolean>;
      };
    };
  }
  const puter: typeof window.puter;
}

export { };