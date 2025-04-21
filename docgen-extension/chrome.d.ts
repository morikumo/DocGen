// chrome.d.ts
declare namespace chrome {
    namespace tabs {
      interface Tab {
        id?: number;
        url?: string;
        title?: string;
        active: boolean;
        windowId?: number;
      }
      
      function query(
        queryInfo: {active?: boolean, currentWindow?: boolean}, 
        callback: (tabs: Tab[]) => void
      ): void;
    }

    namespace storage {
      interface StorageArea {
        get(keys: string | string[] | Object | null, callback: (items: { [key: string]: any }) => void): void;
        set(items: Object, callback?: () => void): void;
        remove(keys: string | string[], callback?: () => void): void;
        clear(callback?: () => void): void;
      }
      
      const local: StorageArea;
      const sync: StorageArea;
    }
  }