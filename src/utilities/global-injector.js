// override logs if app runing in production mode
// because logging uses much more CPU and memory
export function overrideLogs() {
  // eslint-disable-next-line no-console
  console.log = () => null;

  // eslint-disable-next-line no-console
  console.info = () => null;

  // eslint-disable-next-line no-console
  console.warn = () => null;

  // eslint-disable-next-line no-console
  console.error = () => null;
}
