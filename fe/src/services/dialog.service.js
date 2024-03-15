import { createApp } from "vue";
import DialogComponent from "@/components/ui/Dialog.vue"; // Adjust path as needed

function openDialog(message) {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const dialogApp = createApp(DialogComponent, { message });
  const instance = dialogApp.mount(div);

  return instance.open().finally(() => {
    dialogApp.unmount();
    document.body.removeChild(div);
  });
}

export default openDialog;
