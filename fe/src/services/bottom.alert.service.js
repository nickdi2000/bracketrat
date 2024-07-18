import { createApp } from "vue";
import BottomAlertComponent from "@/components/ui/BottomAlert.vue"; // Adjust path as needed

function bottomAlert(message, details = null) {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const dialogApp = createApp(BottomAlertComponent, { message, details });
  const instance = dialogApp.mount(div);

  // Open the alert (ensure it's visible when created)
  if (instance.open) {
    instance.open();
  }

  // Automatically close the alert after 9 seconds
  setTimeout(() => {
    if (instance.close) {
      instance.close();
    }
    setTimeout(() => {
      dialogApp.unmount();
      document.body.removeChild(div);
    }, 500); // Allow some time for the close animation
  }, 9000);
}

export default bottomAlert;
