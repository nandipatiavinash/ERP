export function showSuccess(message: string = "Submitted successfully!") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("show-success-alert", { detail: { message } }));
  }
}
