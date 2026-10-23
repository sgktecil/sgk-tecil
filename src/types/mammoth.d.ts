declare module 'mammoth' {
  export interface MammothResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
    }>;
  }

  export interface MammothOptions {
    arrayBuffer?: ArrayBuffer;
    buffer?: Buffer;
    path?: string;
  }

  export function extractRawText(input: { arrayBuffer: ArrayBuffer }): Promise<MammothResult>;
  export function convertToHtml(input: { arrayBuffer: ArrayBuffer }): Promise<MammothResult>;
}
