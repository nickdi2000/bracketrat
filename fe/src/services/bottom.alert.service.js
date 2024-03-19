import { createApp } from "vue";
import BottomAlertComponent from "@/components/ui/BottomAlert.vue"; // Adjust path as needed

function bottomAlert(message, details = null) {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const dialogApp = createApp(BottomAlertComponent, { message, details });
  const instance = dialogApp.mount(div);

  setTimeout(() => {
    dialogApp.unmount();
    document.body.removeChild(div);
  }, 5000);

  // return instance.open().finally(() => {
  //   dialogApp.unmount();
  //   document.body.removeChild(div);
  // });
}

export default bottomAlert;
