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
  }