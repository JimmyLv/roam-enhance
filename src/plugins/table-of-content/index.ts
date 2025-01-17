import { debounce, throttle } from "lodash";
import tippy, { Instance } from "tippy.js";
import { runPlugin } from "../../utils/common";
import "./index.less";

runPlugin("table-of-content", ({ ctx, name }) => {
  function getTOC(list?: Roam.Block[]): Roam.Block[] {
    return (
      list
        ?.sort((a, b) => a.order - b.order)
        .flatMap((a) => {
          if (a.children) {
            if (a.heading) {
              const children = getTOC(a.children);
              if (children.length > 0) {
                return [{ ...a, children }];
              } else {
                delete a.children;
                return a;
              }
            } else {
              return [];
            }
          } else {
            return a.heading ? [a] : [];
          }
        }) || []
    );
  }
  ctx.tippyInstances = [] as Instance[];
  ctx.onMenuMouseDown = async (e: MouseEvent) => {
    if (e.button === 0) {
      const target = e.currentTarget as HTMLElement;
      const uid = target.dataset.uid;
      if (!uid) return;
      if (e.shiftKey) {
        await window.roamAlphaAPI.ui.rightSidebar.addWindow({
          window: { "block-uid": uid, type: "outline" }
        });
        if (!document.getElementById("roam-right-sidebar-content")) {
          setTimeout(() => {
            ctx.tippyInstances[0]?.popperInstance.forceUpdate();
          }, 500);
        }
      } else {
        document.location.href = window.roam42.common.baseUrl().href + "/" + uid;
      }
    }
  };
  function getMenu(blocks?: Roam.Block[], depth = 0) {
    return (
      blocks
        ?.flatMap((a) => {
          return [
            `<div class="rm-level${a.heading}" data-uid="${
              a.uid
            }" onmousedown="window.roamEnhance._plugins['${name}'].onMenuMouseDown(event)">
                <a class="bp3-menu-item bp3-popover-dismiss">
                    <div style="padding-left: ${
                      16 * depth
                    }px" class="bp3-text-overflow-ellipsis bp3-fill">
                        ${a.string
                          .replace(
                            /\*\*.+?\*\*/g,
                            (m) => `<span class="rm-bold"><span>${m.slice(2, -2)}</span></span>`
                          )
                          .replace(
                            /\^\^.+?\^\^/g,
                            (m) =>
                              `<span class="rm-highlight"><span>${m.slice(2, -2)}</span></span>`
                          )
                          .replace(
                            /\~\~.+?\~\~/g,
                            (m) =>
                              `<del class="rm-strikethrough"><span>${m.slice(2, -2)}</span></del>`
                          )
                          .replace(
                            /\_\_.+?\_\_/g,
                            (m) => `<em class="rm-italics"><span>${m.slice(2, -2)}</span></em>`
                          )}
                    </div>
                </a>
            </div>`,
            ...(a.children ? [`${getMenu(a.children, depth + 1)}`] : [])
          ];
        })
        .join("") || ""
    );
  }

  ctx.showByUid = async (uid: string) => {
    if (ctx.tippyInstances.length) {
      const info = await window.roam42.common.getBlockInfoByUID(uid, true);
      ctx.tippyInstances[0].setContent(getMenu(getTOC(info[0][0].children)) || "没有标题层级");
      ctx.tippyInstances[0].show();
    }
  };

  const createButton = throttle(
    debounce(
      (titleDOM: HTMLElement, isPageTitle: boolean) => {
        const id = "show-toc";
        const old = document.getElementById(id);
        if (!old) {
          const div = document.createElement("div");
          div.id = id;
          div.onclick = async (e: MouseEvent) => {
            if (isPageTitle) {
              window.requestAnimationFrame(async () => {
                const pageTitle =
                  (document.querySelector(".roam-article .rm-title-display") as HTMLDivElement)
                    ?.innerText ||
                  (document.querySelector(
                    ".roam-article .rm-title-editing-display"
                  ) as HTMLDivElement)?.innerText;
                const uid = await window.roam42.common.getPageUidByTitle(pageTitle);
                await ctx.showByUid(uid);
              });
            } else {
              const id = document.querySelector(".rm-block__input")?.id;
              if (id) {
                await ctx.showByUid(window.roamEnhance.utils.getBlockUidFromId(id));
              }
            }
          };
          if (isPageTitle && !document.querySelector(".roam-article .roam-log-container")) {
            (titleDOM.parentNode as HTMLElement).style.position = "relative";
            titleDOM.before(div);
          } else {
            titleDOM.appendChild(div);
          }

          ctx.tippyInstances.forEach((ins: Instance) => ins?.destroy());
          ctx.tippyInstances = tippy("#" + id, {
            theme: "toc",
            placement: "bottom-end",
            allowHTML: true,
            interactive: true,
            arrow: false,
            trigger: "click",
            animation: false,
            content: "没有标题层级",
            onShow: () => {
              div.classList.add("open");
            },
            onHide: () => {
              div.classList.remove("open");
            }
          });
        }
      },
      100,
      { leading: true, trailing: true }
    ),
    50,
    { leading: true, trailing: true }
  );

  document.arrive(".roam-article .rm-title-display", { existing: true }, (el: HTMLElement) => {
    createButton(el, true);
  });
  document.arrive(
    ".roam-article .rm-title-editing-display",
    { existing: true },
    (el: HTMLElement) => {
      createButton(el, true);
    }
  );
  document.arrive(".roam-article .rm-zoom", { existing: true }, (el: HTMLElement) => {
    createButton(el, false);
  });
});
