import { Menu, ClickArgs } from "../../contextmenu/types";
import { render } from "./render";
import { getSingleDOM } from "../../utils/dom";

export async function getMetadataMenu(): Promise<Menu | null> {
  const uid = await window.roam42.common.getPageUidByTitle("roam/enhance/metadata");
  if (uid) {
    const info = await window.roam42.common.getBlockInfoByUID(uid, true);
    const menu = info[0][0].children.find((a) => /^\s*menu\s*$/.test(a.string));
    const data = info[0][0].children.find((a) => /^\s*menu\s+type\s*$/.test(a.string));
    if (!menu?.children) return;
    return {
      text: "Metadata",
      children: menu?.children.map((s) => {
        const text = s.string.replace("[[", "").replace("]]", "");
        return {
          text,
          onClick: async (clickArgs: ClickArgs) => {
            try {
              const tagBlockList = await Promise.all(
                s.children
                  .sort((a, b) => a.order - b.order)
                  .map(async (s) => {
                    if (/\(\(.*\)\)/.test(s.string)) {
                      const uid = s.string.match(/\(\((.*)\)\)/)[1];
                      const info = await window.roam42.common.getBlockInfoByUID(uid, true);
                      return info[0][0];
                    } else {
                      return data?.children.find(
                        (d) =>
                          s.string.replace("[[", "").replace("]]", "") ===
                          d.string.replace("[[", "").replace("]]", "")
                      );
                    }
                  })
              );
              render(getSingleDOM("metadata"), {
                open: true,
                tagBlockList: tagBlockList.filter(Boolean),
                clickArgs,
                menuText: text
              });
            } catch (e) {
              console.log("Metadata error", e);
            }
          }
        };
      })
    };
  }
}
