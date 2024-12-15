// electron.d.ts
declare global {
  interface Window {
    electron: {
      readNotes: () => Promise<string[]>;  // 读取笔记的 API
      writeNotes: (notes: string[]) => Promise<{ success: boolean; message?: string }>; // 写入笔记的 API
    };
  }
}

// 为了使 TypeScript 能够理解这个声明文件
export {};
