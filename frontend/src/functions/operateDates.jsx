export const formatDateWithLabels = (date) => {
  if (
    date.getDate() === new Date().getDate() &&
    date.getMonth() === new Date().getMonth() &&
    date.getFullYear() === new Date().getFullYear()
  ) {
    return "Today";
  } else if (
    date.getDate() === new Date().getDate() + 1 &&
    date.getMonth() === new Date().getMonth() &&
    date.getFullYear() === new Date().getFullYear()
  ) {
    return "Tomorrow";
  } else if (
    date.getDate() === new Date().getDate() - 1 &&
    date.getMonth() === new Date().getMonth() &&
    date.getFullYear() === new Date().getFullYear()
  ) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
    });
  }
};
export const isFutureDate = (value) => {
  if (!value) return true;
  const today = new Date();
  const inputDate = new Date(value);
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);
  return inputDate > today || "Please select a future date";
};
