import React, { useState } from "react";
import ReactDOM from "react-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

const Component = ({ open: open0 = true, dom }) => {
  const [open, setOpen] = useState(open0);
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      onExited={() => {
        const unmountRet = ReactDOM.unmountComponentAtNode(dom);
        unmountRet && dom.parentNode?.removeChild(dom);
      }}
    >
      <DialogTitle>=======</DialogTitle>
      xxx
    </Dialog>
  );
};

export function render(dom: HTMLElement, { open }) {
  ReactDOM.render(<Component open={open} dom={dom} />, dom);
}
