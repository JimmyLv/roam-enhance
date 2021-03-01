declare const BUILD_VERSION: string;

declare namespace Roam {
  interface Block {
    string: string;
    uid: string;
    order: number;
    children: Block[];
  }
}

declare interface Window {
  roamjs?: {
    alerted: boolean;
    loaded: Set<string>;
    extension: {
      [id: string]: {
        [method: string]: (args?: unknown) => void;
      };
    };
    dynamicElements: Set<HTMLElement>;
  };
  roam42?: {
    help: {
      displayMessage: (s: string, delay: number) => void;
    };
    smartBlocks?: {
      customCommands: {
        key: string; // `<% ${string} %> (SmartBlock function)`, sad - https://github.com/microsoft/TypeScript/issues/13969
        icon: "gear";
        value: string;
        processor: (match: string) => Promise<string | void>;
      }[];
      activeWorkflow: {
        outputAdditionalBlock: (text: string) => void;
      };
      proccessBlockWithSmartness: (s: string) => Promise<string>;
    };
    dateProcessing: {
      testIfRoamDateAndConvert: (s: string) => string;
    };
    common: {
      navigateUiTo: (title: string) => void;
      getPageUidByTitle: (title: string) => Promise<string>;
      getBlockInfoByUID: (uid: string, withChild?: boolean) => Promise<[[Roam.Block]] | null>;
      createBlock: (uid: string, order: number, string: string) => Promise<string>;
      updateBlock: (uid: string, string: string) => Promise<void>;
      deleteBlock: (uid: string) => Promise<void>;
      getDirectBlockParentUid: (
        uid: string
      ) => Promise<{ parentUID: string; order: number } | null>;
      getBlocksReferringToThisPage: (title: string) => Promise<[Roam.Block][]>;
      getBlocksReferringToThisBlockRef: (uid: string) => Promise<[Roam.Block][]>;
      getPageNamesFromBlockUidList: (
        uids: string[]
      ) => Promise<[Roam.Block, { uid: string; title: string }][]>;
    };
  };
  iziToast?: import("izitoast").IziToast;
}