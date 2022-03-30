const dispatch = window.Metabase.store.dispatch;

window.Metabase.store.dispatch = (action) => {
  const result = dispatch(action);
  if (typeof action === "object" && "type" in action) {
    window.postMessage({ type: "dispatch", action });
  }
  return result;
};
